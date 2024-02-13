package eventstream

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/pkg/errors"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/pkg/logging"
)

var (
	// ErrOutputInNoReadererHandler happens when a handler func returned some messages in a no-writer handler.
	// todo: maybe change the handler func signature in no-writer handler so that there's no possibility for this
	ErrOutputInNoReadererHandler = errors.New("returned output messages in a handler without writer")
)

// HandlerFunc is function called when message is received.
//
// msg.Ack() is called automatically when HandlerFunc doesn't return error.
// When HandlerFunc returns error, msg.Nack() is called.
// When msg.Ack() was called in handler and HandlerFunc returns error,
// msg.Nack() will be not sent because Ack was already sent.
//
// HandlerFunc's are executed parallel when multiple messages was received
// (because msg.Ack() was sent in HandlerFunc or Reader supports multiple consumers).
type HandlerFunc func(msg *Message) ([]*Message, error)

// NoPublishHandlerFunc is HandlerFunc alternative, which doesn't produce any messages.
type NoPublishHandlerFunc func(msg *Message) error

// PassthroughHandler is a handler that passes the message unchanged from the reader to the writer.
var PassthroughHandler HandlerFunc = func(msg *Message) ([]*Message, error) {
	return []*Message{msg}, nil
}

// HandlerMiddleware allows us to write something like decorators to HandlerFunc.
// It can execute something before handler (for example: modify consumed message)
// or after (modify produced messages, ack/nack on consumed message, handle errors, logging, etc.).
//
// It can be attached to the router by using `AddMiddleware` method.
//
// Example:
//
//	func ExampleMiddleware(h message.HandlerFunc) message.HandlerFunc {
//		return func(message *message.Message) ([]*message.Message, error) {
//			fmt.Println("executed before handler")
//			producedMessages, err := h(message)
//			fmt.Println("executed after handler")
//
//			return producedMessages, err
//		}
//	}
type HandlerMiddleware func(h HandlerFunc) HandlerFunc

// RouterPlugin is function which is executed on Router start.
type RouterPlugin func(*Router) error

// WriterDecorator wraps the underlying Writer, adding some functionality.
type WriterDecorator func(writer Writer) (Writer, error)

// ReaderDecorator wraps the underlying Reader, adding some functionality.
type ReaderDecorator func(reader Reader) (Reader, error)

// RouterConfig holds the Router's configuration options.
type RouterConfig struct {
	// CloseTimeout determines how long router should wait for handlers when closing.
	CloseTimeout time.Duration
}

func (c *RouterConfig) setDefaults() {
	if c.CloseTimeout == 0 {
		c.CloseTimeout = time.Second * 30
	}
}

// Validate returns Router configuration error, if any.
func (c RouterConfig) Validate() error {
	return nil
}

// NewRouter creates a new Router with given configuration.
func NewRouter(config RouterConfig, logger logging.BCPLogger) (*Router, error) {
	config.setDefaults()
	if err := config.Validate(); err != nil {
		return nil, errors.Wrap(err, "invalid config")
	}

	return &Router{
		config: config,

		handlers: map[string]*handler{},

		handlersWg:        &sync.WaitGroup{},
		runningHandlersWg: &sync.WaitGroup{},
		handlerAdded:      make(chan struct{}),

		closeCh:  make(chan struct{}),
		closedCh: make(chan struct{}),

		logger: logger,

		running: make(chan struct{}),
	}, nil
}

type middleware struct {
	Handler       HandlerMiddleware
	HandlerName   string
	IsRouterLevel bool
}

// Router is responsible for handling messages from readers using provided handler functions.
//
// If the handler function returns a message, the message is writeed with the writer.
// You can use middlewares to wrap handlers with common logic like logging, instrumentation, etc.
type Router struct {
	config RouterConfig

	middlewares []middleware

	plugins []RouterPlugin

	handlers     map[string]*handler
	handlersLock sync.RWMutex

	handlersWg        *sync.WaitGroup
	runningHandlersWg *sync.WaitGroup
	handlerAdded      chan struct{}

	closeCh    chan struct{}
	closedCh   chan struct{}
	closed     bool
	closedLock sync.Mutex

	logger logging.BCPLogger

	writerDecorators []WriterDecorator
	readerDecorators []ReaderDecorator

	isRunning bool
	running   chan struct{}
}

// Logger returns the Router's logger.
func (r *Router) Logger() logging.BCPLogger {
	return r.logger
}

// AddMiddleware adds a new middleware to the router.
//
// The order of middleware matters. Middleware added at the beginning is executed first.
func (r *Router) AddMiddleware(m ...HandlerMiddleware) {
	r.addRouterLevelMiddleware(m...)
}

func (r *Router) addRouterLevelMiddleware(m ...HandlerMiddleware) {
	for _, handlerMiddleware := range m {
		middleware := middleware{
			Handler:       handlerMiddleware,
			HandlerName:   "",
			IsRouterLevel: true,
		}
		r.middlewares = append(r.middlewares, middleware)
	}
}

func (r *Router) addHandlerLevelMiddleware(handlerName string, m ...HandlerMiddleware) {
	for _, handlerMiddleware := range m {
		middleware := middleware{
			Handler:       handlerMiddleware,
			HandlerName:   handlerName,
			IsRouterLevel: false,
		}
		r.middlewares = append(r.middlewares, middleware)
	}
}

// AddPlugin adds a new plugin to the router.
// Plugins are executed during startup of the router.
//
// A plugin can, for example, close the router after SIGINT or SIGTERM is sent to the process (SignalsHandler plugin).
func (r *Router) AddPlugin(p ...RouterPlugin) {

	r.plugins = append(r.plugins, p...)
}

// AddWriterDecorators wraps the router's Writer.
// The first decorator is the innermost, i.e. calls the original writer.
func (r *Router) AddWriterDecorators(dec ...WriterDecorator) {
	r.writerDecorators = append(r.writerDecorators, dec...)
}

// AddReaderDecorators wraps the router's Reader.
// The first decorator is the innermost, i.e. calls the original reader.
func (r *Router) AddReaderDecorators(dec ...ReaderDecorator) {
	r.readerDecorators = append(r.readerDecorators, dec...)
}

// Handlers returns all registered handlers.
func (r *Router) Handlers() map[string]HandlerFunc {
	handlers := map[string]HandlerFunc{}

	for handlerName, handler := range r.handlers {
		handlers[handlerName] = handler.handlerFunc
	}

	return handlers
}

// DuplicateHandlerNameError is sent in a panic when you try to add a second handler with the same name.
type DuplicateHandlerNameError struct {
	HandlerName string
}

func (d DuplicateHandlerNameError) Error() string {
	return fmt.Sprintf("handler with name %s already exists", d.HandlerName)
}

// AddHandler adds a new handler.
//
// handlerName must be unique. For now, it is used only for debugging.
//
// readerTopic is a topic from which handler will receive messages.
//
// writeTopic is a topic to which router will produce messages returned by handlerFunc.
// When handler needs to write to multiple topics,
// it is recommended to just inject Readerer to Handler or implement middleware
// which will catch messages and write to topic based on metadata for example.
//
// If handler is added while router is already running, you need to explicitly call RunHandlers().
func (r *Router) AddHandler(
	handlerName string,
	readerTopic string,
	reader Reader,
	writerTopic string,
	writer Writer,
	handlerFunc HandlerFunc,
) *Handler {

	r.handlersLock.Lock()
	defer r.handlersLock.Unlock()

	if _, ok := r.handlers[handlerName]; ok {
		panic(DuplicateHandlerNameError{handlerName})
	}

	writerName, readerName := StructName(writer), StructName(reader)

	newHandler := &handler{
		name:   handlerName,
		logger: r.logger,

		reader:      reader,
		readerTopic: readerTopic,
		readerName:  readerName,

		writer:      writer,
		writerTopic: writerTopic,
		writerName:  writerName,

		handlerFunc:       handlerFunc,
		runningHandlersWg: r.runningHandlersWg,
		messagesCh:        nil,
		routersCloseCh:    r.closeCh,

		startedCh: make(chan struct{}),
	}

	r.handlersWg.Add(1)
	r.handlers[handlerName] = newHandler

	select {
	case r.handlerAdded <- struct{}{}:
	default:
		// closeWhenAllHandlersStopped is not always waiting for handlerAdded
	}

	return &Handler{
		router:  r,
		handler: newHandler,
	}
}

// AddNoReadererHandler adds a new handler.
// This handler cannot return messages.
// When message is returned it will occur an error and Nack will be sent.
//
// handlerName must be unique. For now, it is used only for debugging.
//
// readerTopic is a topic from which handler will receive messages.
//
// reader is Reader from which messages will be consumed.
//
// If handler is added while router is already running, you need to explicitly call RunHandlers().
func (r *Router) AddNoPublisherHandler(
	handlerName string,
	readerTopic string,
	reader Reader,
	handlerFunc NoPublishHandlerFunc,
) *Handler {
	handlerFuncAdapter := func(msg *Message) ([]*Message, error) {
		return nil, handlerFunc(msg)
	}

	return r.AddHandler(handlerName, readerTopic, reader, "", disabledPublisher{}, handlerFuncAdapter)
}

// Run runs all plugins and handlers and starts subscribing to provided topics.
// This call is blocking while the router is running.
//
// When all handlers have stopped (for example, because subscriptions were closed), the router will also stop.
//
// To stop Run() you should call Close() on the router.
//
// ctx will be propagated to all readers.
//
// When all handlers are stopped (for example: because of closed connection), Run() will be also stopped.
func (r *Router) Run(ctx context.Context) (err error) {
	if r.isRunning {
		return errors.New("router is already running")
	}
	r.isRunning = true

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	r.logger.Debug("Loading plugins")
	for _, plugin := range r.plugins {
		if err := plugin(r); err != nil {
			return errors.Wrapf(err, "cannot initialize plugin %v", plugin)
		}
	}

	if err := r.RunHandlers(ctx); err != nil {
		return err
	}

	close(r.running)

	go r.closeWhenAllHandlersStopped()

	<-r.closeCh
	cancel()

	<-r.closedCh

	r.logger.Info("All messages processed")

	return nil
}

// RunHandlers runs all handlers that were added after Run().
// RunHandlers is idempotent, so can be called multiple times safely.
func (r *Router) RunHandlers(ctx context.Context) error {
	if !r.isRunning {
		return errors.New("you can't call RunHandlers on non-running router")
	}

	r.handlersLock.Lock()
	defer r.handlersLock.Unlock()

	for name, h := range r.handlers {
		log.Println("--------- handlers --------------  ")
		log.Printf("name: %v", name)
		log.Printf("handler: %v", h)
		name := name
		h := h

		if h.started {
			continue
		}

		if err := r.decorateHandlerWriter(h); err != nil {
			return errors.Wrapf(err, "could not decorate writer of handler %s", name)
		}
		if err := r.decorateHandlerReader(h); err != nil {
			return errors.Wrapf(err, "could not decorate reader of handler %s", name)
		}
		log.Printf("Subscribing to topic subscriber_name[%s] topic[%s]", h.name, h.readerTopic)
		ctx, cancel := context.WithCancel(ctx)

		messages, err := h.reader.Subscribe(ctx)
		if err != nil {
			cancel()
			return errors.Wrapf(err, "cannot subscribe topic %s", h.readerTopic)
		}

		h.messagesCh = messages
		h.started = true
		log.Printf("handler started === %v", h)

		// os.Exit(1)
		close(h.startedCh)

		h.stopFn = cancel
		h.stopped = make(chan struct{})

		go func() {
			defer cancel()
			log.Println("--------- start running   handler --------------  ")
			h.run(ctx, r.middlewares)
			log.Println("--------- handlersWg done --------------  ")
			r.handlersWg.Done()

			r.handlersLock.Lock()
			delete(r.handlers, name)
			r.handlersLock.Unlock()
		}()
	}
	return nil
}

func (r *Router) closeWhenAllHandlersStopped() {
	r.handlersLock.RLock()
	hasHandlers := len(r.handlers) == 0
	r.handlersLock.RUnlock()

	log.Printf("hasHandlers: [%v]", hasHandlers)
	if hasHandlers {
		select {
		case <-r.handlerAdded:
			log.Printf("r.handlerAdded: [%v]", <-r.handlerAdded)
			// it should be some handler to track
		case <-r.closedCh:
			log.Printf("<-r.closedCh: [%v]", <-r.closedCh)
			// let's avoid goroutine leak
			return
		}
	}

	r.handlersWg.Wait()
	if r.isClosed() {
		// already closed
		return
	}

	r.logger.Error("All handlers stopped, closing router")

	if err := r.Close(); err != nil {
		r.logger.Error(fmt.Sprintf("Cannot close router %+v", err))
	}
}

// Running is closed when router is running.
// In other words: you can wait till router is running using
//
//	fmt.Println("Starting router")
//	go r.Run(ctx)
//	<- r.Running()
//	fmt.Println("Router is running")
func (r *Router) Running() chan struct{} {
	return r.running
}

// IsRunning returns true when router is running.
func (r *Router) IsRunning() bool {
	select {
	case <-r.running:
		return true
	default:
		return false
	}
}

// Close gracefully closes the router with a timeout provided in the configuration.
func (r *Router) Close() error {
	r.closedLock.Lock()
	defer r.closedLock.Unlock()

	r.handlersLock.Lock()
	defer r.handlersLock.Unlock()

	if r.closed {
		return nil
	}
	r.closed = true

	r.logger.Info("Closing router")
	defer r.logger.Info("Router closed")

	close(r.closeCh)
	defer close(r.closedCh)

	timeouted := WaitGroupTimeout(r.handlersWg, r.config.CloseTimeout)
	if timeouted {
		return errors.New("router close timeout")
	}

	return nil
}

func (r *Router) isClosed() bool {
	r.closedLock.Lock()
	defer r.closedLock.Unlock()

	return r.closed
}

type handler struct {
	name   string
	logger logging.BCPLogger

	reader      Reader
	readerTopic string
	readerName  string

	writer      Writer
	writerTopic string
	writerName  string

	handlerFunc HandlerFunc

	runningHandlersWg *sync.WaitGroup

	messagesCh <-chan *Message

	started   bool
	startedCh chan struct{}

	stopFn         context.CancelFunc
	stopped        chan struct{}
	routersCloseCh chan struct{}
}

func (h *handler) run(ctx context.Context, middlewares []middleware) {

	middlewareHandler := h.handlerFunc
	// first added middlewares should be executed first (so should be at the top of call stack)
	for i := len(middlewares) - 1; i >= 0; i-- {
		currentMiddleware := middlewares[i]
		isValidHandlerLevelMiddleware := currentMiddleware.HandlerName == h.name
		if currentMiddleware.IsRouterLevel || isValidHandlerLevelMiddleware {
			middlewareHandler = currentMiddleware.Handler(middlewareHandler)
		}
	}

	go h.handleClose(ctx)
	log.Println("--------- receiving from channel --------------  ")
	for msg := range h.messagesCh {
		h.runningHandlersWg.Add(1)
		log.Printf("msg [%v]  ", msg)
		log.Printf(" handler being called -------- [%T\n]------ ", middlewareHandler)
		go h.handleMessage(msg, middlewareHandler)
	}

	if h.writer != nil {
		if err := h.writer.Close(); err != nil {
			h.logger.Error(err.Error())
		}
		h.logger.Debug("Reader closed")
	}

	h.logger.Debug("Router handler stopped")
	close(h.stopped)
}

// Handler handles Messages.
type Handler struct {
	router  *Router
	handler *handler
}

// AddMiddleware adds new middleware to the specified handler in the router.
//
// The order of middleware matters. Middleware added at the beginning is executed first.
func (h *Handler) AddMiddleware(m ...HandlerMiddleware) {
	handler := h.handler
	h.router.addHandlerLevelMiddleware(handler.name, m...)
}

// Started returns channel which is stopped when handler is running.
func (h *Handler) Started() chan struct{} {
	return h.handler.startedCh
}

// Stop stops the handler.
// Stop is asynchronous.
// You can check if handler was stopped with Stopped() function.
func (h *Handler) Stop() {
	if !h.handler.started {
		panic("handler is not started")
	}

	h.handler.stopFn()
}

// Stopped returns channel which is stopped when handler did stop.
func (h *Handler) Stopped() chan struct{} {
	return h.handler.stopped
}

// decorateHandlerWriter applies the decorator chain to handler's writer.
// They are applied in reverse order, so that the later decorators use the result of former ones.
func (r *Router) decorateHandlerWriter(h *handler) error {
	var err error
	pub := h.writer
	for i := len(r.writerDecorators) - 1; i >= 0; i-- {
		decorator := r.writerDecorators[i]
		pub, err = decorator(pub)
		if err != nil {
			return errors.Wrap(err, "could not apply writer decorator")
		}
	}
	r.handlers[h.name].writer = pub
	return nil
}

// decorateHandlerReader applies the decorator chain to handler's reader.
// They are applied in regular order, so that the later decorators use the result of former ones.
func (r *Router) decorateHandlerReader(h *handler) error {
	var err error
	sub := h.reader

	// add values to message context to reader
	// it goes before other decorators, so that they may take advantage of these values
	messageTransform := func(msg *Message) {
		if msg != nil {
			h.addHandlerContext(msg)
		}
	}
	sub, err = MessageTransformReaderDecorator(messageTransform)(sub)
	if err != nil {
		return errors.Wrapf(err, "cannot wrap reader with context decorator")
	}

	for _, decorator := range r.readerDecorators {
		sub, err = decorator(sub)
		if err != nil {
			return errors.Wrap(err, "could not apply reader decorator")
		}
	}
	r.handlers[h.name].reader = sub
	return nil
}

// addHandlerContext enriches the contex with values that are relevant within this handler's context.
func (h *handler) addHandlerContext(messages ...*Message) {
	for i, msg := range messages {
		ctx := msg.Context()

		if h.name != "" {
			ctx = context.WithValue(ctx, handlerNameKey, h.name)
		}
		if h.writerName != "" {
			ctx = context.WithValue(ctx, writerNameKey, h.writerName)
		}
		if h.readerName != "" {
			ctx = context.WithValue(ctx, readerNameKey, h.readerName)
		}
		if h.readerTopic != "" {
			ctx = context.WithValue(ctx, readTopicKey, h.readerTopic)
		}
		if h.writerTopic != "" {
			ctx = context.WithValue(ctx, writeTopicKey, h.writerTopic)
		}
		messages[i].SetContext(ctx)
	}
}

func (h *handler) handleClose(ctx context.Context) {
	select {
	case <-h.routersCloseCh:
		if err := h.reader.Close(); err != nil {
			h.logger.Error("Failed to close reader")
		}
		h.logger.Debug("Reader closed")
	case <-ctx.Done():
		// we are closing reader just when entire router is closed
	}
	h.stopFn()
}

func (h *handler) handleMessage(msg *Message, handler HandlerFunc) {
	defer h.runningHandlersWg.Done()

	defer func() {
		if recovered := recover(); recovered != nil {
			msg.Nack()
		}
	}()

	producedMessages, err := handler(msg)
	if err != nil {
		log.Printf("handler returned error %+v", err)
		h.logger.Error("Handler returned error")
		msg.Nack()
		return
	}

	h.addHandlerContext(producedMessages...)

	if err := h.writeProducedMessages(producedMessages); err != nil {
		h.logger.Error("Readering produced messages failed")
		msg.Nack()
		return
	}

	msg.Ack()
}

func (h *handler) writeProducedMessages(producedMessages Messages) error {
	if len(producedMessages) == 0 {
		return nil
	}

	if h.writer == nil {
		return ErrOutputInNoReadererHandler
	}

	for _, msg := range producedMessages {
		if err := h.writer.Write(msg); err != nil {
			// todo - how to deal with it better/transactional/retry?
			h.logger.Error("Cannot write message")

			return err
		}
	}

	return nil
}

type disabledPublisher struct{}

func (disabledPublisher) Write(messages ...*Message) error {
	return ErrOutputInNoReadererHandler
}

func (disabledPublisher) Close() error {
	return nil
}

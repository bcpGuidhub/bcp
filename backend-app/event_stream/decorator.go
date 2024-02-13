package eventstream

import (
	"context"
	"sync"
)

// MessageTransformReaderDecorator creates a subscriber decorator that calls transform
// on each message that passes through the subscriber.
func MessageTransformReaderDecorator(transform func(*Message)) ReaderDecorator {
	if transform == nil {
		panic("transform function is nil")
	}
	return func(sub Reader) (Reader, error) {
		return &messageTransformReaderDecoratorter{
			sub:       sub,
			transform: transform,
		}, nil
	}
}

// MessageTransformWriterDecorator creates a publisher decorator that calls transform
// on each message that passes through the publisher.
func MessageTransformWriterDecorator(transform func(*Message)) WriterDecorator {
	if transform == nil {
		panic("transform function is nil")
	}
	return func(pub Writer) (Writer, error) {
		return &messageTransformPublisherDecorator{
			Writer:    pub,
			transform: transform,
		}, nil
	}
}

type messageTransformReaderDecoratorter struct {
	sub Reader

	transform   func(*Message)
	subscribeWg sync.WaitGroup
}

func (t *messageTransformReaderDecoratorter) Subscribe(ctx context.Context) (<-chan *Message, error) {
	in, err := t.sub.Subscribe(ctx)
	if err != nil {
		return nil, err
	}

	out := make(chan *Message)
	t.subscribeWg.Add(1)
	go func() {
		for msg := range in {
			t.transform(msg)
			out <- msg
		}
		close(out)
		t.subscribeWg.Done()
	}()

	return out, nil
}

func (t *messageTransformReaderDecoratorter) Close() error {
	err := t.sub.Close()

	t.subscribeWg.Wait()
	return err
}

type messageTransformPublisherDecorator struct {
	Writer
	transform func(*Message)
}

// Write applies the transform to each message and returns the underlying Writer's result.
func (d messageTransformPublisherDecorator) Write(messages ...*Message) error {
	for i := range messages {
		d.transform(messages[i])
	}
	return d.Writer.Write(messages...)
}

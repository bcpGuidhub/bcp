package eventstream

import (
	"context"
)

type ctxKey string

const (
	handlerNameKey ctxKey = "handler_name"
	writerNameKey  ctxKey = "writer_name"
	readerNameKey  ctxKey = "reader_name"
	readTopicKey   ctxKey = "read_topic"
	writeTopicKey  ctxKey = "write_topic"
)

func valFromCtx(ctx context.Context, key ctxKey) string {
	val, ok := ctx.Value(key).(string)
	if !ok {
		return ""
	}
	return val
}

// HandlerNameFromCtx returns the name of the message handler in the router that consumed the message.
func HandlerNameFromCtx(ctx context.Context) string {
	return valFromCtx(ctx, handlerNameKey)
}

// WritererNameFromCtx returns the name of the message writer type that published the message in the router.
// For example, for Kafka it will be `kafka.Writerer`.
func WritererNameFromCtx(ctx context.Context) string {
	return valFromCtx(ctx, writerNameKey)
}

// ReaderNameFromCtx returns the name of the message reader type that readd to the message in the router.
// For example, for Kafka it will be `kafka.Reader`.
func ReaderNameFromCtx(ctx context.Context) string {
	return valFromCtx(ctx, readerNameKey)
}

// SubscribeTopicFromCtx returns the topic from which message was received in the router.
func SubscribeTopicFromCtx(ctx context.Context) string {
	return valFromCtx(ctx, readTopicKey)
}

// WriterTopicFromCtx returns the topic to which message will be published by the router.
func WriterTopicFromCtx(ctx context.Context) string {
	return valFromCtx(ctx, writeTopicKey)
}

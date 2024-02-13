package eventstream

import "context"

type Reader interface {
	Subscribe(ctx context.Context) (<-chan *Message, error)
	Close() error
}

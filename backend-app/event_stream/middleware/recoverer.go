package middleware

import (
	"fmt"
	"runtime/debug"

	"github.com/hashicorp/go-multierror"
	"github.com/pkg/errors"
	eventstream "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream"
)

type RecoveredPanicError struct {
	V          interface{}
	Stacktrace string
}

func (p RecoveredPanicError) Error() string {
	return fmt.Sprintf("panic occurred: %#v, stacktrace: \n%s", p.V, p.Stacktrace)
}

// Recoverer recovers from any panic in the handler and appends RecoveredPanicError with the stacktrace
// to any error returned from the handler.
func Recoverer(h eventstream.HandlerFunc) eventstream.HandlerFunc {
	return func(event *eventstream.Message) (events []*eventstream.Message, err error) {
		defer func() {
			if r := recover(); r != nil {
				panicErr := errors.WithStack(RecoveredPanicError{V: r, Stacktrace: string(debug.Stack())})
				err = multierror.Append(err, panicErr)
			}
		}()

		return h(event)
	}
}

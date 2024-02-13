package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"runtime/debug"
	"time"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/pkg/logging"
)

type ctxRequestLoggerKey struct{}

// Header is a struct containing BCP specific headers
type Header struct {
	UserAgent           string
	XCorrelationID      string
	XBCPDevice          string
	XBCPDeviceType      string
	XBCPIdempotencyKey  string
	XBCPPlatformVersion string
	XBCPReferrer        string
}

// RequestLogger provides a middleware for pushing contextual information into
// a buffer which is written out after the request has been processed and response made.
//
// It is capable of recovering from a panic and will capture the error for sentry, before
// sending an error log message with the stack trace and debug information.
func RequestLogger(appLogger logging.BCPLogger) gin.HandlerFunc {
	return func(c *gin.Context) {
		t1 := time.Now()
		r := c.Request
		requestLogger := NewRequestLogger(appLogger, r)
		ww := c.Writer
		defer func() {
			if rec := recover(); rec != nil {
				// Sentry
				// raven.CaptureError(errors.New(fmt.Sprint(rec)), nil)

				http.Error(ww, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)

				requestLogger.AddContext("status", ww.Status())
				requestLogger.AddContext("duration", time.Since(t1))
				requestLogger.AddContext("stack", string(debug.Stack()))
				requestLogger.AddContext("panic", fmt.Sprintf("%+v", rec))
				requestLogger.Error(fmt.Sprintf("[%d] %s %s", ww.Status(), r.Method, r.RequestURI))
			} else {
				requestLogger.AddContext("status", ww.Status())
				requestLogger.AddContext("duration", time.Since(t1))
				requestLogger.Info(fmt.Sprintf("[%d] %s %s", ww.Status(), r.Method, r.RequestURI))
			}
		}()

		r = WithRequestLogger(r, requestLogger)

		c.Next()
	}
}

// NewRequestLogger creates a new log entry with a clone of the application appending
// key contextual information available from the request and configuration.
func NewRequestLogger(appLogger logging.BCPLogger, r *http.Request) logging.BCPLogger {
	requestLogger := appLogger.Clone()

	header := &Header{
		UserAgent:           r.Header.Get("User-Agent"),
		XCorrelationID:      r.Header.Get("X-Correlation-ID"),
		XBCPDevice:          r.Header.Get("X-BCP-Device"),
		XBCPDeviceType:      r.Header.Get("X-BCP-Device-Type"),
		XBCPIdempotencyKey:  r.Header.Get("X-BCP-Idempotency-Key"),
		XBCPPlatformVersion: r.Header.Get("X-BCP-Platform-Version"),
		XBCPReferrer:        r.Header.Get("X-BCP-Referrer"),
	}
	requestLogger.AddContext("log_version", "1.0")
	requestLogger.AddContext("host", r.Host)
	requestLogger.AddContext("method", r.Method)
	requestLogger.AddContext("path", r.URL.Path)
	requestLogger.AddContext("raw", r.URL.RawQuery)
	requestLogger.AddContext("ip", r.RemoteAddr)
	//
	// requestLogger.AddContext("request_id", middleware.GetReqID(r.Context()))
	requestLogger.AddContext("headers", header)
	requestLogger.AddContext("params", r.URL.Query())

	if v, ok := GetRequestSession(r); ok {
		requestLogger.AddContext("request-session-", v)
	}
	return requestLogger
}

// WithRequestLogger sets the in-context LogEntry for a request unless it is nil
func WithRequestLogger(r *http.Request, requestLogger logging.BCPLogger) *http.Request {
	if requestLogger != nil {
		r = r.WithContext(context.WithValue(r.Context(), ctxRequestLoggerKey{}, requestLogger))
	}

	return r
}

func GetRequestLogger(r *http.Request) (logging.BCPLogger, bool) {
	requestLogger, ok := r.Context().Value(ctxRequestLoggerKey{}).(logging.BCPLogger)

	return requestLogger, ok
}

// RequestLoggerSetKeyValue will add new contextual information to the entry logger
// if it is able to find it in the context.
func RequestLoggerSetKeyValue(r *http.Request, key string, values interface{}) (logging.BCPLogger, bool) {
	requestLogger, ok := GetRequestLogger(r)

	if ok {
		requestLogger.AddContext(key, values)
	}

	return requestLogger, ok
}

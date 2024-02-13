package middlewares

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const (
	cookieMaxAge    = 60 * 60 * 48
	cookiePrefix    = "bcp_api_v1_"
	cookieSessionID = cookiePrefix + "session-id"
)

type ctxKeySessionID struct{}

func EnsureSessionID(env string) gin.HandlerFunc {
	return func(c *gin.Context) {
		var sessionID string
		r := c.Request
		cookie, err := r.Cookie(cookieSessionID)
		if err == http.ErrNoCookie {
			u, _ := uuid.NewRandom()
			sessionID = u.String()
			path := "/"
			domain := ""
			secure := true
			httpOnly := true
			if env == "dev" || env == "staging" {
				secure = false
			}
			c.SetCookie(
				cookieSessionID,
				sessionID,
				cookieMaxAge,
				path,
				domain,
				secure,
				httpOnly,
			)
		} else if err != nil {
			return
		} else {
			sessionID = cookie.Value
		}
		ctx := context.WithValue(r.Context(), ctxKeySessionID{}, sessionID)
		r = r.WithContext(ctx)
		c.Next()
	}
}

func GetRequestSession(r *http.Request) (string, bool) {
	sessionId, ok := r.Context().Value(ctxKeySessionID{}).(string)
	return sessionId, ok
}

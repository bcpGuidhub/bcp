package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/unrolled/secure"
)

// SET THE FIELD IsDevelopment TO TRUE FOR DEV.
var secureMiddleware = secure.New(secure.Options{
	AllowedHosts:            []string{"ssl.example.com"},
	AllowedHostsAreRegex:    false,
	HostsProxyHeaders:       []string{"X-Forwarded-Hosts"},
	SSLRedirect:             true,
	SSLTemporaryRedirect:    false,
	SSLHost:                 "ssl.example.com",
	SSLHostFunc:             nil,
	SSLProxyHeaders:         map[string]string{"X-Forwarded-Proto": "https"},
	STSSeconds:              31536000,
	STSIncludeSubdomains:    true,
	STSPreload:              true,
	ForceSTSHeader:          false,
	FrameDeny:               true,
	CustomFrameOptionsValue: "SAMEORIGIN",
	ContentTypeNosniff:      true,
	BrowserXssFilter:        true,
	CustomBrowserXssValue:   "1; report=https://example.com/xss-report",
	ContentSecurityPolicy:   "default-src 'self'",
	ReferrerPolicy:          "same-origin",
	FeaturePolicy:           "vibrate 'none';",

	IsDevelopment: true, // This will cause the AllowedHosts, SSLRedirect, and STSSeconds/STSIncludeSubdomains options to be ignored during development. When deploying to production, be sure to set this to false.
})

// CSP adds default security policies.
func CSP() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := secureMiddleware.Process(c.Writer, c.Request)

		// If there was an error, do not continue.
		if err != nil {
			c.Abort()
			return
		}

		// Avoid header rewrite if response is a redirection.
		if status := c.Writer.Status(); status > 300 && status < 399 {
			c.Abort()
		}
	}
}

package server

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.opencensus.io/plugin/ochttp"
	"go.opencensus.io/plugin/ochttp/propagation/b3"
)

// Run takes an http handler, starts a server.
func Run(handler http.Handler) {

	handler = &ochttp.Handler{ // add opencensus instrumentation
		Handler:     handler,
		Propagation: &b3.HTTPFormat{}}

	server := &http.Server{
		Handler:      handler,
		Addr:         ":8080",
		ReadTimeout:  60 * time.Second,
		WriteTimeout: 60 * time.Second,
	}

	// Start Server
	go func() {
		log.Println("Starting Server")
		if err := server.ListenAndServe(); err != nil {
			log.Fatal(err)
		}
	}()

	// Graceful Shutdown
	graceFullyShutdown(server)
}

func graceFullyShutdown(server *http.Server) {
	interruptChan := make(chan os.Signal, 1)
	signal.Notify(interruptChan, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	// Block until we receive our signal.
	<-interruptChan

	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	server.Shutdown(ctx)

	log.Println("Shutting down")
	os.Exit(0)
}

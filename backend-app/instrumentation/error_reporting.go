package instrumentation

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/errorreporting"
)

var errorClient *errorreporting.Client

func init() {
	ctx := context.Background()

	// Sets your Google Cloud Platform project ID.
	projectID := os.Getenv("PROJECTID")

	var err error
	errorClient, err = errorreporting.NewClient(ctx, projectID, errorreporting.Config{
		ServiceName:    "applicationBackend",
		ServiceVersion: os.Getenv("APPENV"),
		OnError: func(err error) {
			log.Printf("Could not log error: %v", err)
		},
	})
	if err != nil {
		log.Fatal(err)
	}
	defer errorClient.Close()
}
func LogAndPrintError(err error) {
	errorClient.Report(errorreporting.Entry{
		Error: err,
	})
	log.Print(err)
	defer errorClient.Close()
}

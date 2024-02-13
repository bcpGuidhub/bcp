package helpers

import (
	"context"
	"fmt"
	"io"
	"time"

	"cloud.google.com/go/storage"
)

func CreateStorageBucket(bucketName, owner string) error {
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	maxAge := time.Hour * 8760
	methods := []string{"GET"}
	origins := []string{"http://localhost:3001"}
	responseHeaders := []string{"Content-Type"}
	if err != nil {
		return err
	}
	// Creates a Bucket instance.
	bucket := client.Bucket(bucketName)
	// Creates the new bucket.
	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()
	if err := bucket.Create(ctx, owner, &storage.BucketAttrs{
		CORS: []storage.CORS{{
			MaxAge:          maxAge,
			Methods:         methods,
			Origins:         origins,
			ResponseHeaders: responseHeaders,
		}},
		Location: "EU",
	}); err != nil {
		return err
	}
	return nil
}

// deleteFile removes specified object.
func DeleteFile(w io.Writer, bucket, object string) error {
	// bucket := "bucket-name"
	// object := "object-name"
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("storage.NewClient: %v", err)
	}
	defer client.Close()

	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()

	o := client.Bucket(bucket).Object(object)
	if err := o.Delete(ctx); err != nil {
		return fmt.Errorf("Object(%q).Delete: %v", object, err)
	}
	fmt.Fprintf(w, "Blob %v deleted.\n", object)
	return nil
}

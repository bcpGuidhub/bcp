GOOS=linux go build -a --ldflags '-extldflags "-static"' -tags netgo -installsuffix netgo -o bin/app

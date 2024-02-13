FROM golang:1.20-alpine AS build-env
RUN apk --no-cache add build-base git  gcc
WORKDIR /src

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . ./
RUN ./build.sh
#RUN GOOS=linux \
#  go build -a  \ 
#  --ldflags "-X main.APPENV=$env -extldflags '-static'"   \
#  -tags netgo \
#  -installsuffix netgo \
#  -o bin/app

# final stage
FROM alpine
WORKDIR /server

# Import from builder.
COPY --from=build-env /src/config.yml /server/
COPY --from=build-env /src/beta_agencies_geo_locations.json /server/
COPY --from=build-env /src/beta_micro_formation.json /server/
COPY --from=build-env /src/database/migrations /server/database/migrations
COPY --from=build-env /src/messages/email_templates /server/messages/email_templates

# Copy our static executable  
COPY --from=build-env /src/bin/app /server/
EXPOSE 8080
ENTRYPOINT ./app

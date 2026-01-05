# ---------- Build stage ----------
FROM golang:1.22-alpine AS builder

WORKDIR /app


COPY go.mod go.sum ./

COPY vendor ./vendor

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    GOFLAGS="-mod=vendor" \
    go build -ldflags="-s -w" \
    -o rssagg ./cmd/server


FROM gcr.io/distroless/base-debian12

WORKDIR /app

COPY --from=builder /app/rssagg /app/rssagg
COPY --from=builder /app/static /app/static
COPY .env /app/.env

EXPOSE 8000

USER nonroot:nonroot

ENTRYPOINT ["/app/rssagg"]

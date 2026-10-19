FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install dependencies for CGO and pgx (if needed)
RUN apk add --no-cache gcc musl-dev

# Copy go.mod and go.sum
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o server ./cmd/server

FROM alpine:latest

WORKDIR /app

# Add CA certificates for secure connections (Cloudinary, GitHub)
RUN apk --no-cache add ca-certificates tzdata

# Copy binary and migrations from builder
COPY --from=builder /app/server .
COPY --from=builder /app/internal/database/migrations ./internal/database/migrations

EXPOSE 8080

CMD ["./server"]

# FluxFeed - RSS Aggregator & Reader

A high-performance, concurrent RSS feed aggregator and reader built with Go. FluxFeed efficiently scrapes multiple RSS feeds, stores articles in a PostgreSQL database, and provides a RESTful API for users to manage feeds and read aggregated content.

## Features

- **Multi-Feed Management**: Create and manage multiple RSS feed subscriptions
- **Concurrent Feed Scraping**: Background worker processes (configurable concurrency) that continuously fetch and update feeds
- **User Authentication**: API key-based authentication for secure access
- **Feed Following**: Users can follow/unfollow feeds to customize their reading experience
- **Post Aggregation**: Fetches and stores posts from followed feeds with full-text content
- **Pagination Support**: Retrieve posts with configurable limit and offset
- **Error Handling**: Robust error handling with comprehensive logging
- **Database Persistence**: PostgreSQL database for reliable data storage
- **Graceful Shutdown**: Clean termination with signal handling (SIGINT/SIGTERM) and context propagation

## Tech Stack

- **Language**: Go 1.22+
- **Router**: Chi (chi-router)
- **Database**: PostgreSQL with sqlc for type-safe queries
- **Migrations**: Automatic migration system (runs on app startup)
- **Authentication**: API Key (Authorization header)
- **CORS**: Enabled for cross-origin requests

## Project Structure

```
.
├── cmd/                          # Command-line applications
├── internal/
│   ├── auth/                     # Authentication utilities
│   ├── database/                 # Generated sqlc code & database models
│   └── handler/                  # HTTP handlers and middleware
├── rss/
│   ├── rss.go                    # RSS feed parser
│   └── scraper.go                # Background feed scraper
├── sql/
│   ├── queries/                  # SQL query definitions
│   └── schema/                   # Database migrations
├── main.go                       # Application entry point
├── go.mod                        # Go module definition
└── README.md                     # This file
```

## Installation & Setup

### Quick Start with Pre-built Binary

The easiest way to get started is downloading a pre-built binary from [Releases](https://github.com/murtazapatel89100/FluxFeed/releases):

```bash
# Download for your platform (Linux, macOS, or Windows)
./fluxfeed-linux --runtime docker    # or --runtime podman
```

Available binaries:
- `fluxfeed-linux` - Linux x64
- `fluxfeed-macos-intel` - macOS Intel
- `fluxfeed-macos-apple` - macOS Apple Silicon (M1/M2/M3)
- `fluxfeed-windows.exe` - Windows x64

For complete automated setup experience across all platforms, download `setup-env` from [go-utils](https://github.com/murtazapatel89100/go-utils).

### Prerequisites

- Go 1.22 or higher
- PostgreSQL 12+
- Docker or Podman (for containerized setup)

### Database Setup

The application automatically handles database migrations on startup. Simply:

1. Create a `.env` file with database credentials:
```bash
cp env.template .env
# Edit .env with your database credentials
```

2. The migrations will run automatically when the app starts, creating all necessary tables:
   - `users` table for user accounts and API keys
   - `feeds` table for RSS feed subscriptions
   - `feeds_follow` table for user feed subscriptions
   - `posts` table for aggregated articles
   - `schema_migrations` table to track applied migrations

### Build from Source

```bash
# Build the application
go build -o bin/fluxfeed ./cmd/server

# Run the application
./bin/fluxfeed
```

### Docker Setup

Use Docker or Podman with the provided configuration:

```bash
# Copy environment template
cp env.template .env

# Using Docker Compose
docker-compose up --build

# Using Podman Compose
podman-compose up --build
```

The server will start on `http://localhost:8000` and automatically:
- Run database migrations to create all necessary tables
- Connect to the PostgreSQL database
- Start the RSS feed scraper in the background
- Listen for incoming HTTP requests

**Note**: The application waits for PostgreSQL to be healthy before starting, ensuring migrations run against a ready database.

See [scripts/README.md](scripts/README.md) for more setup options and details.

## API Endpoints

### Authentication

All endpoints (except `/health`) require API token authentication via the `Authorization` header:

```
Authorization: ApiKey YOUR_API_TOKEN
```

The `API_TOKEN` is configured in your `.env` file:
```env
API_TOKEN=your_secure_token_here
```

### Public Endpoints (No Authentication Required)

#### Health Check
```
GET /v1/health

Response (200):
{
  "status": "ok"
}
```

### Protected Endpoints (Require Authorization Header)

All other endpoints require:
```
Authorization: ApiKey YOUR_API_TOKEN
```

#### Create User
```
POST /v1/users/create
Content-Type: application/json
Authorization: ApiKey YOUR_API_TOKEN

{
  "name": "John Doe"
}

Response (201):
{
  "id": "uuid",
  "created_at": "2025-12-15T10:00:00Z",
  "updated_at": "2025-12-15T10:00:00Z",
  "username": "John Doe",
  "api_key": "your_api_key_here"
}
```

#### Get All Feeds
```
GET /v1/feeds/fetch
Authorization: ApiKey YOUR_API_TOKEN

Response (200):
[
  {
    "id": "uuid",
    "created_at": "2025-12-15T10:00:00Z",
    "updated_at": "2025-12-15T10:00:00Z",
    "name": "Tech News",
    "url": "https://example.com/feed.xml",
    "user_id": "uuid",
    "last_fetched_at": "2025-12-15T10:30:00Z"
  }
]
```

#### Get Current User
```
GET /v1/users/fetch
Authorization: ApiKey YOUR_API_TOKEN

Response (200):
{
  "id": "uuid",
  "created_at": "2025-12-15T10:00:00Z",
  "updated_at": "2025-12-15T10:00:00Z",
  "username": "John Doe",
  "api_key": "your_api_key_here"
}
```

#### Create Feed
```
POST /v1/feeds/create
Content-Type: application/json
Authorization: ApiKey YOUR_API_TOKEN

{
  "name": "Tech News",
  "url": "https://example.com/feed.xml"
}

Response (201):
{
  "id": "uuid",
  "created_at": "2025-12-15T10:00:00Z",
  "updated_at": "2025-12-15T10:00:00Z",
  "name": "Tech News",
  "url": "https://example.com/feed.xml",
  "user_id": "uuid",
  "last_fetched_at": null
}
```

#### Follow Feed
```
POST /v1/feeds-follow/create
Content-Type: application/json
Authorization: ApiKey YOUR_API_TOKEN

{
  "feed_id": "uuid"
}

Response (201):
{
  "id": "uuid",
  "created_at": "2025-12-15T10:00:00Z",
  "updated_at": "2025-12-15T10:00:00Z",
  "user_id": "uuid",
  "feed_id": "uuid"
}
```

#### Get User's Feed Follows
```
GET /v1/feeds-follow/fetch
Authorization: ApiKey YOUR_API_TOKEN

Response (200):
[
  {
    "id": "uuid",
    "created_at": "2025-12-15T10:00:00Z",
    "updated_at": "2025-12-15T10:00:00Z",
    "user_id": "uuid",
    "feed_id": "uuid"
  }
]
```

#### Get User's Feed Posts
```
GET /v1/feeds-follow/user
Authorization: ApiKey YOUR_API_TOKEN

Response (200):
[
  {
    "id": "uuid",
    "created_at": "2025-12-15T10:00:00Z",
    "updated_at": "2025-12-15T10:00:00Z",
    "title": "Article Title",
    "description": "Article description or content preview",
    "published_at": "2025-12-15T09:00:00Z",
    "url": "https://example.com/article",
    "feed_id": "uuid"
  }
]
```

#### Unfollow Feed
```
DELETE /v1/feeds-follow/delete/{feedFollowID}
Authorization: ApiKey YOUR_API_TOKEN

Response (200):
{
  "status": "deleted"
}
```

## Usage Example

### Prerequisites
Make sure you have the `API_TOKEN` from your `.env` file:
```env
API_TOKEN=your_secure_token_here
```

### 1. Create a User
```bash
curl -X POST http://localhost:8000/v1/users/create \
  -H "Authorization: ApiKey YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe"}'
```

Save the returned `api_key`.

### 2. Create a Feed
```bash
curl -X POST http://localhost:8000/v1/feeds/create \
  -H "Authorization: ApiKey YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Tech Blog",
    "url":"https://www.wagslane.dev/index.xml"
  }'
```

Save the returned `feed_id`.


### 3. Follow a Feed
```bash
curl -X POST http://localhost:8000/v1/feeds-follow/create \
  -H "Authorization: ApiKey YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"feed_id":"FEED_ID"}'
```

### 4. Wait for Scraper to Run
The background scraper runs every 60 seconds. Wait for it to fetch posts.

### 5. Retrieve Your Posts
```bash
curl -X GET http://localhost:8000/v1/feeds-follow/user \
  -H "Authorization: ApiKey YOUR_API_TOKEN"
```

## Database Schema

**Note**: All tables are automatically created by the migration system when the application starts.

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    username TEXT NOT NULL UNIQUE,
    api_key VARCHAR(255) UNIQUE NOT NULL
);
```

### Feeds Table
```sql
CREATE TABLE feeds (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_fetched_at TIMESTAMP
);
```

### Feeds Follow Table
```sql
CREATE TABLE feeds_follow (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
    UNIQUE(user_id, feed_id)
);
```

### Posts Table
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    title TEXT NOT NULL UNIQUE,
    description TEXT,
    published_at TIMESTAMP NOT NULL,
    url TEXT NOT NULL UNIQUE,
    feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE
);
```

### Schema Migrations Table
```sql
CREATE TABLE schema_migrations (
    version INT PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Configuration

Environment variables (see `env.template` for reference):

### Application Settings
- `PORT`: HTTP server port (default: 8000)

### Database Connection
- `DATABASE_URL`: PostgreSQL connection string (required)
  - Format: `postgres://user:password@host:port/database?sslmode=disable`
  - Example: `postgres://fluxfeed_user:fluxfeed_password@db:5432/fluxfeed_dev?sslmode=disable`

### Docker Compose Settings
- `POSTGRES_USER`: PostgreSQL username for the database container
- `POSTGRES_PASSWORD`: PostgreSQL password for the database container
- `POSTGRES_DB`: PostgreSQL database name
- `DB_HOST`: Database hostname (use `db` for Docker Compose)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password

## Background Scraper

The RSS scraper runs in the background with the following configuration:

- **Start Delay**: 10 seconds (allows app to fully initialize before scraping)
- **Concurrency**: 10 goroutines (configurable in `cmd/server/main.go`)
- **Interval**: 60 seconds between scraping runs
- **Behavior**: Fetches feeds ordered by `last_fetched_at` (null feeds first)
- **Shutdown**: Gracefully stops on signal reception (SIGINT/SIGTERM)

## Graceful Shutdown

FluxFeed supports graceful shutdown to ensure clean termination:

### Signal Handling
- **SIGINT** (Ctrl+C): Initiates graceful shutdown
- **SIGTERM**: Initiates graceful shutdown (useful for container orchestration)

### Shutdown Sequence
1. Signal received → shutdown initiated
2. Context cancellation propagates to all goroutines
3. Background scraper stops processing new feeds
4. HTTP server stops accepting new connections
5. In-flight requests have 30 seconds to complete
6. Database connection is closed
7. Application exits cleanly

### Shutdown Logging
```
Shutdown signal received, gracefully shutting down...
Scraper shutting down...
Server shutdown completed
Database connection closed
Graceful shutdown completed
```

## Architecture

### Authentication Flow

1. User creates account → receives `api_key`
2. User includes `api_key` in `Authorization: ApiKey <key>` header
3. Middleware validates key against database
4. User object stored in request context
5. Handler retrieves user from context and processes request

### Feed Scraping Flow

1. Ticker triggers every 60 seconds
2. Queries next N feeds to scrape (ordered by oldest fetch first)
3. For each feed, spawns goroutine to:
   - Fetch RSS feed content
   - Parse XML
   - Extract posts
   - Store in database (skips duplicates via unique constraint)
   - Update `last_fetched_at` timestamp
4. Respects context cancellation for graceful shutdown

### Post Aggregation

Posts are queried via JOIN between:
- `posts` table (the content)
- `feeds_follow` table (user's subscriptions)
- `feeds` table (metadata)

Results are ordered by `published_at` descending and paginated.

## Error Handling

- **400**: Bad request (invalid JSON, missing fields)
- **403**: Forbidden (invalid API key, authentication failed)
- **404**: Not found (endpoint doesn't exist)
- **500**: Internal server error (database error, scraper error)

All errors return JSON with an `error` field.

## Development

### Building from Source
```bash
# Build the binary
go build -o bin/fluxfeed ./cmd/server

# Run with environment file
cp env.template .env
./bin/fluxfeed
```

### Running Tests
```bash
go test ./...
```

### Formatting Code
```bash
go fmt ./...
```

### Linting
```bash
go vet ./...
```

### Database Migrations
Migrations are automatically applied on application startup. To see migration status, check the `schema_migrations` table:
```sql
SELECT * FROM schema_migrations ORDER BY version;
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Built with ❤️ by the Murtaza Patel

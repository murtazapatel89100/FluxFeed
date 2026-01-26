# FluxFeed - RSS Aggregator & Reader

A high-performance, concurrent RSS feed aggregator and reader built with Go. FluxFeed efficiently scrapes multiple RSS feeds, stores articles in a PostgreSQL database, and provides a RESTful API for users to manage feeds and read aggregated content.

## Features

- **Multi-Feed Management**: Create and manage multiple RSS feed subscriptions
- **Concurrent Feed Scraping**: Background worker processes with configurable concurrency that continuously fetch and update feeds
- **User Authentication**: API key-based authentication for secure access
- **Feed Following**: Allows users to follow or unfollow feeds to customize their reading experience
- **Post Aggregation**: Fetches and stores posts from followed feeds with full-text content
- **Pagination Support**: Retrieve posts with configurable limit and offset for efficient data loading
- **Error Handling**: Robust error handling with comprehensive logging for reliability and debugging
- **Database Persistence**: PostgreSQL database for reliable and consistent data storage
- **Graceful Shutdown**: Clean termination with signal handling (SIGINT/SIGTERM) and context propagation

## Technology Stack

- **Language**: Go 1.22+ for building a fast, reliable, and concurrent backend
- **Router**: Chi (chi-router) for lightweight and idiomatic HTTP routing
- **Database**: PostgreSQL with sqlc for type-safe, compile-time checked SQL queries
- **Migrations**: Automatic database migration system that runs on application startup
- **Authentication**: API key-based authentication using the Authorization header
- **CORS**: CORS enabled to allow secure cross-origin requests
- **Docker**: Containerization platform for consistent deployment environments
- **Nginx**: Web server and reverse proxy for handling HTTP requests

## Getting Started

The easiest way to get started is by using Docker Compose to run both the frontend and backend:

```bash
git clone "https://github.com/murtazapatel89100/FluxFeed.git"
cd FluxFeed
docker compose up -d --build
```

This will start the FluxFeed server on `http://localhost:8000` and the documentation site on `http://localhost:3000`. It will also automatically run database migrations.

For more detailed instructions on installation, configuration, API reference, and architecture, please refer to the official documentation:

[**FluxFeed Documentation**](http://localhost:3000)

## License

This project is licensed under the MIT License.
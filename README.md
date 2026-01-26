# FluxFeed — RSS Aggregator & Reader

FluxFeed is a high-performance RSS feed aggregator built with Go.  
It concurrently scrapes multiple feeds, stores posts in PostgreSQL, and exposes a REST API for managing feeds and reading aggregated content.

The project includes:

- A Go backend API  
- A web frontend  
- Docker + Docker Compose setup  
- Prebuilt images on GitHub Container Registry (GHCR)  

---

## Features

- Multi-feed subscription management  
- Concurrent background feed scraping  
- API-key based authentication  
- Feed follow / unfollow system  
- Post aggregation from followed feeds  
- Pagination support  
- PostgreSQL persistence  
- Automatic database migrations  
- Graceful shutdown (SIGINT / SIGTERM)  
- CORS enabled  

---

## Tech Stack

**Backend**
- Go 1.22+
- Chi router
- PostgreSQL
- sqlc
- Background workers

**Frontend**
- React Router v7
- Vite
- Tailwind CSS
- pnpm

**Infra**
- Docker
- Docker Compose
- GitHub Container Registry (GHCR)
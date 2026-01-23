package handler

import "github.com/murtazapatel89100/FluxFeed/backend/internal/database"

type ApiConfig struct {
	DB       *database.Queries
	APIToken string
}

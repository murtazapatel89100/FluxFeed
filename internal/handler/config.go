package handler

import "github.com/murtazapatel89100/FluxFeed/internal/database"

type ApiConfig struct {
	DB       *database.Queries
	APIToken string
}

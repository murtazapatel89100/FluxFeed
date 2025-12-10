package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/murtazapatel89100/RSS-Aggregartor/internal/auth"
	"github.com/murtazapatel89100/RSS-Aggregartor/internal/database"
)

func (config ApiConfig) HandlerCreateUser(w http.ResponseWriter, r *http.Request) {

	type parameters struct {
		Name string `json:"name"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}

	err := decoder.Decode((&params))
	if err != nil {
		RespondWithError(w, 400, fmt.Sprintf("Failed to decode request body: %v", err))
		return
	}

	user, err := config.DB.CreateUser(r.Context(), database.CreateUserParams{
		ID:       uuid.New(),
		Username: params.Name,
	})
	if err != nil {
		RespondWithError(w, 500, fmt.Sprintf("Failed to create user: %v", err))
		return
	}

	RespondWithJSON(w, 201, user)
}

func (config ApiConfig) HandlerGetUser(w http.ResponseWriter, r *http.Request) {
	apikey, err := auth.GetApiKey(r.Header)
	if err != nil {
		RespondWithError(w, 403, fmt.Sprintf("Authentication error: %v", err))
		return
	}

	user, err := config.DB.GetUserByApiKey(r.Context(), apikey)
	if err != nil {
		RespondWithError(w, 500, fmt.Sprintf("Failed to get user: %v", err))
		return
	}

	RespondWithJSON(w, 200, user)
}

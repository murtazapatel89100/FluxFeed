package handler

import (
	"context"
	"fmt"
	"net/http"

	"github.com/murtazapatel89100/FluxFeed/backend/internal/auth"
	"github.com/murtazapatel89100/FluxFeed/backend/internal/database"
)

type contextKey string

const userContextKey contextKey = "user"

func (config ApiConfig) MiddlewareAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apikey, err := auth.GetApiKey(r.Header)
		if err != nil {
			RespondWithError(w, 403, fmt.Sprintf("Authentication error: %v", err))
			return
		}

		if apikey != config.APIToken {
			RespondWithError(w, 403, "Invalid API token")
			return
		}

		ctx := context.WithValue(r.Context(), userContextKey, apikey)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserFromContext(r *http.Request) (database.User, bool) {
	user, ok := r.Context().Value(userContextKey).(database.User)
	return user, ok
}

func GetTokenFromContext(r *http.Request) (string, bool) {
	token, ok := r.Context().Value(userContextKey).(string)
	return token, ok
}

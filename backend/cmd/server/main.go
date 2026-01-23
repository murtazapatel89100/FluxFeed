package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/murtazapatel89100/FluxFeed/backend/internal/database"
	"github.com/murtazapatel89100/FluxFeed/backend/internal/handler"
	"github.com/murtazapatel89100/FluxFeed/backend/rss"

	_ "github.com/lib/pq"
)

func serveStatic(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/index.html")
}

func main() {
	env, err := godotenv.Read(".env")
	if err != nil {
		log.Printf("Warning: Could not load .env file: %v", err)
	}

	portString := env["PORT"]
	if portString == "" {
		log.Fatal("PORT is not found in the env")
	}

	dbURL := env["DATABASE_URL"]
	if dbURL == "" {
		log.Fatal("No DB URL found in the env")
	}

	apiToken := env["API_TOKEN"]
	if apiToken == "" {
		log.Fatal("API_TOKEN is not found in the env")
	}

	connection, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}
	defer connection.Close()

	developmentMode := env["DEVELOPMENT_MODE"]
	if developmentMode == "" {
		log.Fatal("Please add a development mode")
	}

	if developmentMode == "false" {
		if err := database.RunMigrations(connection); err != nil {
			log.Fatal("Failed to run database migrations:", err)
		}
	} else {
		log.Println("Skipping migrations in development mode please run manual migrations")
	}

	config := handler.ApiConfig{
		DB:       database.New(connection),
		APIToken: apiToken,
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		time.Sleep(10 * time.Second)
		log.Println("Starting RSS feed scraper...")
		rss.ScrapeFeeds(ctx, config.DB, 10, 60*time.Second)
	}()

	router := chi.NewRouter()

	router.Use(cors.Handler((cors.Options{
		AllowedOrigins:   []string{"http://*", "https://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	})))

	router.Get("/", serveStatic)

	router.Handle("/static/*", http.StripPrefix("/static", http.FileServer(http.Dir("static"))))

	v1router := chi.NewRouter()

	v1router.Get("/health", handler.HandlerReadiness)
	v1router.Get("/error", handler.HandlerError)

	v1router.With(config.MiddlewareAuth).Post("/users/create", config.HandlerCreateUser)
	v1router.With(config.MiddlewareAuth).Post("/feeds/fetch", config.HandlerGetFeeds)
	v1router.With(config.MiddlewareAuth).Get("/users/fetch", config.HandlerGetUser)
	v1router.With(config.MiddlewareAuth).Post("/feeds/create", config.HandlerCreateFeed)
	v1router.With(config.MiddlewareAuth).Post("/feeds-follow/create", config.HandlerCreateFeedFollow)
	v1router.With(config.MiddlewareAuth).Get("/feeds-follow/fetch", config.HandlerGetFeedFollow)
	v1router.With(config.MiddlewareAuth).Delete("/feeds-follow/delete/{feedFollowID}", config.HandlerDeleteFeedFollow)
	v1router.With(config.MiddlewareAuth).Get("/feeds-follow/user", config.HandlerGetUserFeeds)

	router.Mount("/v1", v1router)

	server := &http.Server{
		Handler: router,
		Addr:    ":" + portString,
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		fmt.Printf("Server is starting on port %v\n", portString)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	<-quit
	log.Println("\nShutdown signal received, gracefully shutting down...")

	cancel()

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
	}

	if err := connection.Close(); err != nil {
		log.Printf("Error closing database connection: %v", err)
	}

	log.Println("Server exited gracefully")
}

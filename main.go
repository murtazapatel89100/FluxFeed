package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/murtazapatel89100/RSS-Aggregartor/internal/handler"
)

func main() {
	godotenv.Load(".env")
	portString := os.Getenv("PORT")
	if portString == "" {
		log.Fatal("PORT is not found in the env")
	}

	router := chi.NewRouter()

	router.Use(cors.Handler((cors.Options{
		AllowedOrigins:   []string{"http://*", "https://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	})))

	v1router := chi.NewRouter()
	v1router.Get("/health", handler.HandlerReadiness)
	v1router.Get("/error", handler.HandlerError)

	router.Mount("/v1", v1router)

	fmt.Printf("Server is atrting on port %v", portString)
	server := &http.Server{
		Handler: router,
		Addr:    ":" + portString,
	}

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

}

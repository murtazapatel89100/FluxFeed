package database

import (
	"database/sql"
	"fmt"
	"log"
)

func RunMigrations(db *sql.DB) error {
	log.Println("Running database migrations...")

	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version INT PRIMARY KEY,
			applied_at TIMESTAMP NOT NULL DEFAULT NOW()
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	migrations := []struct {
		version int
		name    string
		up      string
	}{
		{
			version: 1,
			name:    "001_users",
			up: `
				CREATE TABLE IF NOT EXISTS users (
					id UUID PRIMARY KEY,
					creates_at TIMESTAMP NOT NULL DEFAULT NOW(),
					updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
					username TEXT NOT NULL UNIQUE
				);
			`,
		},
		{
			version: 2,
			name:    "002_users_api_key",
			up: `
				CREATE EXTENSION IF NOT EXISTS pgcrypto;
				DO $$
				BEGIN
					IF NOT EXISTS (
						SELECT 1 FROM information_schema.columns 
						WHERE table_name = 'users' AND column_name = 'api_key'
					) THEN
						ALTER TABLE users
						ADD COLUMN api_key VARCHAR(255) UNIQUE NOT NULL DEFAULT (encode(sha256(gen_random_bytes(16)), 'hex'));
					END IF;
				END $$;
			`,
		},
		{
			version: 3,
			name:    "003_feeds",
			up: `
				CREATE TABLE IF NOT EXISTS feeds (
					id UUID PRIMARY KEY,
					creates_at TIMESTAMP NOT NULL DEFAULT NOW(),
					updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
					name TEXT NOT NULL UNIQUE,
					url TEXT NOT NULL UNIQUE,
					user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
				);
			`,
		},
		{
			version: 4,
			name:    "004_feeds_follow",
			up: `
				CREATE TABLE IF NOT EXISTS feeds_follow (
					id UUID PRIMARY KEY,
					creates_at TIMESTAMP NOT NULL DEFAULT NOW(),
					updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
					user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
					feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
					UNIQUE (user_id, feed_id)
				);
			`,
		},
		{
			version: 5,
			name:    "005_last_fetched_at",
			up: `
				DO $$
				BEGIN
					IF NOT EXISTS (
						SELECT 1 FROM information_schema.columns 
						WHERE table_name = 'feeds' AND column_name = 'last_fetched_at'
					) THEN
						ALTER TABLE feeds ADD COLUMN last_fetched_at TIMESTAMP;
					END IF;
				END $$;
			`,
		},
		{
			version: 6,
			name:    "006_posts",
			up: `
				CREATE TABLE IF NOT EXISTS posts (
					id UUID PRIMARY KEY,
					created_at TIMESTAMP NOT NULL DEFAULT NOW(),
					updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
					title TEXT NOT NULL UNIQUE,
					description TEXT,
					publisghed_at TIMESTAMP NOT NULL,
					url TEXT NOT NULL UNIQUE,
					feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE
				);
			`,
		},
	}

	for _, m := range migrations {
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1)", m.version).Scan(&exists)
		if err != nil {
			return fmt.Errorf("failed to check migration %d (%s): %w", m.version, m.name, err)
		}

		if exists {
			log.Printf("Migration %d (%s) already applied, skipping...", m.version, m.name)
			continue
		}

		log.Printf("Applying migration %d (%s)...", m.version, m.name)
		_, err = db.Exec(m.up)
		if err != nil {
			return fmt.Errorf("failed to apply migration %d (%s): %w", m.version, m.name, err)
		}

		_, err = db.Exec("INSERT INTO schema_migrations (version) VALUES ($1)", m.version)
		if err != nil {
			return fmt.Errorf("failed to record migration %d (%s): %w", m.version, m.name, err)
		}

		log.Printf("Migration %d (%s) applied successfully", m.version, m.name)
	}

	log.Println("All migrations completed successfully")
	return nil
}

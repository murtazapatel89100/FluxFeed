package rss

import (
	"context"
	"database/sql"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/murtazapatel89100/FluxFeed/backend/internal/database"
)

func parseRSSDate(dateStr string) time.Time {
	t, err := time.Parse(time.RFC1123Z, dateStr)
	if err == nil {
		return t
	}

	t, err = time.Parse(time.RFC1123, dateStr)
	if err == nil {
		return t
	}

	log.Printf("Failed to parse date '%s', using current time", dateStr)
	return time.Now()
}

func ScrapeFeeds(ctx context.Context, db *database.Queries, concurrency int, timeBetweenRequest time.Duration) {
	log.Printf("Scraping on %v go-routines every %s duration", concurrency, timeBetweenRequest)

	ticker := time.NewTicker(timeBetweenRequest)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("Scraper shutting down...")
			return
		case <-ticker.C:
			feeds, err := db.GetNextFeedsToFetch(ctx, int32(concurrency))
			if err != nil {
				if ctx.Err() != nil {
					return
				}
				log.Printf("Error fetching feeds to scrape: %v", err)
				continue
			}

			if len(feeds) == 0 {
				continue
			}

			log.Printf("Found %d feeds to scrape", len(feeds))

			wg := &sync.WaitGroup{}
			for _, feed := range feeds {
				wg.Add(1)
				go scrapeFeed(ctx, db, wg, feed)
			}
			wg.Wait()
		}
	}
}

func scrapeFeed(ctx context.Context, db *database.Queries, wg *sync.WaitGroup, feed database.Feed) {
	defer wg.Done()

	if ctx.Err() != nil {
		return
	}

	_, err := db.MarkFeedsAsFetched(ctx, feed.ID)
	if err != nil {
		if ctx.Err() != nil {
			return
		}
		log.Printf("Error marking feed %v as fetched: %v", feed.ID, err)
		return
	}

	rssFeed, err := UrlToFeed(feed.Url)
	if err != nil {
		log.Printf("Error scraping feed %v: %v", feed.ID, err)
		return
	}

	for _, item := range rssFeed.Channel.Items {

		if ctx.Err() != nil {
			return
		}

		_, err := db.CreatePost(ctx, database.CreatePostParams{
			ID:           uuid.New(),
			Title:        item.Title,
			Description:  sql.NullString{String: item.Description, Valid: item.Description != ""},
			PublisghedAt: parseRSSDate(item.PubDate),
			Url:          item.Link,
			FeedID:       feed.ID,
		})
		if err != nil {
			if strings.Contains(err.Error(), "unique constraint") {
				continue
			}
			if ctx.Err() != nil {
				return
			}
			log.Printf("Error creating post for feed %v: %v", feed.ID, err)
		}
	}
	log.Printf("Scraped feed %v with title: %s", feed.ID, rssFeed.Channel.Title)
}

package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/Amudixp/portfolio-backend/internal/config"
	"github.com/Amudixp/portfolio-backend/internal/database"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := database.New(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer db.Close()

	ctx := context.Background()
	now := time.Now()

	// Seed Profile
	_, err = db.Pool.Exec(ctx, `
		INSERT INTO profile (id, name, major, university, location, status, email, phone, github, linkedin, gpa, short_bio, resume_url, updated_at)
		VALUES (
			1,
			'Amudi Purba',
			'Information Systems & Technology',
			'Institut Teknologi Bandung',
			'Bandung, Indonesia',
			'Undergraduate Student @ Information System & Technology',
			'amudipurba12@gmail.com',
			'+62-821-1557-5545',
			'https://github.com/Amudixp',
			'https://www.linkedin.com/in/amudipurba',
			'3.64 / 4.00 (128 credits)',
			'Third-year Information Systems & Technology student at Institut Teknologi Bandung with a focused interest in data and artificial intelligence.',
			'/assets/Amudi Purba_CV.pdf',
			$1
		) ON CONFLICT (id) DO UPDATE SET updated_at = $1`, now)
	
	if err != nil {
		log.Fatalf("Failed to seed profile: %v", err)
	}

	// Seed Education
	_, err = db.Pool.Exec(ctx, `
		INSERT INTO education (id, degree, institution, period, gpa, credits, relevant_courseworks, updated_at)
		VALUES (
			1,
			'Undergraduate Student of Information System and Technology',
			'Institut Teknologi Bandung',
			'Aug 2023 – Aug 2027 (Expected)',
			'3.64 / 4.00',
			'128 credits',
			ARRAY['Database Modelling', 'Database Management', 'Foundation of Artificial Intelligence'],
			$1
		) ON CONFLICT (id) DO UPDATE SET updated_at = $1`, now)

	if err != nil {
		log.Fatalf("Failed to seed education: %v", err)
	}

	fmt.Println("Seeding complete!")
}

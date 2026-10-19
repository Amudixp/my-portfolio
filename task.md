# Tasks — Phase 1: Backend Server (Go)

## Project Setup
- [ ] Verify Go installation
- [ ] Initialize Go module (`backend/`)
- [ ] Install dependencies (chi, pgx, jwt, oauth2, godotenv, cors)
- [ ] Create `.env.example`

## Core Infrastructure
- [ ] `internal/config/config.go` — env config loader
- [ ] `internal/database/database.go` — PostgreSQL connection pool
- [ ] `internal/database/migrations/001_initial_schema.sql` — full schema
- [ ] `internal/models/models.go` — Go struct definitions

## Middleware
- [ ] `internal/middleware/cors.go` — CORS configuration
- [ ] `internal/middleware/auth.go` — JWT verification middleware

## Handlers (API Endpoints)
- [ ] `internal/handlers/auth.go` — GitHub OAuth (login, callback, me, logout)
- [ ] `internal/handlers/upload.go` — Cloudinary presigned URL
- [ ] `internal/handlers/profile.go` — GET/PUT profile
- [ ] `internal/handlers/projects.go` — CRUD projects
- [ ] `internal/handlers/experiences.go` — CRUD experiences
- [ ] `internal/handlers/skills.go` — CRUD skills
- [ ] `internal/handlers/education.go` — GET/PUT education
- [ ] `internal/handlers/certifications.go` — CRUD certifications
- [ ] `internal/handlers/awards.go` — CRUD awards

## Router & Entry Point
- [ ] `internal/router/router.go` — route definitions
- [ ] `cmd/server/main.go` — server entry point

## Seed & Deployment
- [ ] `internal/seed/seed.go` — initial data seeder
- [ ] `Dockerfile` — container build
- [ ] `render.yaml` — Render deployment config

## Verification
- [ ] Build succeeds (`go build ./...`)
- [ ] Server starts and responds to health check
- [ ] Database migration runs successfully
- [ ] Seed data populates correctly
- [ ] All public GET endpoints return correct data
- [ ] Auth flow works (GitHub OAuth)
- [ ] Protected endpoints reject unauthenticated requests

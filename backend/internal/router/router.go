package router

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"net/http"

	"github.com/Amudixp/portfolio-backend/internal/config"
	"github.com/Amudixp/portfolio-backend/internal/database"
	"github.com/Amudixp/portfolio-backend/internal/handlers"
	mw "github.com/Amudixp/portfolio-backend/internal/middleware"
)

// Setup creates and configures the HTTP router.
func Setup(db *database.DB, cfg *config.Config) *chi.Mux {
	r := chi.NewRouter()

	// Base middleware
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(mw.CORS(cfg.AllowedOrigins))

	// Init handlers
	authHandler := handlers.NewAuthHandler(db, cfg)
	uploadHandler := handlers.NewUploadHandler(cfg)
	profileHandler := handlers.NewProfileHandler(db)
	projectHandler := handlers.NewProjectHandler(db)
	experienceHandler := handlers.NewExperienceHandler(db)
	skillHandler := handlers.NewSkillHandler(db)
	educationHandler := handlers.NewEducationHandler(db)
	certificationHandler := handlers.NewCertificationHandler(db)
	awardHandler := handlers.NewAwardHandler(db)

	r.Route("/api", func(r chi.Router) {
		// Health check
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte(`{"status":"ok"}`))
		})

		// Auth
		r.Route("/auth", func(r chi.Router) {
			r.Get("/github", authHandler.GitHubLogin)
			r.Get("/github/callback", authHandler.GitHubCallback)

			r.With(mw.Auth(cfg.JWTSecret)).Get("/me", authHandler.Me)
			r.With(mw.Auth(cfg.JWTSecret)).Post("/logout", authHandler.Logout)
		})

		// Public Endpoints
		r.Get("/profile", profileHandler.Get)
		r.Get("/projects", projectHandler.List)
		r.Get("/experiences", experienceHandler.List)
		r.Get("/skills", skillHandler.List)
		r.Get("/education", educationHandler.Get)
		r.Get("/certifications", certificationHandler.List)
		r.Get("/awards", awardHandler.List)

		// Protected Endpoints (Admin only)
		r.Group(func(r chi.Router) {
			r.Use(mw.Auth(cfg.JWTSecret))

			r.Post("/upload/signature", uploadHandler.GenerateSignature)

			r.Put("/profile", profileHandler.Update)

			r.Post("/projects", projectHandler.Create)
			r.Put("/projects/{id}", projectHandler.Update)
			r.Delete("/projects/{id}", projectHandler.Delete)

			r.Post("/experiences", experienceHandler.Create)
			r.Put("/experiences/{id}", experienceHandler.Update)
			r.Delete("/experiences/{id}", experienceHandler.Delete)

			r.Post("/skills", skillHandler.Create)
			r.Put("/skills/{id}", skillHandler.Update)
			r.Delete("/skills/{id}", skillHandler.Delete)

			r.Put("/education", educationHandler.Update)

			r.Post("/certifications", certificationHandler.Create)
			r.Put("/certifications/{id}", certificationHandler.Update)
			r.Delete("/certifications/{id}", certificationHandler.Delete)

			r.Post("/awards", awardHandler.Create)
			r.Put("/awards/{id}", awardHandler.Update)
			r.Delete("/awards/{id}", awardHandler.Delete)
		})
	})

	return r
}

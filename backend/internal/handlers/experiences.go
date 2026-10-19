package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/Amudixp/portfolio-backend/internal/database"
	"github.com/Amudixp/portfolio-backend/internal/models"
	"github.com/go-chi/chi/v5"
)

// ExperienceHandler handles experience-related API endpoints.
type ExperienceHandler struct {
	db *database.DB
}

// NewExperienceHandler creates a new ExperienceHandler.
func NewExperienceHandler(db *database.DB) *ExperienceHandler {
	return &ExperienceHandler{db: db}
}

// List returns all experiences ordered by display_order.
func (h *ExperienceHandler) List(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Pool.Query(r.Context(),
		`SELECT id, COALESCE(year,''), title, COALESCE(organization,''),
		        COALESCE(description,''), tags, logo_url, logo_color,
		        display_order, created_at, updated_at
		 FROM experiences ORDER BY display_order ASC, id ASC`,
	)
	if err != nil {
		http.Error(w, `{"error":"failed to fetch experiences"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	experiences := []models.Experience{}
	for rows.Next() {
		var e models.Experience
		if err := rows.Scan(&e.ID, &e.Year, &e.Title, &e.Organization,
			&e.Description, &e.Tags, &e.LogoURL, &e.LogoColor,
			&e.DisplayOrder, &e.CreatedAt, &e.UpdatedAt); err != nil {
			continue
		}
		if e.Tags == nil {
			e.Tags = []string{}
		}
		experiences = append(experiences, e)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(experiences)
}

// Create creates a new experience.
func (h *ExperienceHandler) Create(w http.ResponseWriter, r *http.Request) {
	var e models.Experience
	if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	now := time.Now()
	err := h.db.Pool.QueryRow(r.Context(),
		`INSERT INTO experiences (year, title, organization, description, tags, logo_url, logo_color, display_order, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		 RETURNING id`,
		e.Year, e.Title, e.Organization, e.Description,
		e.Tags, e.LogoURL, e.LogoColor, e.DisplayOrder, now, now,
	).Scan(&e.ID)

	if err != nil {
		http.Error(w, `{"error":"failed to create experience"}`, http.StatusInternalServerError)
		return
	}

	e.CreatedAt = now
	e.UpdatedAt = now

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(e)
}

// Update updates an existing experience.
func (h *ExperienceHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, `{"error":"invalid experience ID"}`, http.StatusBadRequest)
		return
	}

	var e models.Experience
	if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	now := time.Now()
	result, err := h.db.Pool.Exec(r.Context(),
		`UPDATE experiences SET
			year = $1, title = $2, organization = $3, description = $4,
			tags = $5, logo_url = $6, logo_color = $7, display_order = $8,
			updated_at = $9
		 WHERE id = $10`,
		e.Year, e.Title, e.Organization, e.Description,
		e.Tags, e.LogoURL, e.LogoColor, e.DisplayOrder, now, id,
	)

	if err != nil {
		http.Error(w, `{"error":"failed to update experience"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, `{"error":"experience not found"}`, http.StatusNotFound)
		return
	}

	e.ID = id
	e.UpdatedAt = now

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(e)
}

// Delete removes an experience.
func (h *ExperienceHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, `{"error":"invalid experience ID"}`, http.StatusBadRequest)
		return
	}

	result, err := h.db.Pool.Exec(r.Context(), "DELETE FROM experiences WHERE id = $1", id)
	if err != nil {
		http.Error(w, `{"error":"failed to delete experience"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, `{"error":"experience not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "experience deleted"})
}

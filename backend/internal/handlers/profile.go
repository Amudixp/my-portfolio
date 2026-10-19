package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/Amudixp/portfolio-backend/internal/database"
	"github.com/Amudixp/portfolio-backend/internal/models"
)

// ProfileHandler handles profile-related API endpoints.
type ProfileHandler struct {
	db *database.DB
}

// NewProfileHandler creates a new ProfileHandler.
func NewProfileHandler(db *database.DB) *ProfileHandler {
	return &ProfileHandler{db: db}
}

// Get returns the profile data.
func (h *ProfileHandler) Get(w http.ResponseWriter, r *http.Request) {
	var p models.Profile
	err := h.db.Pool.QueryRow(r.Context(),
		`SELECT id, name, COALESCE(major,''), COALESCE(university,''), COALESCE(location,''),
		        COALESCE(status,''), COALESCE(email,''), COALESCE(phone,''),
		        COALESCE(github,''), COALESCE(linkedin,''), COALESCE(gpa,''),
		        COALESCE(short_bio,''), resume_url, updated_at
		 FROM profile LIMIT 1`,
	).Scan(&p.ID, &p.Name, &p.Major, &p.University, &p.Location,
		&p.Status, &p.Email, &p.Phone, &p.GitHub, &p.LinkedIn,
		&p.GPA, &p.ShortBio, &p.ResumeURL, &p.UpdatedAt)

	if err != nil {
		http.Error(w, `{"error":"profile not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

// Update updates the profile data.
func (h *ProfileHandler) Update(w http.ResponseWriter, r *http.Request) {
	var p models.Profile
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	_, err := h.db.Pool.Exec(r.Context(),
		`UPDATE profile SET
			name = $1, major = $2, university = $3, location = $4,
			status = $5, email = $6, phone = $7, github = $8,
			linkedin = $9, gpa = $10, short_bio = $11, resume_url = $12,
			updated_at = $13
		 WHERE id = (SELECT id FROM profile LIMIT 1)`,
		p.Name, p.Major, p.University, p.Location,
		p.Status, p.Email, p.Phone, p.GitHub,
		p.LinkedIn, p.GPA, p.ShortBio, p.ResumeURL,
		time.Now(),
	)

	if err != nil {
		http.Error(w, `{"error":"failed to update profile"}`, http.StatusInternalServerError)
		return
	}

	// Return updated profile
	h.Get(w, r)
}

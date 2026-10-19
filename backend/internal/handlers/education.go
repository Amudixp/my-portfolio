package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/Amudixp/portfolio-backend/internal/database"
	"github.com/Amudixp/portfolio-backend/internal/models"
)

// EducationHandler handles education-related API endpoints.
type EducationHandler struct {
	db *database.DB
}

// NewEducationHandler creates a new EducationHandler.
func NewEducationHandler(db *database.DB) *EducationHandler {
	return &EducationHandler{db: db}
}

// Get returns the education data along with certifications and awards.
func (h *EducationHandler) Get(w http.ResponseWriter, r *http.Request) {
	// Fetch education (singleton)
	var edu models.Education
	err := h.db.Pool.QueryRow(r.Context(),
		`SELECT id, COALESCE(degree,''), COALESCE(institution,''),
		        COALESCE(period,''), COALESCE(gpa,''), COALESCE(credits,''),
		        relevant_courseworks, updated_at
		 FROM education LIMIT 1`,
	).Scan(&edu.ID, &edu.Degree, &edu.Institution, &edu.Period,
		&edu.GPA, &edu.Credits, &edu.RelevantCourseworks, &edu.UpdatedAt)

	if err != nil {
		http.Error(w, `{"error":"education not found"}`, http.StatusNotFound)
		return
	}

	if edu.RelevantCourseworks == nil {
		edu.RelevantCourseworks = []string{}
	}

	// Fetch certifications
	certRows, err := h.db.Pool.Query(r.Context(),
		`SELECT id, title, issuer, COALESCE(date,''), link, display_order
		 FROM certifications ORDER BY display_order ASC, id ASC`,
	)
	if err != nil {
		http.Error(w, `{"error":"failed to fetch certifications"}`, http.StatusInternalServerError)
		return
	}
	defer certRows.Close()

	certs := []models.Certification{}
	for certRows.Next() {
		var c models.Certification
		if err := certRows.Scan(&c.ID, &c.Title, &c.Issuer, &c.Date, &c.Link, &c.DisplayOrder); err != nil {
			continue
		}
		certs = append(certs, c)
	}

	// Fetch awards
	awardRows, err := h.db.Pool.Query(r.Context(),
		`SELECT id, title, COALESCE(year,''), description, tag, display_order
		 FROM awards ORDER BY display_order ASC, id ASC`,
	)
	if err != nil {
		http.Error(w, `{"error":"failed to fetch awards"}`, http.StatusInternalServerError)
		return
	}
	defer awardRows.Close()

	awards := []models.Award{}
	for awardRows.Next() {
		var a models.Award
		if err := awardRows.Scan(&a.ID, &a.Title, &a.Year, &a.Description, &a.Tag, &a.DisplayOrder); err != nil {
			continue
		}
		awards = append(awards, a)
	}

	result := models.EducationFull{
		Education:      edu,
		Certifications: certs,
		Awards:         awards,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// Update updates the education data.
func (h *EducationHandler) Update(w http.ResponseWriter, r *http.Request) {
	var edu models.Education
	if err := json.NewDecoder(r.Body).Decode(&edu); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	_, err := h.db.Pool.Exec(r.Context(),
		`UPDATE education SET
			degree = $1, institution = $2, period = $3, gpa = $4,
			credits = $5, relevant_courseworks = $6, updated_at = $7
		 WHERE id = (SELECT id FROM education LIMIT 1)`,
		edu.Degree, edu.Institution, edu.Period, edu.GPA,
		edu.Credits, edu.RelevantCourseworks, time.Now(),
	)

	if err != nil {
		http.Error(w, `{"error":"failed to update education"}`, http.StatusInternalServerError)
		return
	}

	h.Get(w, r)
}

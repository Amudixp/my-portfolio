package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Amudixp/portfolio-backend/internal/database"
	"github.com/Amudixp/portfolio-backend/internal/models"
	"github.com/go-chi/chi/v5"
)

// CertificationHandler handles certification-related API endpoints.
type CertificationHandler struct {
	db *database.DB
}

// NewCertificationHandler creates a new CertificationHandler.
func NewCertificationHandler(db *database.DB) *CertificationHandler {
	return &CertificationHandler{db: db}
}

// List returns all certifications.
func (h *CertificationHandler) List(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Pool.Query(r.Context(),
		`SELECT id, title, issuer, COALESCE(date,''), link, display_order
		 FROM certifications ORDER BY display_order ASC, id ASC`,
	)
	if err != nil {
		http.Error(w, `{"error":"failed to fetch certifications"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	certs := []models.Certification{}
	for rows.Next() {
		var c models.Certification
		if err := rows.Scan(&c.ID, &c.Title, &c.Issuer, &c.Date, &c.Link, &c.DisplayOrder); err != nil {
			continue
		}
		certs = append(certs, c)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(certs)
}

// Create creates a new certification.
func (h *CertificationHandler) Create(w http.ResponseWriter, r *http.Request) {
	var c models.Certification
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	err := h.db.Pool.QueryRow(r.Context(),
		`INSERT INTO certifications (title, issuer, date, link, display_order)
		 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		c.Title, c.Issuer, c.Date, c.Link, c.DisplayOrder,
	).Scan(&c.ID)

	if err != nil {
		http.Error(w, `{"error":"failed to create certification"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(c)
}

// Update updates an existing certification.
func (h *CertificationHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, `{"error":"invalid certification ID"}`, http.StatusBadRequest)
		return
	}

	var c models.Certification
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	result, err := h.db.Pool.Exec(r.Context(),
		`UPDATE certifications SET title = $1, issuer = $2, date = $3, link = $4, display_order = $5 WHERE id = $6`,
		c.Title, c.Issuer, c.Date, c.Link, c.DisplayOrder, id,
	)

	if err != nil {
		http.Error(w, `{"error":"failed to update certification"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, `{"error":"certification not found"}`, http.StatusNotFound)
		return
	}

	c.ID = id

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

// Delete removes a certification.
func (h *CertificationHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, `{"error":"invalid certification ID"}`, http.StatusBadRequest)
		return
	}

	result, err := h.db.Pool.Exec(r.Context(), "DELETE FROM certifications WHERE id = $1", id)
	if err != nil {
		http.Error(w, `{"error":"failed to delete certification"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, `{"error":"certification not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "certification deleted"})
}

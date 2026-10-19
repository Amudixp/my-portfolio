package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Amudixp/portfolio-backend/internal/database"
	"github.com/Amudixp/portfolio-backend/internal/models"
	"github.com/go-chi/chi/v5"
)

// AwardHandler handles award-related API endpoints.
type AwardHandler struct {
	db *database.DB
}

// NewAwardHandler creates a new AwardHandler.
func NewAwardHandler(db *database.DB) *AwardHandler {
	return &AwardHandler{db: db}
}

// List returns all awards.
func (h *AwardHandler) List(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Pool.Query(r.Context(),
		`SELECT id, title, COALESCE(year,''), description, tag, display_order
		 FROM awards ORDER BY display_order ASC, id ASC`,
	)
	if err != nil {
		http.Error(w, `{"error":"failed to fetch awards"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	awards := []models.Award{}
	for rows.Next() {
		var a models.Award
		if err := rows.Scan(&a.ID, &a.Title, &a.Year, &a.Description, &a.Tag, &a.DisplayOrder); err != nil {
			continue
		}
		awards = append(awards, a)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(awards)
}

// Create creates a new award.
func (h *AwardHandler) Create(w http.ResponseWriter, r *http.Request) {
	var a models.Award
	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	err := h.db.Pool.QueryRow(r.Context(),
		`INSERT INTO awards (title, year, description, tag, display_order)
		 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		a.Title, a.Year, a.Description, a.Tag, a.DisplayOrder,
	).Scan(&a.ID)

	if err != nil {
		http.Error(w, `{"error":"failed to create award"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(a)
}

// Update updates an existing award.
func (h *AwardHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, `{"error":"invalid award ID"}`, http.StatusBadRequest)
		return
	}

	var a models.Award
	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	result, err := h.db.Pool.Exec(r.Context(),
		`UPDATE awards SET title = $1, year = $2, description = $3, tag = $4, display_order = $5 WHERE id = $6`,
		a.Title, a.Year, a.Description, a.Tag, a.DisplayOrder, id,
	)

	if err != nil {
		http.Error(w, `{"error":"failed to update award"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, `{"error":"award not found"}`, http.StatusNotFound)
		return
	}

	a.ID = id

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(a)
}

// Delete removes an award.
func (h *AwardHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, `{"error":"invalid award ID"}`, http.StatusBadRequest)
		return
	}

	result, err := h.db.Pool.Exec(r.Context(), "DELETE FROM awards WHERE id = $1", id)
	if err != nil {
		http.Error(w, `{"error":"failed to delete award"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, `{"error":"award not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "award deleted"})
}

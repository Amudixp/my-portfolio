package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Amudixp/portfolio-backend/internal/database"
	"github.com/Amudixp/portfolio-backend/internal/models"
	"github.com/go-chi/chi/v5"
)

// SkillHandler handles skill category API endpoints.
type SkillHandler struct {
	db *database.DB
}

// NewSkillHandler creates a new SkillHandler.
func NewSkillHandler(db *database.DB) *SkillHandler {
	return &SkillHandler{db: db}
}

// List returns all skill categories ordered by display_order.
func (h *SkillHandler) List(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Pool.Query(r.Context(),
		`SELECT id, category, items, display_order
		 FROM skill_categories ORDER BY display_order ASC, id ASC`,
	)
	if err != nil {
		http.Error(w, `{"error":"failed to fetch skills"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	skills := []models.SkillCategory{}
	for rows.Next() {
		var s models.SkillCategory
		if err := rows.Scan(&s.ID, &s.Category, &s.Items, &s.DisplayOrder); err != nil {
			continue
		}
		if s.Items == nil {
			s.Items = []string{}
		}
		skills = append(skills, s)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(skills)
}

// Create creates a new skill category.
func (h *SkillHandler) Create(w http.ResponseWriter, r *http.Request) {
	var s models.SkillCategory
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	err := h.db.Pool.QueryRow(r.Context(),
		`INSERT INTO skill_categories (category, items, display_order)
		 VALUES ($1, $2, $3) RETURNING id`,
		s.Category, s.Items, s.DisplayOrder,
	).Scan(&s.ID)

	if err != nil {
		http.Error(w, `{"error":"failed to create skill category"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(s)
}

// Update updates an existing skill category.
func (h *SkillHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, `{"error":"invalid skill category ID"}`, http.StatusBadRequest)
		return
	}

	var s models.SkillCategory
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	result, err := h.db.Pool.Exec(r.Context(),
		`UPDATE skill_categories SET category = $1, items = $2, display_order = $3 WHERE id = $4`,
		s.Category, s.Items, s.DisplayOrder, id,
	)

	if err != nil {
		http.Error(w, `{"error":"failed to update skill category"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, `{"error":"skill category not found"}`, http.StatusNotFound)
		return
	}

	s.ID = id

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s)
}

// Delete removes a skill category.
func (h *SkillHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, `{"error":"invalid skill category ID"}`, http.StatusBadRequest)
		return
	}

	result, err := h.db.Pool.Exec(r.Context(), "DELETE FROM skill_categories WHERE id = $1", id)
	if err != nil {
		http.Error(w, `{"error":"failed to delete skill category"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, `{"error":"skill category not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "skill category deleted"})
}

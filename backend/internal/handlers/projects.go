package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/Amudixp/portfolio-backend/internal/database"
	"github.com/Amudixp/portfolio-backend/internal/models"
	"github.com/go-chi/chi/v5"
)

// ProjectHandler handles project-related API endpoints.
type ProjectHandler struct {
	db *database.DB
}

// NewProjectHandler creates a new ProjectHandler.
func NewProjectHandler(db *database.DB) *ProjectHandler {
	return &ProjectHandler{db: db}
}

// List returns all projects ordered by display_order.
func (h *ProjectHandler) List(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Pool.Query(r.Context(),
		`SELECT id, title, COALESCE(subtitle,''), COALESCE(year,''),
		        COALESCE(description,''), full_description, tech,
		        image_url, link, display_order, created_at, updated_at
		 FROM projects ORDER BY display_order ASC, id ASC`,
	)
	if err != nil {
		http.Error(w, `{"error":"failed to fetch projects"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	projects := []models.Project{}
	for rows.Next() {
		var p models.Project
		if err := rows.Scan(&p.ID, &p.Title, &p.Subtitle, &p.Year,
			&p.Description, &p.FullDescription, &p.Tech,
			&p.ImageURL, &p.Link, &p.DisplayOrder,
			&p.CreatedAt, &p.UpdatedAt); err != nil {
			continue
		}
		projects = append(projects, p)
	}

	// Load metrics for all projects
	for i, p := range projects {
		metrics, err := h.getMetrics(r.Context(), p.ID)
		if err == nil {
			projects[i].Metrics = metrics
		}
		if projects[i].Metrics == nil {
			projects[i].Metrics = []models.ProjectMetric{}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}

// Create creates a new project.
func (h *ProjectHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p models.Project
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	now := time.Now()
	err := h.db.Pool.QueryRow(r.Context(),
		`INSERT INTO projects (title, subtitle, year, description, full_description, tech, image_url, link, display_order, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		 RETURNING id`,
		p.Title, p.Subtitle, p.Year, p.Description, p.FullDescription,
		p.Tech, p.ImageURL, p.Link, p.DisplayOrder, now, now,
	).Scan(&p.ID)

	if err != nil {
		http.Error(w, `{"error":"failed to create project"}`, http.StatusInternalServerError)
		return
	}

	// Insert metrics
	for _, m := range p.Metrics {
		h.db.Pool.Exec(r.Context(),
			`INSERT INTO project_metrics (project_id, value, label) VALUES ($1, $2, $3)`,
			p.ID, m.Value, m.Label,
		)
	}

	p.CreatedAt = now
	p.UpdatedAt = now

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(p)
}

// Update updates an existing project.
func (h *ProjectHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, `{"error":"invalid project ID"}`, http.StatusBadRequest)
		return
	}

	var p models.Project
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	now := time.Now()
	result, err := h.db.Pool.Exec(r.Context(),
		`UPDATE projects SET
			title = $1, subtitle = $2, year = $3, description = $4,
			full_description = $5, tech = $6, image_url = $7, link = $8,
			display_order = $9, updated_at = $10
		 WHERE id = $11`,
		p.Title, p.Subtitle, p.Year, p.Description,
		p.FullDescription, p.Tech, p.ImageURL, p.Link,
		p.DisplayOrder, now, id,
	)

	if err != nil {
		http.Error(w, `{"error":"failed to update project"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, `{"error":"project not found"}`, http.StatusNotFound)
		return
	}

	// Replace metrics
	h.db.Pool.Exec(r.Context(), "DELETE FROM project_metrics WHERE project_id = $1", id)
	for _, m := range p.Metrics {
		h.db.Pool.Exec(r.Context(),
			`INSERT INTO project_metrics (project_id, value, label) VALUES ($1, $2, $3)`,
			id, m.Value, m.Label,
		)
	}

	p.ID = id
	p.UpdatedAt = now

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

// Delete removes a project.
func (h *ProjectHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, `{"error":"invalid project ID"}`, http.StatusBadRequest)
		return
	}

	result, err := h.db.Pool.Exec(r.Context(), "DELETE FROM projects WHERE id = $1", id)
	if err != nil {
		http.Error(w, `{"error":"failed to delete project"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, `{"error":"project not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "project deleted"})
}

func (h *ProjectHandler) getMetrics(ctx context.Context, projectID int) ([]models.ProjectMetric, error) {
	rows, err := h.db.Pool.Query(ctx,
		"SELECT id, project_id, value, label FROM project_metrics WHERE project_id = $1",
		projectID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var metrics []models.ProjectMetric
	for rows.Next() {
		var m models.ProjectMetric
		if err := rows.Scan(&m.ID, &m.ProjectID, &m.Value, &m.Label); err != nil {
			continue
		}
		metrics = append(metrics, m)
	}
	return metrics, nil
}

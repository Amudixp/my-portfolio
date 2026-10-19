package models

import "time"

// Profile represents the portfolio owner's profile (singleton row).
type Profile struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Major     string    `json:"major"`
	University string   `json:"university"`
	Location  string    `json:"location"`
	Status    string    `json:"status"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	GitHub    string    `json:"github"`
	LinkedIn  string    `json:"linkedin"`
	GPA       string    `json:"gpa"`
	ShortBio  string    `json:"shortBio"`
	ResumeURL *string   `json:"resume,omitempty"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Project represents a portfolio project.
type Project struct {
	ID              int              `json:"id"`
	Title           string           `json:"title"`
	Subtitle        string           `json:"subtitle"`
	Year            string           `json:"year"`
	Description     string           `json:"description"`
	FullDescription *string          `json:"fullDescription,omitempty"`
	Tech            []string         `json:"tech"`
	ImageURL        *string          `json:"image,omitempty"`
	Link            *string          `json:"link,omitempty"`
	Metrics         []ProjectMetric  `json:"metrics"`
	DisplayOrder    int              `json:"displayOrder"`
	CreatedAt       time.Time        `json:"createdAt"`
	UpdatedAt       time.Time        `json:"updatedAt"`
}

// ProjectMetric represents a project's metric (e.g. "Top 15" / "NATIONAL FINALIST").
type ProjectMetric struct {
	ID        int    `json:"id"`
	ProjectID int    `json:"projectId"`
	Value     string `json:"value"`
	Label     string `json:"label"`
}

// Experience represents a work/organizational experience entry.
type Experience struct {
	ID           int       `json:"id"`
	Year         string    `json:"year"`
	Title        string    `json:"title"`
	Organization string    `json:"organization"`
	Description  string    `json:"description"`
	Tags         []string  `json:"tags"`
	LogoURL      *string   `json:"logoImagePath,omitempty"`
	LogoColor    *string   `json:"logoColor,omitempty"`
	DisplayOrder int       `json:"displayOrder"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// SkillCategory represents a group of skills (e.g. "Languages": ["Go", "Python"]).
type SkillCategory struct {
	ID           int      `json:"id"`
	Category     string   `json:"category"`
	Items        []string `json:"items"`
	DisplayOrder int      `json:"displayOrder"`
}

// Education represents education data (singleton row).
type Education struct {
	ID                  int       `json:"id"`
	Degree              string    `json:"degree"`
	Institution         string    `json:"institution"`
	Period              string    `json:"period"`
	GPA                 string    `json:"gpa"`
	Credits             string    `json:"credits"`
	RelevantCourseworks []string  `json:"relevantCourseworks"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

// Certification represents a professional certification.
type Certification struct {
	ID           int     `json:"id"`
	Title        string  `json:"title"`
	Issuer       *string `json:"issuer,omitempty"`
	Date         string  `json:"date"`
	Link         *string `json:"link,omitempty"`
	DisplayOrder int     `json:"displayOrder"`
}

// Award represents an award or achievement.
type Award struct {
	ID           int     `json:"id"`
	Title        string  `json:"title"`
	Year         string  `json:"year"`
	Description  *string `json:"description,omitempty"`
	Tag          *string `json:"tag,omitempty"`
	DisplayOrder int     `json:"displayOrder"`
}

// EducationFull bundles education with its certifications and awards.
type EducationFull struct {
	Education      Education      `json:"education"`
	Certifications []Certification `json:"certifications"`
	Awards         []Award         `json:"awards"`
}

// AdminSession represents a logged-in admin session.
type AdminSession struct {
	ID          string    `json:"id"`
	GitHubID    int64     `json:"githubId"`
	GitHubLogin string    `json:"githubLogin"`
	AccessToken string    `json:"-"`
	CreatedAt   time.Time `json:"createdAt"`
	ExpiresAt   time.Time `json:"expiresAt"`
}

// --- Request/Response DTOs ---

// LoginResponse is returned after successful OAuth login.
type LoginResponse struct {
	Token string `json:"token"`
	User  struct {
		GitHubLogin string `json:"githubLogin"`
		AvatarURL   string `json:"avatarUrl"`
	} `json:"user"`
}

// CloudinarySignatureResponse is returned for presigned upload.
type CloudinarySignatureResponse struct {
	Signature string `json:"signature"`
	Timestamp int64  `json:"timestamp"`
	APIKey    string `json:"apiKey"`
	CloudName string `json:"cloudName"`
	Folder    string `json:"folder"`
}

// ErrorResponse is a standard error payload.
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
}

// HealthResponse is the health check response.
type HealthResponse struct {
	Status string `json:"status"`
	Time   string `json:"time"`
}

package handlers

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/Amudixp/portfolio-backend/internal/config"
	"github.com/Amudixp/portfolio-backend/internal/database"
	mw "github.com/Amudixp/portfolio-backend/internal/middleware"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

// AuthHandler handles GitHub OAuth authentication.
type AuthHandler struct {
	db          *database.DB
	cfg         *config.Config
	oauthConfig *oauth2.Config
}

// NewAuthHandler creates a new AuthHandler.
func NewAuthHandler(db *database.DB, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		db:  db,
		cfg: cfg,
		oauthConfig: &oauth2.Config{
			ClientID:     cfg.GitHubClientID,
			ClientSecret: cfg.GitHubClientSecret,
			RedirectURL:  cfg.GitHubRedirectURL,
			Scopes:       []string{"read:user"},
			Endpoint:     github.Endpoint,
		},
	}
}

// GitHubLogin initiates the GitHub OAuth flow.
func (h *AuthHandler) GitHubLogin(w http.ResponseWriter, r *http.Request) {
	state := generateState()

	// Store state in a short-lived cookie for CSRF protection
	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Path:     "/",
		MaxAge:   600, // 10 minutes
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   r.TLS != nil,
	})

	url := h.oauthConfig.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// GitHubCallback handles the OAuth callback from GitHub.
func (h *AuthHandler) GitHubCallback(w http.ResponseWriter, r *http.Request) {
	// Verify state for CSRF protection
	stateCookie, err := r.Cookie("oauth_state")
	if err != nil || stateCookie.Value != r.URL.Query().Get("state") {
		http.Error(w, `{"error":"invalid state parameter"}`, http.StatusBadRequest)
		return
	}

	// Clear the state cookie
	http.SetCookie(w, &http.Cookie{
		Name:   "oauth_state",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})

	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, `{"error":"missing code parameter"}`, http.StatusBadRequest)
		return
	}

	// Exchange code for token
	token, err := h.oauthConfig.Exchange(r.Context(), code)
	if err != nil {
		http.Error(w, `{"error":"failed to exchange code"}`, http.StatusInternalServerError)
		return
	}

	// Get user info from GitHub
	client := h.oauthConfig.Client(r.Context(), token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		http.Error(w, `{"error":"failed to get user info"}`, http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var ghUser struct {
		ID        int64  `json:"id"`
		Login     string `json:"login"`
		AvatarURL string `json:"avatar_url"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&ghUser); err != nil {
		http.Error(w, `{"error":"failed to decode user info"}`, http.StatusInternalServerError)
		return
	}

	// Verify this is the authorized admin
	adminID, _ := strconv.ParseInt(h.cfg.AdminGitHubID, 10, 64)
	if ghUser.ID != adminID {
		http.Error(w, `{"error":"forbidden","message":"you are not authorized as admin"}`, http.StatusForbidden)
		return
	}

	// Create session in database
	expiresAt := time.Now().Add(24 * time.Hour)
	_, err = h.db.Pool.Exec(r.Context(),
		`INSERT INTO admin_sessions (github_id, github_login, access_token, expires_at)
		 VALUES ($1, $2, $3, $4)`,
		ghUser.ID, ghUser.Login, token.AccessToken, expiresAt,
	)
	if err != nil {
		http.Error(w, `{"error":"failed to create session"}`, http.StatusInternalServerError)
		return
	}

	// Generate JWT
	jwtToken, err := h.generateJWT(ghUser.ID, ghUser.Login, expiresAt)
	if err != nil {
		http.Error(w, `{"error":"failed to generate token"}`, http.StatusInternalServerError)
		return
	}

	// Set JWT as cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    jwtToken,
		Path:     "/",
		Expires:  expiresAt,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   r.TLS != nil,
	})

	// Redirect to CMS dashboard
	http.Redirect(w, r, h.cfg.CMSURL+"/dashboard?token="+jwtToken, http.StatusTemporaryRedirect)
}

// Me returns the current authenticated admin info.
func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	claims := mw.GetClaims(r.Context())
	if claims == nil {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"githubId":    claims.GitHubID,
		"githubLogin": claims.GitHubLogin,
	})
}

// Logout invalidates the current session.
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	claims := mw.GetClaims(r.Context())
	if claims != nil {
		// Delete sessions for this user
		h.db.Pool.Exec(r.Context(),
			"DELETE FROM admin_sessions WHERE github_id = $1",
			claims.GitHubID,
		)
	}

	// Clear the cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "logged out"})
}

func (h *AuthHandler) generateJWT(githubID int64, login string, expiresAt time.Time) (string, error) {
	claims := &mw.JWTClaims{
		GitHubID:    githubID,
		GitHubLogin: login,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "portfolio-backend",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(h.cfg.JWTSecret))
}

func generateState() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

// Ensure context is used (avoid lint warning)
var _ = context.Background

package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/Amudixp/portfolio-backend/internal/config"
	"github.com/Amudixp/portfolio-backend/internal/models"
)

// UploadHandler handles Cloudinary presigned URL generation.
type UploadHandler struct {
	cfg *config.Config
}

// NewUploadHandler creates a new UploadHandler.
func NewUploadHandler(cfg *config.Config) *UploadHandler {
	return &UploadHandler{cfg: cfg}
}

// GenerateSignature creates a Cloudinary upload signature.
func (h *UploadHandler) GenerateSignature(w http.ResponseWriter, r *http.Request) {
	// Parse optional folder from request body
	var req struct {
		Folder string `json:"folder"`
	}
	if r.Body != nil {
		json.NewDecoder(r.Body).Decode(&req)
	}
	if req.Folder == "" {
		req.Folder = "portfolio"
	}

	timestamp := time.Now().Unix()

	// Build the string to sign
	// Cloudinary requires parameters sorted alphabetically
	params := map[string]string{
		"folder":    req.Folder,
		"timestamp": strconv.FormatInt(timestamp, 10),
	}

	signature := generateCloudinarySignature(params, h.cfg.CloudinaryAPISecret)

	resp := models.CloudinarySignatureResponse{
		Signature: signature,
		Timestamp: timestamp,
		APIKey:    h.cfg.CloudinaryAPIKey,
		CloudName: h.cfg.CloudinaryCloudName,
		Folder:    req.Folder,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// generateCloudinarySignature creates an SHA-256 HMAC signature for Cloudinary.
func generateCloudinarySignature(params map[string]string, apiSecret string) string {
	// Sort keys alphabetically
	keys := make([]string, 0, len(params))
	for k := range params {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	// Build the string to sign: key1=value1&key2=value2 + apiSecret
	var parts []string
	for _, k := range keys {
		parts = append(parts, fmt.Sprintf("%s=%s", k, params[k]))
	}
	toSign := strings.Join(parts, "&") + apiSecret

	hash := sha256.Sum256([]byte(toSign))
	return hex.EncodeToString(hash[:])
}

// Ensure unused imports don't cause errors
var _ = strconv.Itoa

# Portfolio Backend Server + Web CMS

Backend API server (Go) dan admin CMS panel untuk mengelola konten portfolio secara dinamis, menggantikan data yang saat ini di-hardcode di file TypeScript.

---

## Keputusan Desain (Resolved)

| Keputusan | Pilihan |
|-----------|---------|
| **Backend Language** | Go (Chi router) |
| **Database** | PostgreSQL via Neon (free tier, 512MB) |
| **Image Upload** | Cloudinary via Presigned URL (frontend → Cloudinary langsung) |
| **Auth** | GitHub OAuth (single admin) |
| **CMS** | Folder terpisah `portfolio/cms/` (Vite + React) |
| **Deployment** | Render (Go API) + Vercel (CMS) + Neon (PostgreSQL) + Cloudinary (images) |

### Subdomain Architecture

```
amudipurba.com          → Portfolio Frontend (Vercel)
admin.amudipurba.com    → CMS Dashboard (Vercel, project terpisah)
api.amudipurba.com      → Go Backend API (Render)
```

> [!NOTE]
> Set CNAME record di DNS provider kamu untuk masing-masing subdomain.

---

## Proposed Changes

### Tahap 1: Backend Server (Go) — *Dikerjakan sekarang*

---

#### [NEW] `backend/` — Go project structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go                  # Entry point, server startup
├── internal/
│   ├── config/
│   │   └── config.go                # Environment config loader
│   ├── database/
│   │   ├── database.go              # PostgreSQL connection pool
│   │   └── migrations/
│   │       └── 001_initial_schema.sql
│   ├── handlers/
│   │   ├── auth.go                  # GitHub OAuth login/callback
│   │   ├── profile.go               # GET/PUT /api/profile
│   │   ├── projects.go              # CRUD /api/projects
│   │   ├── experiences.go           # CRUD /api/experiences
│   │   ├── skills.go                # CRUD /api/skills
│   │   ├── education.go             # GET/PUT /api/education
│   │   ├── certifications.go        # CRUD /api/certifications
│   │   ├── awards.go                # CRUD /api/awards
│   │   └── upload.go                # POST /api/upload/signature (Cloudinary presigned URL)
│   ├── middleware/
│   │   ├── auth.go                  # JWT verification middleware
│   │   └── cors.go                  # CORS configuration
│   ├── models/
│   │   └── models.go                # Go struct definitions
│   ├── router/
│   │   └── router.go                # Route definitions
│   └── seed/
│       └── seed.go                  # Initial data seeder
├── go.mod
├── go.sum
├── Dockerfile
├── render.yaml                      # Render deployment config
└── .env.example
```

---

#### Database Schema

```sql
-- 001_initial_schema.sql

-- Profile (single row, singleton)
CREATE TABLE profile (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    major       VARCHAR(255),
    university  VARCHAR(255),
    location    VARCHAR(255),
    status      TEXT,
    email       VARCHAR(255),
    phone       VARCHAR(50),
    github      VARCHAR(500),
    linkedin    VARCHAR(500),
    gpa         VARCHAR(50),
    short_bio   TEXT,
    resume_url  VARCHAR(500),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(500) NOT NULL,
    subtitle         VARCHAR(500),
    year             VARCHAR(10),
    description      TEXT,
    full_description TEXT,
    tech             TEXT[],
    image_url        VARCHAR(500),
    link             VARCHAR(500),
    display_order    INT DEFAULT 0,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_metrics (
    id         SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    value      VARCHAR(100) NOT NULL,
    label      VARCHAR(100) NOT NULL
);

-- Experiences
CREATE TABLE experiences (
    id              SERIAL PRIMARY KEY,
    year            VARCHAR(50),
    title           VARCHAR(500) NOT NULL,
    organization    VARCHAR(500),
    description     TEXT,
    tags            TEXT[],
    logo_url        VARCHAR(500),
    logo_color      VARCHAR(20),
    display_order   INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Skill Categories
CREATE TABLE skill_categories (
    id            SERIAL PRIMARY KEY,
    category      VARCHAR(100) NOT NULL,
    items         TEXT[],
    display_order INT DEFAULT 0
);

-- Education (single row, singleton)
CREATE TABLE education (
    id                   SERIAL PRIMARY KEY,
    degree               VARCHAR(500),
    institution          VARCHAR(500),
    period               VARCHAR(100),
    gpa                  VARCHAR(50),
    credits              VARCHAR(50),
    relevant_courseworks TEXT[],
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications
CREATE TABLE certifications (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(500) NOT NULL,
    issuer        VARCHAR(255),
    date          VARCHAR(50),
    link          VARCHAR(500),
    display_order INT DEFAULT 0
);

-- Awards
CREATE TABLE awards (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(500) NOT NULL,
    year          VARCHAR(10),
    description   TEXT,
    tag           VARCHAR(100),
    display_order INT DEFAULT 0
);

-- Admin sessions (for GitHub OAuth)
CREATE TABLE admin_sessions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_id     BIGINT NOT NULL,
    github_login  VARCHAR(255) NOT NULL,
    access_token  TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    expires_at    TIMESTAMPTZ NOT NULL
);
```

---

#### Authentication Flow (GitHub OAuth)

```mermaid
sequenceDiagram
    participant CMS as CMS Frontend
    participant API as Go Backend
    participant GH as GitHub OAuth

    CMS->>API: GET /api/auth/github
    API->>CMS: Redirect to GitHub authorize URL
    CMS->>GH: User authorizes app
    GH->>API: GET /api/auth/github/callback?code=xxx
    API->>GH: Exchange code for access token
    GH->>API: Return access token + user info
    API->>API: Verify github_id matches ADMIN_GITHUB_ID env
    API->>CMS: Set JWT cookie + redirect to CMS dashboard
```

> [!IMPORTANT]
> Hanya GitHub user ID yang cocok dengan env `ADMIN_GITHUB_ID` yang diizinkan login. Ini memastikan single admin access.

---

#### Image Upload Flow (Cloudinary Presigned URL)

```mermaid
sequenceDiagram
    participant CMS as CMS Frontend
    participant API as Go Backend
    participant CLD as Cloudinary

    CMS->>API: POST /api/upload/signature (authenticated)
    API->>API: Generate Cloudinary signature + timestamp
    API->>CMS: Return {signature, timestamp, api_key, cloud_name}
    CMS->>CLD: Upload file directly with signature
    CLD->>CMS: Return {secure_url, public_id}
    CMS->>API: PUT /api/projects/:id {image_url: secure_url}
    API->>API: Save URL to database
```

> [!TIP]
> Frontend upload langsung ke Cloudinary, backend tidak handle file upload sehingga menghemat bandwidth dan memori server Render free tier.

---

#### API Endpoints

**Public (No Auth)**

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/profile` | Get profile data |
| `GET` | `/api/projects` | List all projects (ordered by display_order) |
| `GET` | `/api/experiences` | List all experiences |
| `GET` | `/api/skills` | List all skill categories |
| `GET` | `/api/education` | Get education + certifications + awards |
| `GET` | `/api/certifications` | List certifications |
| `GET` | `/api/awards` | List awards |

**Auth Endpoints**

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/auth/github` | Initiate GitHub OAuth |
| `GET` | `/api/auth/github/callback` | OAuth callback |
| `GET` | `/api/auth/me` | Get current admin info |
| `POST` | `/api/auth/logout` | Logout (invalidate session) |

**Admin Protected (JWT Required)**

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `PUT` | `/api/profile` | Update profile |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |
| `POST` | `/api/experiences` | Create experience |
| `PUT` | `/api/experiences/:id` | Update experience |
| `DELETE` | `/api/experiences/:id` | Delete experience |
| `POST` | `/api/skills` | Create skill category |
| `PUT` | `/api/skills/:id` | Update skill category |
| `DELETE` | `/api/skills/:id` | Delete skill category |
| `PUT` | `/api/education` | Update education |
| `POST` | `/api/certifications` | Create certification |
| `PUT` | `/api/certifications/:id` | Update certification |
| `DELETE` | `/api/certifications/:id` | Delete certification |
| `POST` | `/api/awards` | Create award |
| `PUT` | `/api/awards/:id` | Update award |
| `DELETE` | `/api/awards/:id` | Delete award |
| `POST` | `/api/upload/signature` | Get Cloudinary upload signature |

---

#### Go Dependencies

```
github.com/go-chi/chi/v5          # HTTP router
github.com/go-chi/cors             # CORS middleware
github.com/jackc/pgx/v5            # PostgreSQL driver (fast, pure Go)
github.com/golang-jwt/jwt/v5       # JWT token handling
github.com/joho/godotenv            # .env file loader
golang.org/x/oauth2                 # OAuth2 client (GitHub)
```

---

#### Seed Data

Seeder (`seed.go`) akan memigrasikan data hardcoded dari file TypeScript ke database:
- [`profile.ts`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/data/profile.ts) → `profile` table
- [`projects.ts`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/data/projects.ts) → `projects` + `project_metrics` tables
- [`experience.ts`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/data/experience.ts) → `experiences` table
- [`skills.ts`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/data/skills.ts) → `skill_categories` table
- [`profile.ts`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/data/profile.ts) (education section) → `education` + `certifications` + `awards` tables

---

#### Environment Variables

```bash
# .env.example
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
PORT=8080

# GitHub OAuth
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GITHUB_REDIRECT_URL=http://localhost:8080/api/auth/github/callback
ADMIN_GITHUB_ID=12345678

# JWT
JWT_SECRET=your-random-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# CMS redirect after login
CMS_URL=http://localhost:5174
```

---

### Tahap 2: Web CMS — *Setelah backend selesai*

Folder terpisah `portfolio/cms/` dengan Vite + React + TypeScript. Deployable ke `admin.amudipurba.com` via Vercel.

**Fitur yang akan dibangun:**
- GitHub OAuth login
- Dashboard overview (stats)
- CRUD pages untuk semua entitas
- Image upload via Cloudinary (presigned URL flow)
- Drag-and-drop reordering
- Responsive admin layout

---

### Tahap 3: Frontend Refactor — *Setelah CMS selesai*

Refactor portfolio frontend untuk fetch dari API dengan fallback ke hardcoded data:

| Komponen | Data Source |
|----------|------------|
| [`Hero.tsx`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/components/sections/Hero.tsx) | `/api/profile` |
| [`About.tsx`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/components/sections/About.tsx) | `/api/profile` + `/api/skills` |
| [`Projects.tsx`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/components/sections/Projects.tsx) | `/api/projects` |
| [`Experience.tsx`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/components/sections/Experience.tsx) | `/api/experiences` |
| [`Education.tsx`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/components/sections/Education.tsx) | `/api/education` |
| [`Skills.tsx`](file:///c:/Users/asus/PROYEK/Portfolio/portfolio/src/components/sections/Skills.tsx) | `/api/skills` |

---

## Verification Plan

### Automated Tests
```bash
cd backend && go test ./...
```
- Unit tests untuk setiap handler (mock database)
- Integration tests untuk database layer
- Auth flow tests (mock GitHub OAuth)

### Manual Verification
- Test semua CRUD endpoints via `curl` atau Postman
- Verify GitHub OAuth flow end-to-end
- Verify Cloudinary presigned URL generation
- Seed data → compare API output vs hardcoded data
- Test CORS dengan frontend development server

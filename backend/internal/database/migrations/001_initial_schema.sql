-- 001_initial_schema.sql
-- Portfolio Backend Database Schema

-- Profile (singleton row)
CREATE TABLE IF NOT EXISTS profile (
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
CREATE TABLE IF NOT EXISTS projects (
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

CREATE TABLE IF NOT EXISTS project_metrics (
    id         SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    value      VARCHAR(100) NOT NULL,
    label      VARCHAR(100) NOT NULL
);

-- Experiences
CREATE TABLE IF NOT EXISTS experiences (
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
CREATE TABLE IF NOT EXISTS skill_categories (
    id            SERIAL PRIMARY KEY,
    category      VARCHAR(100) NOT NULL,
    items         TEXT[],
    display_order INT DEFAULT 0
);

-- Education (singleton row)
CREATE TABLE IF NOT EXISTS education (
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
CREATE TABLE IF NOT EXISTS certifications (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(500) NOT NULL,
    issuer        VARCHAR(255),
    date          VARCHAR(50),
    link          VARCHAR(500),
    display_order INT DEFAULT 0
);

-- Awards
CREATE TABLE IF NOT EXISTS awards (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(500) NOT NULL,
    year          VARCHAR(10),
    description   TEXT,
    tag           VARCHAR(100),
    display_order INT DEFAULT 0
);

-- Admin sessions (for GitHub OAuth)
CREATE TABLE IF NOT EXISTS admin_sessions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_id     BIGINT NOT NULL,
    github_login  VARCHAR(255) NOT NULL,
    access_token  TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    expires_at    TIMESTAMPTZ NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_experiences_display_order ON experiences(display_order);
CREATE INDEX IF NOT EXISTS idx_skill_categories_display_order ON skill_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_certifications_display_order ON certifications(display_order);
CREATE INDEX IF NOT EXISTS idx_awards_display_order ON awards(display_order);
CREATE INDEX IF NOT EXISTS idx_project_metrics_project_id ON project_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

/**
 * Shapes returned by the Go backend (`GET /api/site`).
 * They mirror `backend/internal/models/models.go` and must stay in sync with it.
 */

export interface ApiProfile {
  id: number;
  name: string;
  major: string;
  university: string;
  location: string;
  status: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  gpa: string;
  shortBio: string;
  resume?: string;
  mediaId?: number;
  resumeMediaId?: number;
}

export interface ApiProjectMetric {
  id: number;
  projectId: number;
  value: string;
  label: string;
}

export interface ApiProject {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  fullDescription?: string;
  tech: string[];
  image?: string;
  link?: string;
  objectPosition: string;
  mediaId?: number;
  metrics: ApiProjectMetric[];
  displayOrder: number;
}

export interface ApiActivity {
  id: number;
  category: string;
  tag?: string;
  title: string;
  description?: string;
  date?: string;
  image?: string;
  mediaId?: number;
  width?: number;
  height?: number;
  displayOrder: number;
}

export interface ApiOrganization {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  mediaId?: number;
  x: number;
  y: number;
  size: number;
  rotate: number;
  tooltipPlacement?: string;
  displayOrder: number;
}

export interface ApiExperience {
  id: number;
  year: string;
  title: string;
  organization: string;
  organizationId?: string;
  description: string;
  tags: string[];
  logoImagePath?: string;
  logoColor?: string;
  mediaId?: number;
  startYear?: number;
  startMonth?: number;
  endYear?: number;
  endMonth?: number;
  isOngoing: boolean;
  displayOrder: number;
}

export interface ApiSkillCategory {
  id: number;
  category: string;
  items: string[];
  icon?: string;
  mediaId?: number;
  displayOrder: number;
}

export interface ApiEducation {
  id: number;
  degree: string;
  institution: string;
  period: string;
  gpa: string;
  credits: string;
  relevantCourseworks: string[];
}

export interface ApiCertification {
  id: number;
  title: string;
  issuer?: string;
  date: string;
  link?: string;
  image?: string;
  mediaId?: number;
  displayOrder: number;
}

export interface ApiAward {
  id: number;
  title: string;
  year: string;
  description?: string;
  tag?: string;
  image?: string;
  mediaId?: number;
  displayOrder: number;
}

export interface ApiSectionAsset {
  section: string;
  slot: string;
  mediaId?: number;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  meta: Record<string, unknown>;
  updatedAt: string;
}

export interface ApiHeroSettings {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  scrollHint: string;
}

export interface ApiAboutStat {
  label: string;
  value: string;
  subtext: string;
}

export interface ApiAboutSettings {
  heading: string;
  subheading: string;
  feedLabel: string;
  galleryTitle: string;
  stats: ApiAboutStat[];
}

export interface ApiContactSettings {
  heading: string;
  bigText: string;
  paragraph: string;
  ctaLabel: string;
  cardCaption: string;
  cardSubtitle: string;
  flipHint: string;
  qrLabel: string;
  qrSubtitle: string;
}

export interface ApiNavLink {
  name: string;
  href: string;
}

export interface ApiNavbarSettings {
  links: ApiNavLink[];
}

export interface ApiFooterSettings {
  text: string;
}

export interface ApiSiteContent {
  profile: ApiProfile;
  hero: ApiHeroSettings;
  about: ApiAboutSettings;
  contact: ApiContactSettings;
  navbar: ApiNavbarSettings;
  footer: ApiFooterSettings;
  sectionAssets: ApiSectionAsset[];
  projects: ApiProject[];
  activities: ApiActivity[];
  organizations: ApiOrganization[];
  experiences: ApiExperience[];
  skills: ApiSkillCategory[];
  education: ApiEducation;
  certifications: ApiCertification[];
  awards: ApiAward[];
}

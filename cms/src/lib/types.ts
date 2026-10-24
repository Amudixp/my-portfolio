// Types mirror the JSON contract of the Go backend (backend/internal/models).

export interface Profile {
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
  resume?: string | null;
  mediaId?: number | null;
  resumeMediaId?: number | null;
  updatedAt: string;
}

export interface ProjectMetric {
  id?: number;
  projectId?: number;
  value: string;
  label: string;
}

export interface Project {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  fullDescription?: string | null;
  tech: string[];
  image?: string | null;
  link?: string | null;
  objectPosition: string;
  mediaId?: number | null;
  metrics: ProjectMetric[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: number;
  year: string;
  title: string;
  organization: string;
  organizationId?: string | null;
  description: string;
  tags: string[];
  logoImagePath?: string | null;
  logoColor?: string | null;
  mediaId?: number | null;
  startYear?: number | null;
  startMonth?: number | null;
  endYear?: number | null;
  endMonth?: number | null;
  isOngoing: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  shortName?: string | null;
  logo?: string | null;
  mediaId?: number | null;
  x: number;
  y: number;
  size: number;
  rotate: number;
  tooltipPlacement?: string | null;
  displayOrder: number;
}

export interface Activity {
  id: number;
  category: string;
  tag?: string | null;
  title: string;
  description?: string | null;
  date?: string | null;
  image?: string | null;
  mediaId?: number | null;
  width?: number | null;
  height?: number | null;
  displayOrder: number;
}

export interface SkillCategory {
  id: number;
  category: string;
  items: string[];
  icon?: string | null;
  mediaId?: number | null;
  displayOrder: number;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  gpa: string;
  credits: string;
  relevantCourseworks: string[];
  updatedAt: string;
}

export interface Certification {
  id: number;
  title: string;
  issuer?: string | null;
  date: string;
  link?: string | null;
  image?: string | null;
  mediaId?: number | null;
  displayOrder: number;
}

export interface Award {
  id: number;
  title: string;
  year: string;
  description?: string | null;
  tag?: string | null;
  image?: string | null;
  mediaId?: number | null;
  displayOrder: number;
}

export interface MediaUsage {
  type: string;
  label: string;
  refId: string;
}

export interface Media {
  id: number;
  publicId: string;
  url: string;
  filename?: string | null;
  mimeType?: string | null;
  bytes?: number | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  folder?: string | null;
  createdAt: string;
  usage: MediaUsage[];
}

export interface SectionAsset {
  section: string;
  slot: string;
  mediaId?: number | null;
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  meta: Record<string, unknown>;
  updatedAt: string;
}

export interface AboutStat {
  label: string;
  value: string;
  subtext: string;
}

export interface HeroSettings {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  scrollHint: string;
}

export interface AboutSettings {
  heading: string;
  subheading: string;
  feedLabel: string;
  galleryTitle: string;
  stats: AboutStat[];
}

export interface ContactSettings {
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

export interface NavLink {
  name: string;
  href: string;
}

export interface NavbarSettings {
  links: NavLink[];
}

export interface FooterSettings {
  text: string;
}

export interface SiteSettings {
  hero: HeroSettings;
  about: AboutSettings;
  contact: ContactSettings;
  navbar: NavbarSettings;
  footer: FooterSettings;
  updatedAt: string;
}

export interface AdminUser {
  githubLogin: string;
  avatarUrl?: string | null;
}

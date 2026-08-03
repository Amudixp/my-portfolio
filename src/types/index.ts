export interface ProfileData {
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
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ProjectData {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  fullDescription?: string;
  tech: string[];
  image?: string;
  link?: string;
  metrics: { value: string; label: string }[];
}

export interface ExperienceData {
  id: number;
  year: string;
  title: string;
  organization: string;
  description: string;
  tags: string[];
  logoImagePath?: string;
  logoColor?: string;
}

export interface CertificationData {
  id: string | number;
  title: string;
  issuer?: string;
  date: string;
  link?: string;
}

export interface AwardData {
  id: number;
  title: string;
  year: string;
  description?: string;
  tag?: string;
}

export interface EducationData {
  degree: string;
  institution: string;
  period: string;
  gpa: string;
  credits: string;
  relevantCourseworks: string[];
  certifications: CertificationData[];
  awards: AwardData[];
}

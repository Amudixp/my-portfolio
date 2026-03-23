export interface ProfileData {
  name: string;
  major: string;
  university: string;
  location: string;
  status: string;
  email: string;
  github: string;
  linkedin: string;
  gpa: string;
  shortBio: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ProjectData {
  id: number;
  title: string;
  year: string;
  description: string;
  tech: string[];
  link?: string;
}

export interface ExperienceData {
  id: number;
  role: string;
  organization: string;
  period: string;
}

export interface CertificationData {
  id: number;
  name: string;
  date: string;
}

export interface EducationData {
  degree: string;
  institution: string;
  period: string;
  gpa: string;
  certifications: CertificationData[];
}
import tecLogo from '../assets/images/tec_logo.webp';
import itbLogo from '../assets/images/itb_logo.webp';
import akhdaniLogo from '../assets/images/akhdani_logo.webp';
import agungSedayuLogo from '../assets/images/agungsedayu_logo.webp';
import hmifLogo from '../assets/images/hmif_logo.webp';
// Placeholder text mark — replace with the official GenBI logo when available.
import genbiLogo from '../assets/images/genbi_logo.webp';
import type { ExperienceData, OrganizationData } from '../types';

// Desktop cluster layout: x/y are pixel offsets from the cluster center
// (design space), size is the square box in px, rotate is the tilt in degrees.
export const organizations: OrganizationData[] = [
  {
    id: 'agungsedayu',
    name: 'PT Agung Sedayu Group',
    shortName: 'Agung Sedayu Group',
    logo: agungSedayuLogo,
    x: 60,
    y: -76,
    size: 68,
    rotate: 3
  },
  {
    id: 'akhdani',
    name: 'PT Akhdani Reka Solusi',
    shortName: 'PT Akhdani Reka Solusi',
    logo: akhdaniLogo,
    x: -30,
    y: 58,
    size: 66,
    rotate: -2
  },
  {
    id: 'itb',
    name: 'Institut Teknologi Bandung (ITB)',
    shortName: 'Institut Teknologi Bandung',
    logo: itbLogo,
    x: -40,
    y: -34,
    size: 100,
    rotate: -5
  },
  {
    id: 'tec',
    name: 'Techno Entrepreneurship Club ITB',
    shortName: 'Techno Entrepreneurship Club',
    logo: tecLogo,
    x: 54,
    y: 14,
    size: 78,
    rotate: 4
  },
  {
    id: 'hmif',
    name: 'Himpunan Mahasiswa Informatika ITB',
    shortName: 'HMIF ITB',
    logo: hmifLogo,
    x: 46,
    y: 96,
    size: 62,
    rotate: -3
  },
  {
    id: 'genbi',
    name: 'GenBI ITB',
    shortName: 'GenBI ITB',
    logo: genbiLogo,
    x: -118,
    y: 52,
    size: 58,
    rotate: 3
  }
];

// Desktop places each card by its index in this array (see CARD_LAYOUT in
// Experience.tsx); mobile sorts by date.
export const experiences: ExperienceData[] = [
  {
    id: 7,
    year: 'Oct 2026 – Present',
    title: 'IT Product',
    organization: 'PT Agung Sedayu Group Jakarta, Indonesia',
    organizationId: 'agungsedayu',
    startDate: { year: 2026, month: 10 },
    endDate: null,
    description: 'Translated business needs from stakeholders into product requirements, user stories, and acceptance criteria for an internal system to guide development priorities. Coordinated with developers and business users to track feature progress, manage the product backlog, and support UAT before release.',
    tags: ['Product Requirements', 'User Stories', 'Backlog Management', 'UAT']
  },
  {
    id: 1,
    year: 'June 2026 – Aug 2026',
    title: 'Quality Assurance',
    organization: 'PT Akhdani Reka Solusi Bandung, Indonesia',
    organizationId: 'akhdani',
    startDate: { year: 2026, month: 6 },
    endDate: { year: 2026, month: 8 },
    description: 'Validated application functionality against business requirements by developing and executing 140+ automated test cases (85 web, 55 mobile), ensuring product behavior aligned with stakeholder expectations before release. Collaborated with the development team to prioritize and resolve 60+ identified defects based on business impact, strengthening cross-functional communication between QA and engineering.',
    tags: ['Quality Assurance', 'Test Automation', 'Defect Tracking', 'Requirements Validation']
  },
  {
    id: 2,
    year: 'Sept 2025 – Present',
    title: 'Computational Thinking Lab Assistant',
    organization: 'Institut Teknologi Bandung (ITB)',
    organizationId: 'itb',
    startDate: { year: 2025, month: 9 },
    endDate: null,
    description: 'Evaluating the programming assignments of 20 students and providing structured feedback on computational thinking concepts, thereby supporting improved learning outcomes for the course cohort.',
    tags: ['Python', 'Computational Thinking', 'Code Evaluation', 'Mentoring']
  },
  {
    id: 3,
    year: 'July 2025 – Aug 2025',
    title: 'Data Migration Staff',
    organization: 'ITB Education Directorate',
    organizationId: 'itb',
    startDate: { year: 2025, month: 7 },
    endDate: { year: 2025, month: 8 },
    description: 'Executed data migration workflows and validated dataset integrity for academic administrative systems. Evaluated practical code execution and data processing scripts.',
    tags: ['Data Migration', 'Python', 'Data Integrity', 'System Administration']
  },
  {
    id: 4,
    year: 'Sept 2024 – Nov 2024',
    title: 'Basic Physics Lab Assistant',
    organization: 'ITB 2024, LFD ITB',
    organizationId: 'itb',
    startDate: { year: 2024, month: 9 },
    endDate: { year: 2024, month: 11 },
    description: 'Improved report quality and student comprehension through structured evaluation and feedback mechanisms. Enhanced laboratory learning effectiveness by guiding students through experimental procedures and scientific reasoning.',
    tags: ['Physics', 'Academic Mentoring', 'Scientific Reasoning', 'Evaluation']
  },
  {
    id: 5,
    year: 'May 2025 – Dec 2025',
    title: 'IT TECFest 2025 Staff',
    organization: 'Techno Entrepreneurship Club ITB',
    organizationId: 'tec',
    startDate: { year: 2025, month: 5 },
    endDate: { year: 2025, month: 12 },
    description: 'Managed technical operations and event execution for TECFest 2025. Ensured smooth digital infrastructure and participant evaluation workflows during the flagship event.',
    tags: ['Event Technology', 'Operational Coordination', 'Techno Entrepreneurship']
  },
  {
    id: 6,
    year: 'Dec 2024 – Present',
    title: 'Board of Director',
    organization: 'Techno Entrepreneurship Club ITB',
    organizationId: 'tec',
    startDate: { year: 2024, month: 12 },
    endDate: null,
    description: 'Led governance structuring initiatives to ensure organizational sustainability and alignment with long-term strategic goals. Improved cross-division coordination efficiency, enabling smoother execution of club initiatives.',
    tags: ['Governance', 'Organizational Leadership', 'Strategic Planning', 'Management']
  },
  {
    id: 8,
    year: 'June 2026 – Present',
    title: 'Vice President',
    organization: 'GenBI ITB 2026',
    organizationId: 'genbi',
    startDate: { year: 2026, month: 6 },
    endDate: null,
    description: 'Directed 6 internal engagement programs, achieving over 80% member participation per program through structured planning and execution.',
    tags: ['Leadership', 'Program Management', 'Member Engagement']
  },
  {
    id: 9,
    year: 'Jan 2026 – Present',
    title: 'Head of Intracampus Division',
    organization: 'Himpunan Mahasiswa Informatika ITB',
    organizationId: 'hmif',
    startDate: { year: 2026, month: 1 },
    endDate: null,
    description: 'Standardized evaluation workflows across programs, improving execution consistency and reducing operational misalignment.',
    tags: ['Leadership', 'Process Standardization', 'Program Evaluation']
  }
];

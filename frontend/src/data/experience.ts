import tecLogo from '../assets/images/tec_logo.webp';
import itbLogo from '../assets/images/itb_logo.webp';
import akhdaniLogo from '../assets/images/akhdani_logo.webp';
import type { ExperienceData, OrganizationData } from '../types';

export const organizations: OrganizationData[] = [
  {
    id: 'akhdani',
    name: 'PT Akhdani Reka Solusi',
    shortName: 'PT Akhdani Reka Solusi',
    logo: akhdaniLogo,
    x: 30,
    y: 64,
    size: 68
  },
  {
    id: 'itb',
    name: 'Institut Teknologi Bandung (ITB)',
    shortName: 'Institut Teknologi Bandung',
    logo: itbLogo,
    x: 50,
    y: 30,
    size: 96
  },
  {
    id: 'tec',
    name: 'Techno Entrepreneurship Club ITB',
    shortName: 'Techno Entrepreneurship Club',
    logo: tecLogo,
    x: 70,
    y: 64,
    size: 76
  }
];

export const experiences: ExperienceData[] = [
  {
    id: 1,
    year: 'June 2026 – Aug 2026',
    title: 'Quality Assurance',
    organization: 'PT Akhdani Reka Solusi Bandung, Indonesia',
    organizationId: 'akhdani',
    description: 'Identified and documented 40+ software defects across the testing lifecycle, reducing production bug risk and contributing to a stable pre-release product. Validated that features met business requirements and quality standards before release.',
    tags: ['Quality Assurance', 'Software Testing', 'Defect Tracking', 'Requirements Validation']
  },
  {
    id: 2,
    year: 'Sept 2025 – Dec 2025',
    title: 'Computational Thinking Lab Assistant',
    organization: 'Institut Teknologi Bandung (ITB)',
    organizationId: 'itb',
    description: 'Evaluated Python programming assignments and provided feedback on computational thinking concepts. Evaluated the code of practical results and supervised practical experimental demonstrations.',
    tags: ['Python', 'Computational Thinking', 'Code Evaluation', 'Mentoring']
  },
  {
    id: 3,
    year: 'July 2025 – Aug 2025',
    title: 'Data Migration Staff',
    organization: 'ITB Education Directorate',
    organizationId: 'itb',
    description: 'Executed data migration workflows and validated dataset integrity for academic administrative systems. Evaluated practical code execution and data processing scripts.',
    tags: ['Data Migration', 'Python', 'Data Integrity', 'System Administration']
  },
  {
    id: 4,
    year: 'Sept 2024 – Nov 2024',
    title: 'Basic Physics Lab Assistant',
    organization: 'ITB 2024, LFD ITB',
    organizationId: 'itb',
    description: 'Improved report quality and student comprehension through structured evaluation and feedback mechanisms. Enhanced laboratory learning effectiveness by guiding students through experimental procedures and scientific reasoning.',
    tags: ['Physics', 'Academic Mentoring', 'Scientific Reasoning', 'Evaluation']
  },
  {
    id: 5,
    year: 'May 2025 – Dec 2025',
    title: 'IT TECFest 2025 Staff',
    organization: 'Techno Entrepreneurship Club ITB',
    organizationId: 'tec',
    description: 'Managed technical operations and event execution for TECFest 2025. Ensured smooth digital infrastructure and participant evaluation workflows during the flagship event.',
    tags: ['Event Technology', 'Operational Coordination', 'Techno Entrepreneurship']
  },
  {
    id: 6,
    year: 'Dec 2024 – Present',
    title: 'Board of Director',
    organization: 'Techno Entrepreneurship Club ITB',
    organizationId: 'tec',
    description: 'Led governance structuring initiatives to ensure organizational sustainability and alignment with long-term strategic goals. Improved cross-division coordination efficiency, enabling smoother execution of club initiatives.',
    tags: ['Governance', 'Organizational Leadership', 'Strategic Planning', 'Management']
  }
];

import tecLogo from '../assets/images/tec_logo.jpeg';
import itbLogo from '../assets/images/itb_logo.jpeg';
import akhdaniLogo from '../assets/images/akhdani_logo.png';
import type { ExperienceData } from '../types';

export const experiences: ExperienceData[] = [
  {
    id: 1,
    year: 'June 2026 – Aug 2026',
    title: 'Quality Assurance',
    organization: 'PT Akhdani Reka Solusi — Bandung, Indonesia',
    description: 'Identified and documented 40+ software defects across the testing lifecycle, reducing production bug risk and contributing to a stable pre-release product. Validated that features met business requirements and quality standards before release.',
    tags: ['Quality Assurance', 'Software Testing', 'Defect Tracking', 'Requirements Validation'],
    logoImagePath: akhdaniLogo,
    logoColor: '#eab308'
  },
  {
    id: 2,
    year: 'Sept 2025 – Dec 2025',
    title: 'Computational Thinking Lab Assistant',
    organization: 'Institut Teknologi Bandung (ITB)',
    description: 'Evaluated Python programming assignments and provided feedback on computational thinking concepts. Evaluated the code of practical results and supervised practical experimental demonstrations.',
    tags: ['Python', 'Computational Thinking', 'Code Evaluation', 'Mentoring'],
    logoImagePath: itbLogo,
    logoColor: '#60a5fa'
  },
  {
    id: 3,
    year: 'July 2025 – Aug 2025',
    title: 'Data Migration Staff',
    organization: 'ITB Education Directorate',
    description: 'Executed data migration workflows and validated dataset integrity for academic administrative systems. Evaluated practical code execution and data processing scripts.',
    tags: ['Data Migration', 'Python', 'Data Integrity', 'System Administration'],
    logoImagePath: itbLogo,
    logoColor: '#34d399'
  },
  {
    id: 4,
    year: 'Sept 2024 – Nov 2024',
    title: 'Basic Physics Lab Assistant',
    organization: 'ITB 2024, LFD ITB',
    description: 'Improved report quality and student comprehension through structured evaluation and feedback mechanisms. Enhanced laboratory learning effectiveness by guiding students through experimental procedures and scientific reasoning.',
    tags: ['Physics', 'Academic Mentoring', 'Scientific Reasoning', 'Evaluation'],
    logoImagePath: itbLogo,
    logoColor: '#a78bfa'
  },
  {
    id: 5,
    year: 'May 2025 – Dec 2025',
    title: 'IT TECFest 2025 Staff',
    organization: 'Techno Entrepreneurship Club ITB',
    description: 'Managed technical operations and event execution for TECFest 2025. Ensured smooth digital infrastructure and participant evaluation workflows during the flagship event.',
    tags: ['Event Technology', 'Operational Coordination', 'Techno Entrepreneurship'],
    logoImagePath: tecLogo,
    logoColor: '#f43f5e'
  },
  {
    id: 6,
    year: 'Dec 2024 – Present',
    title: 'Board of Director',
    organization: 'Techno Entrepreneurship Club ITB',
    description: 'Led governance structuring initiatives to ensure organizational sustainability and alignment with long-term strategic goals. Improved cross-division coordination efficiency, enabling smoother execution of club initiatives.',
    tags: ['Governance', 'Organizational Leadership', 'Strategic Planning', 'Management'],
    logoImagePath: tecLogo,
    logoColor: '#fbbf24'
  }
];

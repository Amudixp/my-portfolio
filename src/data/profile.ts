import type { ProfileData, EducationData } from '../types';

export const profile: ProfileData = {
  name: "Amudi Purba",
  major: "Information Systems & Technology",
  university: "Institut Teknologi Bandung",
  location: "Bandung, Indonesia",
  status: "Undergraduate Student — Information System & Technology",
  email: "amudipurba12@gmail.com",
  phone: "+62-821-1557-5545",
  github: "https://github.com/Amudixp",
  linkedin: "https://www.linkedin.com/in/amudipurba",
  gpa: "3.64 / 4.00 (128 credits)",
  shortBio: "Third-year Information Systems & Technology student at Institut Teknologi Bandung with a focused interest in data and artificial intelligence. Possesses a well-rounded foundation built through academic coursework in technical domains and organizational experience that has sharpened collaboration, leadership, and accountability skills. Understands the full lifecycle of building a product from the ground up, from ideation to execution, and applies that systems thinking to approach data-driven problems in a structured way. Known as a fast learner who adapts quickly to new environments and tools, with a genuine curiosity to explore and understand how things work. Eager to contribute to a team where technical depth and interpersonal skills are equally valued.",
  resume: "/assets/Amudi Purba_CV.pdf"
};

export const education: EducationData = {
  degree: "Undergraduate Student of Information System and Technology",
  institution: "Institut Teknologi Bandung",
  period: "Aug 2023 – Aug 2027 (Expected)",
  gpa: "3.64 / 4.00",
  credits: "128 credits",
  relevantCourseworks: [
    "Database Modelling",
    "Database Management",
    "Foundation of Artificial Intelligence",
    "Artificial Intelligence for Business",
    "Web and Mobile Application Development",
    "Enterprise Requirements Analysis",
    "Enterprise Analysis"
  ],
  awards: [
    {
      id: 1,
      title: "[National] Top 15 Finalist of Hackathon by SIMKOPDES",
      year: "2026",
      description: "Developed KopHabit, a digital transformation platform for Koperasi Desa Merah Putih driving grassroots community participation through OCR-based bookkeeping and accessible financial transparency.",
      tag: "National Hackathon"
    },
    {
      id: 2,
      title: "[National] Bank Indonesia Scholarship Awardee",
      year: "2026",
      description: "Awarded the prestigious Bank Indonesia Scholarship in recognition of academic excellence, leadership potential, and commitment to technological innovation.",
      tag: "National Scholarship"
    }
  ],
  certifications: [
    {
      id: '01',
      title: 'Foundation of Machine Learning',
      issuer: 'DICODING',
      date: 'March 2026',
      link: 'https://www.dicoding.com/certificates/JLX1VL93NZ72'
    },
    {
      id: '02',
      title: 'Introduction to SQL',
      issuer: 'DICODING',
      date: 'March 2026',
      link: 'https://www.dicoding.com/certificates/KEXLQ036WPG2'
    },
    {
      id: '03',
      title: 'Introduction of Data Science',
      issuer: 'DICODING',
      date: 'March 2026',
      link: 'https://www.dicoding.com/certificates/6RPN7W829X2M'
    },
    {
      id: '04',
      title: 'Foundation of Artificial Intelligence',
      issuer: 'DICODING',
      date: 'Feb 2026',
      link: 'https://www.dicoding.com/certificates/0LZ0Y1YRNX65'
    },
    {
      id: '05',
      title: 'Start Code with Python',
      issuer: 'DICODING',
      date: 'Feb 2026',
      link: 'https://www.dicoding.com/certificates/07Z67R73JPQR'
    },
    {
      id: '06',
      title: 'Generative AI Certified by Microsoft',
      issuer: 'MICROSOFT',
      date: 'July 2024',
      link: 'https://www.linkedin.com/learning/certificates/6f19bd14f4b9c69179db72c1978a25e8a193200d743b8961f800e79da111e4b6?trk=share_certificate'
    }
  ]
};
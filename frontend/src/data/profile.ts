import type { ProfileData, EducationData } from '../types';

export const profile: ProfileData = {
  name: "Amudi Purba",
  major: "Information Systems & Technology",
  university: "Institut Teknologi Bandung",
  location: "Bandung, Indonesia",
  status: "Final-Year Student @ Information System & Technology",
  email: "amudipurba12@gmail.com",
  phone: "+62-821-1557-5545",
  github: "https://github.com/Amudixp",
  linkedin: "https://www.linkedin.com/in/amudipurba",
  gpa: "3.64 / 4.00 (128 credits)",
  shortBio: "Final-year Information Systems and Technology undergraduate at Institut Teknologi Bandung with hands-on experience in SQL, Python, and descriptive and statistical analysis. Experienced in modeling relational databases, auditing data quality, and turning analysis into decision-ready findings, supported by industry experience translating business requirements between stakeholders and engineering teams.",
  // /assets/* is served as immutable (vercel.json); bump ?v= whenever the PDF is replaced.
  resume: "/assets/Amudi Purba_CV.pdf?v=2026-11-22"
};

export const education: EducationData = {
  degree: "Undergraduate Student of Information System and Technology",
  institution: "Institut Teknologi Bandung",
  period: "Aug 2023 – Aug 2027 (Expected)",
  gpa: "3.64 / 4.00",
  credits: "128 credits",
  relevantCourseworks: [
    "Data Analytics",
    "Database Modelling",
    "Probability and Statistics",
    "Enterprise Architecture",
    "Information Systems and Technology Engineering",
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
      description: "Led product strategy for Rekop, a digital transparency platform for village cooperatives that closes trust, access, and voice gaps between cooperative managers and communities through OCR automation, public dashboards, and an AI chatbot.",
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
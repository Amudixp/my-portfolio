import apiIntegratedImg from '../assets/images/api-integrated.png';
import oopJavaImg from '../assets/images/oop-java.png';
import crossPlatformImg from '../assets/images/cross-platform.png';
import uiUxImg from '../assets/images/ui-ux.png';
import databaseImg from '../assets/images/Screenshot 2026-03-23 124619.png';
import kjppDashboardImg from '../assets/images/kjpp-dashboard.png';
import cvScreeningImg from '../assets/images/cv-screening.png';
import enterpriseArchImg from '../assets/images/enterprise-architecture.png';
import sparkParkingImg from '../assets/images/spark-parking.png';
import simkopdesRekopImg from '../assets/images/simkopdes-rekop.png';
import fraudAnalysisImg from '../assets/images/fraud-analysis.png';
import type { ProjectData } from '../types';

export const projects: ProjectData[] = [
  {
    id: 1,
    title: "Freelance: KJPP Consultant Ecosystem Application",
    subtitle: "INTERNAL ECOSYSTEM & WORKFLOW AUTOMATION",
    year: "2026",
    description: "Centralized internal ecosystem application for KJPP Hari Utomo to streamline operations and unify communication workflows.",
    fullDescription: "Developed a centralized internal ecosystem application for KJPP Hari Utomo aimed at improving operational coordination and reducing dependency on fragmented communication platforms such as WhatsApp, improving process centralization and organizational efficiency through more structured digital operations. Built frontend interfaces using TypeScript and React within a 3-member development team, supporting integrated document submission, file management, and attendance workflows in a unified platform.",
    tech: ["TypeScript", "React", "Frontend Development", "Workflow Automation"],
    image: kjppDashboardImg,
    metrics: [
      { value: "3-Member", label: "DEV TEAM" },
      { value: "Unified", label: "DIGITAL WORKFLOW" }
    ]
  },
  {
    id: 2,
    title: "SIMKOPDES Hackathon- Rekop: Transparansi Koperasi Desa",
    subtitle: "DIGITAL TRANSFORMATION & FINANCIAL TRANSPARENCY",
    year: "2026",
    description: "Digital transformation platform for Koperasi Desa Merah Putih enabling transparent financial reporting, AI chatbot assistance, and community engagement.",
    fullDescription: "Developed Rekop (SIMKOPDES) as a Top 15 Finalist project in the National Hackathon by SIMKOPDES. The platform empowers village cooperatives (Koperasi Desa Merah Putih) with transparent financial reporting, interactive dashboards, community feedback channels, and AI chatbot assistance for accessible digital bookkeeping.",
    tech: ["TypeScript", "React", "AI Integration", "Financial Analytics", "Web Development"],
    image: simkopdesRekopImg,
    link: "https://github.com/usernamedarren/rekop",
    metrics: [
      { value: "Top 15", label: "NATIONAL FINALIST" },
      { value: "Full-Stack", label: "TRANSPARENCY PLATFORM" }
    ]
  },
  {
    id: 3,
    title: "AI-Assisted CV Screening Application",
    subtitle: "MULTI-MODEL AI CANDIDATE CLASSIFICATION",
    year: "2026",
    description: "AI-powered candidate classification system combining AI-as-a-Service and LLM components for automated resume screening.",
    fullDescription: "Developed an AI-powered candidate classification system using multi-model AI integration (AI-as-a-Service + LLM components) within a 5-member cross-functional team. Designed data preprocessing and feature engineering pipelines for structured CV data, evaluated Logistic Regression model performance using precision, recall, and F1-score metrics, and integrated LLM-based components to enable semantic understanding of unstructured resume text.",
    tech: ["Python", "scikit-learn", "Logistic Regression", "LLM API", "AI-as-a-Service"],
    image: cvScreeningImg,
    link: "https://github.com/aqmarfayyaz/II4012_Tugas-Besar-G02",
    metrics: [
      { value: "5-Member", label: "CROSS-FUNCTIONAL TEAM" },
      { value: "Multi-Model", label: "AI PIPELINE" }
    ]
  },
  {
    id: 4,
    title: "SPARK: Parking Slot Detection using Computer Vision",
    subtitle: "REAL-TIME PARKING MONITORING SYSTEM",
    year: "2026",
    description: "Real-time parking availability monitoring system utilizing YOLOv8 object detection and low-latency FastAPI backend.",
    fullDescription: "Built SPARK (Smart Parking), a real-time parking availability monitoring system using AI object detection and server-side communication in a 5-member team. Engineered a Python/FastAPI backend integrating YOLOv8-based detection and optimized server response pipeline to maintain low-latency data delivery under continuous detection load.",
    tech: ["Python", "FastAPI", "YOLOv8", "Computer Vision"],
    image: sparkParkingImg,
    link: "https://github.com/usernamedarren/SPARK-Smart-Parking",
    metrics: [
      { value: "YOLOv8", label: "OBJECT DETECTION" },
      { value: "Low-Latency", label: "FASTAPI SERVER" }
    ]
  },
  {
    id: 5,
    title: "Cross-Platform Barbershop Reservation Application",
    subtitle: "FULL-STACK SALON RESERVATION PLATFORM",
    year: "2025",
    description: "Cross-platform booking system for Brocode Barbershop enabling remote queue scheduling and real-time reservation.",
    fullDescription: "Developed a cross-platform reservation application for Brocode Barbershop aimed at improving queue management and customer booking convenience. Worked as Frontend Developer within a 2-member team, building responsive web and mobile interfaces using TypeScript, JavaScript, Expo, and Supabase with real-time booking functionality.",
    tech: ["TypeScript", "JavaScript", "React Native", "Expo", "Supabase"],
    image: crossPlatformImg,
    link: "https://github.com/Amudixp",
    metrics: [
      { value: "2-Member", label: "DEV TEAM" },
      { value: "Real-time", label: "BOOKING SYSTEM" }
    ]
  },
  {
    id: 6,
    title: "Fraud Analysis using AI Modelling",
    subtitle: "SUPERVISED ML FINANCIAL FRAUD DETECTION",
    year: "2025",
    description: "End-to-end supervised machine learning pipeline evaluating classification algorithms for imbalanced financial fraud datasets.",
    fullDescription: "Academic case study applying supervised ML models to detect fraudulent patterns from structured financial datasets. Built end-to-end ML pipeline: data cleaning, dataset splitting, feature preprocessing, model training (DTL, KNN, Logistic Regression), and evaluation using accuracy, precision, and recall. Compared model performance across algorithms to identify the best-fit classifier for imbalanced fraud data.",
    tech: ["Python", "scikit-learn", "Logistic Regression", "KNN", "Decision Tree"],
    image: fraudAnalysisImg,
    link: "https://github.com/timothymarvine/Tugas-Besar-02-Dasar-Inteligensi-Artifisial",
    metrics: [
      { value: "3+", label: "ML ALGORITHMS" },
      { value: "End-to-End", label: "ML PIPELINE" }
    ]
  },
  {
    id: 7,
    title: "Enterprise Architecture Analysis",
    subtitle: "TOGAF FRAMEWORK OPERATIONAL READINESS",
    year: "2025",
    description: "Enterprise architecture evaluation for 'Toko Kopi Manusia' using TOGAF framework across business, data, app, and tech domains.",
    fullDescription: "Conducted enterprise architecture analysis for “Toko Kopi Manusia” using the TOGAF framework to evaluate operational readiness across business, data, application, and technology domains. Provided strategic technology recommendations including POS systems, Power BI integration, and technology management concepts to improve operational efficiency and business responsiveness.",
    tech: ["Enterprise Architecture", "TOGAF", "Power BI", "POS Systems"],
    image: enterpriseArchImg,
    link: "https://drive.google.com/drive/folders/1sZCeCJyEFIIJU1564NZDdix00Q2ug26J?usp=sharing",
    metrics: [
      { value: "4", label: "DOMAINS EVALUATED" },
      { value: "TOGAF", label: "FRAMEWORK" }
    ]
  },
  {
    id: 8,
    title: "Whoosh Database Analysis",
    subtitle: "RELATIONAL DATABASE SYSTEM DESIGN",
    year: "2024",
    description: "In-depth relational database modeling and entity relationship analysis for the Whoosh high-speed railway system.",
    fullDescription: "Conducted database analysis on the Whoosh railway system to understand data structures, entity relationships, and query-oriented database design. Strengthened practical understanding of database modeling, relational data design, and structured data management workflows.",
    tech: ["PostgreSQL", "MySQL", "RDBMS", "SQL", "Database Design"],
    image: databaseImg,
    link: "https://github.com/Amudixp",
    metrics: [
      { value: "RDBMS", label: "RELATIONAL MODEL" },
      { value: "SQL", label: "QUERY DESIGN" }
    ]
  },
  {
    id: 9,
    title: "SiswaRoom E-Learning Platform",
    subtitle: "API-INTEGRATED LEARNING EXPERIENCE",
    year: "2025",
    description: "E-learning platform with structured courses, interactive quizzes, and a centralized digital library.",
    fullDescription: "Developed an API-integrated e-learning platform designed to organize learning materials in one accessible experience. The application combines structured course content, interactive quizzes, and a centralized digital library while applying practical frontend and REST API integration concepts.",
    tech: ["React", "Node.js", "REST API", "Web Development"],
    image: apiIntegratedImg,
    link: "https://github.com/usernamedarren/SiswaRoom",
    metrics: [
      { value: "100+", label: "LEARNING MODULES" },
      { value: "24/7", label: "PLATFORM ACCESS" }
    ]
  },
  {
    id: 10,
    title: "Object-Oriented Farming Simulation Game",
    subtitle: "2D PIXEL ART JAVA GAME",
    year: "2025",
    description: "Interactive 2D farming simulation built by applying object-oriented programming and game-loop concepts.",
    fullDescription: "Engineered an interactive 2D farming simulation game in Java using object-oriented design principles. The project applies class-based domain modeling, reusable game entities, state management, and a continuous rendering loop to deliver a responsive pixel-art gameplay experience.",
    tech: ["Java", "OOP", "Game Development", "2D Rendering"],
    image: oopJavaImg,
    link: "https://github.com/usernamedarren/SiswaRoom",
    metrics: [
      { value: "60", label: "STABLE FPS" },
      { value: "4", label: "CORE DEVELOPERS" }
    ]
  },
  {
    id: 11,
    title: "Boarding House Discovery Prototype",
    subtitle: "LOCATION-BASED PROPERTY SEARCH UX",
    year: "2025",
    description: "High-fidelity mobile prototype designed to simplify boarding-house and nearby amenity discovery.",
    fullDescription: "Designed an interactive high-fidelity UI/UX prototype for a location-based mobile application that helps students discover boarding houses and nearby amenities. The work covered information architecture, wireframing, interface design, prototyping, and validation of the application's primary user flows.",
    tech: ["Figma", "UI/UX Design", "Wireframing", "Prototyping"],
    image: uiUxImg,
    link: "https://github.com/usernamedarren/Brocode-mobile-app",
    metrics: [
      { value: "15+", label: "INTERACTIVE SCREENS" },
      { value: "3", label: "USER FLOWS" }
    ]
  }
];

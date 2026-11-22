import apiIntegratedImg from '../assets/images/api-integrated.webp';
import oopJavaImg from '../assets/images/oop-java.webp';
import crossPlatformImg from '../assets/images/cross-platform.webp';
import uiUxImg from '../assets/images/ui-ux.webp';
import databaseImg from '../assets/images/Screenshot 2026-03-23 124619.webp';
import kjppDashboardImg from '../assets/images/kjpp-dashboard.webp';
import cvScreeningImg from '../assets/images/cv-screening.webp';
import enterpriseArchImg from '../assets/images/enterprise-architecture.webp';
import sparkParkingImg from '../assets/images/spark-parking.webp';
import simkopdesRekopImg from '../assets/images/simkopdes-rekop.webp';
import fraudAnalysisImg from '../assets/images/fraud-analysis.webp';
import surveyAnalysisImg from '../assets/images/survey-analysis.webp';
import dataAuditImg from '../assets/images/data-audit.webp';
import cellCycleImg from '../assets/images/cell-cycle-simulation.webp';
import type { ProjectData } from '../types';

// Notebooks are served from /public/assets/notebooks and rendered through nbviewer.
const notebookUrl = (file: string) =>
  `https://nbviewer.org/url/amudipurba.com/assets/notebooks/${file}`;

export const projects: ProjectData[] = [
  {
    id: 12,
    title: "Statistical Analysis of AI Usage & Online Activity Survey",
    subtitle: "DESCRIPTIVE & INFERENTIAL STATISTICS",
    year: "2024",
    description: "Statistical analysis of a 1,000-respondent survey on AI usage, online activity, and payment and banking channel preferences.",
    fullDescription: "Analyzed a 1,000-respondent survey in Python using descriptive statistics, percentiles, and frequency and proportion tables across demographic segments, supported by 10+ visualizations such as payment-method trends by age group. Applied z-tests for proportions, confidence intervals, chi-square, and Kolmogorov–Smirnov tests, finding ChatGPT adoption (81.1%) significantly above the 75% benchmark (p < 0.05).",
    tech: ["Python", "pandas", "SciPy", "statsmodels", "Seaborn", "Hypothesis Testing"],
    image: surveyAnalysisImg,
    link: notebookUrl("survey-statistical-analysis.ipynb"),
    metrics: [
      { value: "1,000", label: "SURVEY RESPONDENTS" },
      { value: "4", label: "STATISTICAL TEST FAMILIES" }
    ]
  },
  {
    id: 13,
    title: "Data Quality Audit & Energy Consumption Analysis",
    subtitle: "DATA AUDIT, CLEANING & DECISION-ORIENTED ANALYSIS",
    year: "2026",
    description: "End-to-end audit of an hourly building energy dataset, from data quality checks to benchmarked regression models and a documented decision log.",
    fullDescription: "Audited a 500-row hourly building energy dataset before any modeling: detected 10% missing values in student count and 26 outliers (≈5%) in the target using the IQR method. Compared mean and median imputation and chose the median to preserve the distribution, capped outliers with winsorization instead of dropping rows, one-hot encoded day type, and ran Pearson correlation analysis. Benchmarked Linear and Huber Regression on MAE, RMSE, and R², recorded every analytical choice in a decision log, and concluded that the low R² (≈0.10) made the model an exploratory baseline rather than a basis for operational decisions.",
    tech: ["Python", "pandas", "scikit-learn", "Data Quality Audit", "Regression", "Matplotlib"],
    image: dataAuditImg,
    link: notebookUrl("data-audit-decision-analysis.ipynb"),
    metrics: [
      { value: "10%", label: "MISSING DATA IMPUTED" },
      { value: "2", label: "MODELS BENCHMARKED" }
    ]
  },
  {
    id: 14,
    title: "Cell Cycle Simulation & Scenario Analysis",
    subtitle: "COMPUTATIONAL MODELING & WHAT-IF COMPARISON",
    year: "2026",
    description: "Python simulation of cell-cycle phase durations and population growth, comparing a normal cycle against a checkpoint-delay scenario.",
    fullDescription: "Built a Python model of the cell cycle (G1, S, G2, M) using parameters seeded from a student ID. Computed each phase's share of a 26-hour cycle, simulated population growth over a 72-hour observation window, and ran a what-if comparison against an M-phase checkpoint delay. The scenario showed the M-phase share nearly doubling (3.9% → 7.4%) and growth lagging by one hour per cycle, with results presented in comparison tables and charts.",
    tech: ["Python", "pandas", "Matplotlib", "Simulation", "Scenario Analysis"],
    image: cellCycleImg,
    link: notebookUrl("cell-cycle-simulation.ipynb"),
    metrics: [
      { value: "4", label: "PHASES MODELED" },
      { value: "2", label: "SCENARIOS COMPARED" }
    ]
  },
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
    description: "Digital transparency platform for village cooperatives (Koperasi Desa Merah Putih) with OCR automation, public dashboards, and an AI chatbot.",
    fullDescription: "Led product strategy for Rekop, a Top 15 Finalist project in the National Hackathon by SIMKOPDES. Rekop is a digital transparency platform for village cooperatives that closes trust, access, and voice gaps between cooperative managers and communities through OCR automation, public dashboards, and an AI chatbot.",
    tech: ["Product Strategy", "TypeScript", "React", "OCR", "AI Chatbot", "Public Dashboard"],
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
    title: "Toko Kopi Manusia: Enterprise Architecture Roadmap",
    subtitle: "TOGAF AS-IS TO TO-BE ARCHITECTURE",
    year: "2025",
    description: "As-Is to To-Be enterprise architecture roadmap for 'Toko Kopi Manusia' across five TOGAF domains to support a business expansion strategy.",
    fullDescription: "Assessed As-Is to To-Be architecture for “Toko Kopi Manusia” across five TOGAF domains, including Data and Application architecture, using ArchiMate to support a business expansion strategy. Consolidated 8 application modules into one integrated digital ecosystem while maintaining traceability between business requirements, system design, and data protection controls (ISO 27001, NIST, UU PDP).",
    tech: ["Enterprise Architecture", "TOGAF", "ArchiMate", "ISO 27001", "Data Architecture"],
    image: enterpriseArchImg,
    link: "https://drive.google.com/drive/folders/1sZCeCJyEFIIJU1564NZDdix00Q2ug26J?usp=sharing",
    metrics: [
      { value: "5", label: "TOGAF DOMAINS" },
      { value: "8", label: "APP MODULES CONSOLIDATED" }
    ]
  },
  {
    id: 8,
    title: "Whoosh: Relational Database Design & SQL Analysis for High-Speed Rail Ticketing",
    subtitle: "DATABASE NORMALIZATION & SQL ANALYSIS",
    year: "2024",
    description: "Normalized ticket booking database and business-question SQL analysis for the Whoosh high-speed rail system.",
    fullDescription: "Normalized a 16-relation ticket booking database (users, passengers, orders, seats, routes, trip history, payments) and revised the relational model after normalization in a team of four. Wrote and executed MySQL queries using multi-table JOINs, UNION/INTERSECT, CASE, and COALESCE to answer business questions on passengers, payment methods, cancellations, and seats by route and class.",
    tech: ["MySQL", "SQL", "Normalization", "Relational Modeling", "Database Design"],
    image: databaseImg,
    link: "https://github.com/Amudixp",
    metrics: [
      { value: "16", label: "RELATIONS NORMALIZED" },
      { value: "4-Member", label: "TEAM" }
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

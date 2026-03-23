import apiIntegratedImg from '../assets/images/api-integrated.png';
import oopJavaImg from '../assets/images/oop-java.png';
import crossPlatformImg from '../assets/images/cross-platform.png';
import uiUxImg from '../assets/images/ui-ux.png';
import databaseImg from '../assets/images/Screenshot 2026-03-23 124619.png';

export const projects = [
  {
    id: 1,
    title: "API-Integrated Web Application Development",
    subtitle: "E-LEARNING PLATFORM INTEGRATION",
    year: "2025",
    description: "A comprehensive e-learning platform integrating third-party APIs",
    fullDescription: "A comprehensive e-learning platform integrating third-party APIs to manage structured courses, interactive quizzes, and a centralized digital library.",
    tech: ["React", "Node.js", "REST API"],
    image: apiIntegratedImg,
    link: "https://github.com/usernamedarren/SiswaRoom",
    metrics: [
      { value: "100+", label: "LEARNING MODULES" },
      { value: "24/7", label: "PLATFORM UPTIME" }
    ]
  },
  {
    id: 2,
    title: "Object-Oriented Programming based game development",
    subtitle: "2D PIXEL ART FARMING SIMULATOR",
    year: "2025",
    description: "An interactive 2D farming simulation game using OOP principles",
    fullDescription: "An interactive 2D farming simulation game engineered from scratch utilizing rigorous Object-Oriented Programming principles and rendering loops.",
    tech: ["Java", "OOP", "Game Engine"],
    image: oopJavaImg,
    link: "https://github.com/usernamedarren/SiswaRoom",
    metrics: [
      { value: "60", label: "STABLE FPS" },
      { value: "4", label: "CORE DEVELOPERS" }
    ]
  },
  {
    id: 3,
    title: "Cross-Platform Barbershop Application Development",
    subtitle: "FULL-STACK SALON MANAGEMENT SYSTEM",
    year: "2025",
    description: "A responsive cross-platform application for barbershop management",
    fullDescription: "A responsive cross-platform application featuring secure user authentication and seamless appointment booking for a modern barbershop.",
    tech: ["Flutter", "Firebase", "Express.js"],
    image: crossPlatformImg,
    link: "https://github.com/usernamedarren/Brocode-mobile-app",
    metrics: [
      { value: "< 1s", label: "AUTH RESPONSE TIME" },
      { value: "100%", label: "RESPONSIVE UI" }
    ]
  },
  {
    id: 4,
    title: "UI/UX Prototype – Boarding House (Kos) Search",
    subtitle: "LOCATION-BASED PROPERTY SEARCH UX",
    year: "2025",
    description: "An interactive high-fidelity UI/UX prototype for housing discovery",
    fullDescription: "An interactive, high-fidelity UI/UX prototype for a location-based mobile application designed to streamline student housing and amenity discovery.",
    tech: ["Figma", "Wireframing", "Prototyping"],
    image: uiUxImg,
    link: "https://github.com/usernamedarren/Brocode-mobile-app",
    metrics: [
      { value: "15+", label: "INTERACTIVE SCREENS" },
      { value: "3", label: "USER FLOWS TESTED" }
    ]
  },
  {
    id: 5,
    title: "Whoosh Database Analysis",
    subtitle: "RELATIONAL DATABASE OPTIMIZATION",
    year: "2025",
    description: "Advanced SQL analysis for transaction insights across payment gateways",
    fullDescription: "Advanced SQL data manipulation and analysis to extract insights on cancelled transactions across multiple payment gateways using complex table joins.",
    tech: ["MySQL", "Data Analytics", "RDBMS"],
    image: databaseImg,
    link: "https://drive.google.com/drive/folders/1_4o_PwcwVoLo85c9k1_e4bK2hWGJxYgx?usp=sharing",
    metrics: [
      { value: "5", label: "COMPLEX TABLE JOINS" },
      { value: "0.00s", label: "QUERY EXECUTION TIME" }
    ]
  }
];
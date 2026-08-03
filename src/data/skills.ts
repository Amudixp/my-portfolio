import type { SkillCategory } from '../types';

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C", "PHP", "Haskell"]
  },
  {
    category: "Frontend",
    items: ["React", "React Native", "NextJS", "Expo", "HTML", "CSS", "Tailwind CSS", "JavaFX"]
  },
  {
    category: "Backend",
    items: ["FastAPI", "Node.js", "Express.js", "RESTful API", "JWT", "Supabase"]
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MySQL", "Schema Design", "Query Optimization", "Relational Modelling"]
  },
  {
    category: "DevOps & Tools",
    items: ["Git", "GitHub", "Docker", "Postman", "Swagger", "Cloudflare", "Version Control Workflows"]
  },
  {
    category: "AI/ML Integration",
    items: ["YOLOv8", "scikit-learn", "LLM API Integration", "AI-as-a-Service"]
  }
];
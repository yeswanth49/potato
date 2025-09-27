"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"

const skillCategories = [
  {
    category: "Frontend",
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML",
      "CSS",
      "TailwindCSS",
      "Responsive Design",
      "Accessibility (WCAG)",
      "SEO",
    ],
  },
  {
    category: "Backend & APIs",
    skills: [
      "Node.js",
      "Flask",
      "FastAPI",
      "REST API integration (Axios, Fetch)",
    ],
  },
  {
    category: "Data & Cloud",
    skills: ["Supabase", "PostgreSQL", "MongoDB", "SQL basics", "Google Cloud Platform"],
  },
  {
    category: "DevOps & CI/CD",
    skills: ["Docker", "CI/CD (GitHub Actions)", "Vercel", "Netlify", "Render", "Git", "GitHub"],
  },
  {
    category: "Testing & Quality",
    skills: ["Jest", "React Testing Library", "Selenium", "Postman", "Unit Testing"],
  },
  {
    category: "Programming Languages",
    skills: ["Python", "Java", "C","C++"],
  },
]

export function Skills() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={ref} className="px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div
          className={`transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Technical Skills</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className={`group rounded-lg border bg-card/30 p-4 transition-all duration-800 hover:bg-card ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <h3 className="text-base md:text-lg font-medium text-foreground">{category.category}</h3>
              <p className="text-xs text-muted-foreground mt-1 opacity-80 group-hover:opacity-0 transition-opacity duration-300">Hover to view details</p>
              <div className="flex flex-wrap gap-1.5 mt-0 opacity-0 max-h-0 overflow-hidden transition-all duration-300 group-hover:opacity-100 group-hover:max-h-[200px] group-hover:mt-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge
                    key={skillIndex}
                    variant="secondary"
                    className="text-xs py-0.5 px-2 hover:bg-foreground hover:text-background transition-colors duration-200"
                    style={{ transitionDelay: `${skillIndex * 20}ms` }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

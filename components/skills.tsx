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
    category: "Backend",
    skills: ["Node.js", "Flask", "FastAPI"],
  },
  {
    category: "Databases",
    skills: ["Supabase", "PostgreSQL", "MongoDB", "SQL basics"],
  },
  {
    category: "APIs & Testing",
    skills: [
      "REST API integration (Axios, Fetch)",
      "Postman",
      "Selenium",
      "Jest",
      "React Testing Library",
      "Unit Testing",
    ],
  },
  {
    category: "Deployment & Tools",
    skills: ["Vercel", "Netlify", "Render", "Docker", "CI/CD (GitHub Actions)"],
  },
  {
    category: "Version Control",
    skills: ["Git", "GitHub"],
  },
  {
    category: "Other",
    skills: ["Python", "Java", "C", "Google Cloud Platform"],
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
    <section id="skills" ref={ref} className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div
          className={`transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Technical Skills</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className={`transition-all duration-800 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <h3 className="text-xl font-semibold mb-4 text-foreground">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge
                    key={skillIndex}
                    variant="secondary"
                    className="text-sm py-1 px-3 hover:bg-foreground hover:text-background transition-colors duration-300"
                    style={{
                      animationDelay: `${(index + 1) * 150 + skillIndex * 50}ms`,
                      opacity: isVisible ? 1 : 0,
                      animation: isVisible ? "fadeIn 0.6s ease-out forwards" : "none",
                    }}
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

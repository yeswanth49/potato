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
    skills: ["Python", "Java", "C", "C++"],
  },
]

export function Skills() {
  const [isVisible, setIsVisible] = useState(false)
  const [canAnimate, setCanAnimate] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setCanAnimate(true)
  }, [])

  useEffect(() => {
    // In test, or when IO is unavailable, show immediately
    if (process.env.NODE_ENV === 'test') {
      setIsVisible(true)
      return
    }
    if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const el = sectionRef.current
    if (!el) return () => observer.disconnect()
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="skills" className="px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className={canAnimate && isVisible ? "motion-safe:animate-fade-in-up" : ""}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Technical Skills</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={category.category}
              className={`group rounded-lg border bg-card/30 p-4 transition-all duration-300 hover:bg-card ${canAnimate && isVisible ? "motion-safe:animate-fade-in-up" : ""}`}
              style={canAnimate && isVisible ? { animationDelay: `${(index + 1) * 120}ms` } : {}}
              tabIndex={0}
            >
              <h3 className="text-base md:text-lg font-medium text-foreground">{category.category}</h3>
              <p className="text-xs text-muted-foreground mt-1 opacity-80 transition-opacity duration-300 hidden lg:block lg:group-hover:opacity-0 lg:group-focus-within:opacity-0 lg:focus-visible:opacity-0">
                Hover or focus to view details
              </p>
              <div
                tabIndex={0}
                className="flex flex-wrap gap-1.5 mt-2 overflow-hidden transition-all duration-300 lg:opacity-0 lg:max-h-0 lg:group-hover:opacity-100 lg:group-hover:max-h-96 lg:group-focus-within:opacity-100 lg:group-focus-within:max-h-96 lg:focus:opacity-100 lg:focus:max-h-96 lg:focus-visible:opacity-100 lg:focus-visible:max-h-96"
                // Make visible by default; collapse only on large hover-capable screens
              >
                {category.skills.map((skill, skillIndex) => (
                  <Badge
                    key={skill}
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

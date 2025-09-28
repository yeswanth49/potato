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
  return (
    <section id="skills" className="px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="motion-safe:animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Technical Skills</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={category.category}
              className="group rounded-lg border bg-card/30 p-4 transition-all duration-300 hover:bg-card motion-safe:animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 120}ms` }}
            >
              <h3 className="text-base md:text-lg font-medium text-foreground">{category.category}</h3>
              <p className="text-xs text-muted-foreground mt-1 opacity-80 transition-opacity duration-300 lg:group-hover:opacity-0">
                Hover to view details
              </p>
              <div
                tabIndex={0}
                className="flex flex-wrap gap-1.5 mt-2 overflow-hidden transition-all duration-300 lg:group-hover:mt-2 lg:group-hover:opacity-0 lg:group-hover:max-h-0 lg:group-hover:mt-0 lg:group-hover:overflow-hidden lg:group-hover:transition-all lg:group-hover:duration-300"
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

"use client"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    id: "openbook",
    title: "OpenBook",
    description:
      "AI-powered research and learning platform with streaming chat, rich Markdown/LaTeX support, and multiple study workflows.",
    features: [
      "Next.js App Router with TypeScript",
      "AI SDK integration with 5+ providers",
      "Spaced repetition & memory palace workflows",
      "Real-time streaming responses",
      "PWA with offline capabilities",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "AI SDK", "Vercel"],
    liveUrl: "https://goopenbook.in",
    githubUrl: "#",
  },
  {
    id: "safelink",
    title: "safeLINK",
    description:
      "Mobile-first emergency QR profile application for rapid access to critical information during emergencies.",
    features: [
      "QR code generation with secure IDs",
      "In-browser QR scanner using WebRTC",
      "Password-protected profile editing",
      "Multiple profile templates",
      "Production-ready deployment",
    ],
    technologies: ["Flask", "SQLite", "Jinja2", "WebRTC", "Python", "Gunicorn"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "pecup",
    title: "PEC.UP",
    description:
      "Resource-sharing platform serving 1.5k+ registered users with high-performance architecture for peak loads.",
    features: [
      "Responsive cross-device design",
      "REST API integration",
      "User management system",
      "High concurrent user handling",
      "Performance optimizations",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Node.js", "REST APIs"],
    liveUrl: "#",
    githubUrl: "#",
  },
]

export function Projects() {
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map())
  const [visibleIndices, setVisibleIndices] = useState<Set<string>>(new Set())

  useEffect(() => {
    projects.forEach((project, idx) => {
      const el = cardRefs.current[project.id]
      if (!el) return
      if (observersRef.current.has(project.id)) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleIndices((prev) => {
                if (prev.has(project.id)) return prev
                const next = new Set(prev)
                next.add(project.id)
                return next
              })

              const obs = observersRef.current.get(project.id)
              if (obs) {
                obs.disconnect()
                observersRef.current.delete(project.id)
              }
            }
          })
        },
        { threshold: 0.2 }
      )

      observer.observe(el)
      observersRef.current.set(project.id, observer)
    })

    return () => {
      observersRef.current.forEach((obs) => obs.disconnect())
      observersRef.current.clear()
    }
  }, [])

  return (
    <section id="projects" className="px-4">
      <div className="max-w-5xl mx-auto">
        <div className="motion-safe:animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Featured Projects</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => { cardRefs.current[project.id] = el }}
              className={visibleIndices.has(project.id) ? "motion-safe:animate-fade-in-up" : undefined}
              style={{ animationDelay: `${(index + 1) * 120}ms` }}
            >
              <Card className="h-full transition-colors border-border/50 group">
                <CardHeader>
                  <CardTitle className="text-lg mb-1.5 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed text-sm">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-2">
                  <ul className="space-y-1 mb-4 flex-1">
                    {project.features.map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-foreground mt-0.5">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-[10px] py-0.5">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button size="sm" variant="outline" className="flex-1 group/btn bg-transparent" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:translate-x-0.5 transition-transform" />
                        Live Demo
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost" className="group/btn" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

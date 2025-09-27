"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
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
    <section id="projects" ref={ref} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className={`transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Featured Projects</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`transition-all duration-800 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 group">
                <CardHeader>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-1 mb-6 flex-1">
                    {project.features.map((feature, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-foreground mt-1">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
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

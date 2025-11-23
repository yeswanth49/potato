"use client"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react"

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
    githubUrl: "https://github.com/yeswanth49/openbook",
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
    liveUrl: "https://safelink.pecup.in",
    githubUrl: "https://github.com/yeswanth49/safelink",
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
    liveUrl: "https://pecup.in",
    githubUrl: "https://github.com/yeswanth49/pecup-dead",
  },
  {
    id: "openbook-landing",
    title: "OpenBook Landing Page",
    description:
      "Beautiful and modern landing page for the OpenBook AI-powered research platform with stunning visual design.",
    features: [
      "Modern responsive design",
      "Smooth animations and transitions",
      "Interactive UI components",
      "SEO optimized structure",
      "Fast loading performance",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://page.goopenbook.in",
    githubUrl: "https://github.com/yeswanth49/openbook-lp",
  },
  {
    id: "pecup-old",
    title: "PEC.UP (Original)",
    description:
      "The original version of PEC.UP built with clean vanilla HTML, CSS, and JavaScript before the Node.js migration.",
    features: [
      "Pure HTML/CSS/JavaScript implementation",
      "Clean and simple design",
      "Basic interactivity",
      "No framework dependencies",
      "Educational project structure",
    ],
    technologies: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://old.pecup.in",
    githubUrl: "https://github.com/yeswanth49/pecup",
  },
]

export function Projects() {
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map())
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const [visibleIndices, setVisibleIndices] = useState<Set<string>>(new Set())
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (!container) return
    container.scrollBy({ left: -320, behavior: 'smooth' })
  }

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (!container) return
    container.scrollBy({ left: 320, behavior: 'smooth' })
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleResize = () => checkScrollPosition()

    checkScrollPosition()
    container.addEventListener('scroll', checkScrollPosition)
    window.addEventListener('resize', handleResize)

    return () => {
      container.removeEventListener('scroll', checkScrollPosition)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section id="projects" className="px-8 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="motion-safe:animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Projects.</h2>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 transition-all duration-300 group"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-foreground group-hover:text-primary animate-nudge-left" />
            </button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 transition-all duration-300 group"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-foreground group-hover:text-primary animate-nudge-right" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide px-4 md:px-12"
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[project.id] = el }}
                className={`flex-none w-[85vw] md:w-80 ${visibleIndices.has(project.id) ? "motion-safe:animate-fade-in-up" : ""}`}
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
                      <Button size="sm" variant="outline" className="flex-1 group/btn bg-transparent hover:bg-transparent hover:text-foreground" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:translate-x-0.5 transition-transform" />
                          Live Demo
                        </a>
                      </Button>
                      <Button size="sm" variant="ghost" className="group/btn hover:bg-transparent hover:text-foreground" asChild>
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
      </div>
    </section >
  )
}

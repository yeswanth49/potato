"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

const experiences = [
  {
    title: "Founder & Developer",
    company: "OpenBook",
    period: "2024 – Present",
    description:
      "Built AI-powered research/learning platform with Next.js (App Router) + Tailwind; streaming chat and rich Markdown/LaTeX",
    achievements: [
      "Orchestrated 5+ AI providers via AI SDK (tool-calling, structured outputs, server-side streaming)",
      "Implemented 3 study workflows (spaced repetition, memory palace, Feynman) and 2 web search tools (Exa, Tavily)",
      "Added rate limiting and structured logging middleware; instrumented 3 analytics layers (PostHog, Vercel Analytics, Speed Insights)",
      "Delivered PWA install experience; deployed on Vercel (serverless/edge) with streaming responses",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "AI SDK", "Vercel"],
    link: "https://goopenbook.in",
  },
  {
    title: "Founder & Developer",
    company: "safeLINK",
    period: "2024 – Present",
    description: "Mobile-first emergency QR profile app; generates QR-linked profiles for rapid access",
    achievements: [
      "SQLite + Jinja2 CRUD; server-side QR generation (qrcode/Pillow) with secure IDs; inline/downloadable PNGs",
      "In-browser QR scanner using WebRTC getUserMedia + jsQR; guided UX with modal prompts",
      "Exposed 8 routes (landing, template select, generate, profile, download, scanner, edit, verify)",
      "Password-gated edits with JSON verification; production-ready with Gunicorn",
    ],
    technologies: ["Flask", "SQLite", "Jinja2", "QR (qrcode/Pillow)", "WebRTC", "Gunicorn"],
  },
  {
    title: "Founder & Developer",
    company: "PEC.UP",
    period: "2023 – Present",
    description: "Resource-sharing platform with 1.5k+ registered users; handled 1–2k peak concurrent during exams",
    achievements: [
      "Implemented responsive layouts and performance optimizations for seamless cross-device UX",
      "Integrated REST APIs for dynamic content delivery and user management",
      "Successfully scaled to handle high concurrent user loads during peak exam periods",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Node.js"],
  },
]

export function Experience() {
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
    <section id="experience" ref={ref} className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div
          className={`transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Professional Experience</h2>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`transition-all duration-800 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        {exp.title} — {exp.company}
                        {exp.link && (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </CardTitle>
                      <CardDescription className="text-base">{exp.period}</CardDescription>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                        <span className="text-foreground mt-1.5">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
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

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
  return (
    <section id="experience" className="px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="motion-safe:animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Professional Experience</h2>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={`${exp.company}-${exp.title}`}
              className="motion-safe:animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 120}ms` }}
            >
              <Card className="transition-colors border-border/50">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg mb-1.5 flex items-center gap-2">
                        {exp.title} — {exp.company}
                        {exp.link ? (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : null}
                      </CardTitle>
                      <CardDescription className="text-sm">{exp.period}</CardDescription>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm">{exp.description}</p>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="space-y-1.5 mb-4">
                    {exp.achievements.map((achievement, i) => (
                      <li key={achievement} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                        <span className="text-foreground mt-1" aria-hidden="true">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-[10px] py-0.5">
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

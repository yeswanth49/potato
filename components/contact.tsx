"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Mail, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const techStacks = {
  frontend: [
    "React", "Next.js", "Vue.js", "TypeScript", "JavaScript",
    "Tailwind CSS", "Bootstrap", "Material-UI", "Chakra UI", "Styled Components"
  ],
  backend: [
    "Node.js", "Express.js", "Next.js", "Python", "FastAPI", "Flask",
    "Java", "Go", "Rust"
  ],
  database: [
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase", "Supabase"
  ],
  other: [
    "Docker", "Kubernetes", "AWS", "Google Cloud", "Azure", "Vercel", "Netlify",
    "GitHub Actions", "Jenkins", "REST API", "WebSocket",
    "Microservices", "Serverless", "PWA"
  ]
}

const categoryColors = {
  frontend: { selected: "#1e40af", selectedText: "#3b82f6", selectedBg: "#1e3a8a" },
  backend: { selected: "#059669", selectedText: "#10b981", selectedBg: "#064e3b" },
  database: { selected: "#dc2626", selectedText: "#ef4444", selectedBg: "#7f1d1d" },
  other: { selected: "#7c2d12", selectedText: "#ea580c", selectedBg: "#431407" }
}

const XIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}
  >
    <title>X</title>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
)

export function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedTech, setSelectedTech] = useState<{ [key: string]: string[] }>({
    frontend: [], backend: [], database: [], other: []
  })
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const toggleTech = (category: string, tech: string) => {
    setSelectedTech(prev => ({
      ...prev,
      [category]: prev[category].includes(tech)
        ? prev[category].filter(t => t !== tech)
        : [...prev[category], tech]
    }))
  }

  const getAllSelectedTech = () => {
    return Object.entries(selectedTech).flatMap(([category, techs]) =>
      techs.map(tech => ({ category, tech }))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const selectedTechList = getAllSelectedTech()
    const techStackText = selectedTechList.length > 0
      ? selectedTechList.map(({ category, tech }) => `• ${tech} (${category})`).join('\n')
      : 'No specific technologies specified'

    const emailBody = `Dear Yeswanth,

I hope this email finds you well.

I am writing to inquire about potential collaboration on a project and wanted to share some details about my requirements:

CLIENT INFORMATION:
• Name: ${formData.name}
• Email: ${formData.email}

PROJECT TECH STACK:
${techStackText}

PROJECT DETAILS:
${formData.message}

I believe your expertise would be valuable for this project and would appreciate the opportunity to discuss this further. Please let me know your availability for a brief call or meeting to explore how we might work together.

Thank you for your time and consideration.

Best regards,
${formData.name}

---
This inquiry was submitted through your portfolio contact form.
    `.trim()

    const subjectTech = selectedTechList.length > 0
      ? `Project Collaboration - ${selectedTechList.slice(0, 3).map(({ tech }) => tech).join(', ')}${selectedTechList.length > 3 ? ' & more' : ''}`
      : 'Project Collaboration Inquiry'

    const mailtoLink = `mailto:work.yeswanth@gmail.com?subject=${encodeURIComponent(subjectTech)}&body=${encodeURIComponent(emailBody)}`

    window.location.href = mailtoLink

    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" })
      setSelectedTech({ frontend: [], backend: [], database: [], other: [] })
      setIsSubmitting(false)
      setShowForm(false) // Reset back to contact card after submission
    }, 1000)
  }

  const renderTechCategory = (category: keyof typeof techStacks, title: string) => {
    const colors = categoryColors[category]
    return (
      <div key={category} className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-foreground/80 uppercase tracking-wider">{title}</h4>
        <motion.div
          className="flex flex-wrap gap-2"
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
        >
          {techStacks[category].map((tech) => {
            const isSelected = selectedTech[category].includes(tech)
            return (
              <motion.button
                key={tech}
                onClick={() => toggleTech(category, tech)}
                layout
                initial={false}
                animate={{
                  backgroundColor: isSelected ? colors.selected : "rgba(255, 255, 255, 0.08)",
                }}
                whileHover={{
                  backgroundColor: isSelected ? colors.selected : "rgba(255, 255, 255, 0.12)",
                }}
                whileTap={{
                  backgroundColor: isSelected ? colors.selectedBg : "rgba(255, 255, 255, 0.16)",
                }}
                transition={{
                  type: "spring", stiffness: 500, damping: 30, mass: 0.5,
                  backgroundColor: { duration: 0.1 },
                }}
                className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                  whitespace-nowrap overflow-hidden ring-1 ring-inset
                  ${isSelected
                    ? `ring-[hsla(0,0%,100%,0.12)]`
                    : "text-muted-foreground ring-border/20"}
                `}
                style={{ color: isSelected ? colors.selectedText : undefined }}
              >
                <motion.div
                  className="relative flex items-center"
                  animate={{
                    width: isSelected ? "auto" : "100%",
                    paddingRight: isSelected ? "1.25rem" : "0",
                  }}
                  transition={{ ease: [0.175, 0.885, 0.32, 1.275], duration: 0.3 }}
                >
                  <span>{tech}</span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                        className="absolute right-0"
                      >
                        <div
                          className="w-3 h-3 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colors.selectedText }}
                        >
                          <Check
                            className="w-2 h-2"
                            strokeWidth={2}
                            style={{ color: colors.selected }}
                          />
                        </div>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    )
  }

  return (
    <section id="contact" ref={ref} className="px-4 md:px-12 lg:px-24 snap-start">
      <div className="max-w-6xl mx-auto">
        <div
          className={`transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">We Build Great Things Together.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select the tech stack, of your project. that you want to bring life to.
            </p>
          </div>
        </div>

        <div
          className={`transition-all duration-800 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tech Stack Selection - Takes up 2 columns */}
            <div className="lg:col-span-2 lg:pl-16">
              <div className="space-y-6">
                {renderTechCategory('frontend', 'Frontend')}
                {renderTechCategory('backend', 'Backend')}
                {renderTechCategory('database', 'Database')}
                {renderTechCategory('other', 'DevOps & Other')}
              </div>
            </div>

            {/* Contact Card / Form - Takes up 1 column */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {!showForm ? (
                  <motion.div
                    key="contact-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-border/50 sticky top-6 h-full flex flex-col justify-between bg-card/0 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-2xl">Yeswanth</CardTitle>
                        <CardDescription className="text-base">Full Stack Developer</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <p className="text-muted-foreground">
                          swe ~ building software that do great things.
                        </p>

                        <div className="flex flex-wrap items-center justify-start gap-4 md:gap-6 pt-2">
                          <a
                            href="https://x.com/yswnth"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X profile"
                            className="group flex items-center text-muted-foreground transition-all duration-300 ease-in-out"
                          >
                            <XIcon className="w-4 h-4 group-hover:text-foreground transition-colors group-hover:drop-shadow-lg" />
                            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs text-muted-foreground group-hover:text-foreground/50">
                              <span className="pl-2">@yswnth</span>
                            </span>
                          </a>
                          <a
                            href="https://www.linkedin.com/in/yeswanth"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn profile"
                            className="group flex items-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300 ease-in-out"
                          >
                            <Linkedin className="w-5 h-5 group-hover:drop-shadow-lg" />
                          </a>
                          <a
                            href="https://github.com/yswnth"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub profile"
                            className="group flex items-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300 ease-in-out"
                          >
                            <Github className="w-5 h-5 group-hover:drop-shadow-lg" />
                          </a>
                          <a
                            href="mailto:work.yeswanth@gmail.com"
                            aria-label="Send email"
                            className="group flex items-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300 ease-in-out"
                          >
                            <Mail className="w-5 h-5 group-hover:drop-shadow-lg" />
                          </a>
                        </div>

                        <Button
                          className="w-full mt-4 group"
                          onClick={() => setShowForm(true)}
                        >
                          Connect
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-border/50 sticky top-6 bg-card/0 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Project Details</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowForm(false)}
                          className="text-muted-foreground hover:text-foreground -mr-2"
                        >
                          Back
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              required
                              placeholder="Your name"
                              className="bg-secondary/0 border-white/10"
                            />
                          </div>

                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              required
                              placeholder="mail@example.com"
                              className="bg-secondary/0 border-white/10"
                            />
                          </div>

                          <div>
                            <Label htmlFor="message">Project Description</Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                              required
                              className="min-h-[100px] bg-secondary/0 border-white/10"
                              placeholder="Your project, timeline, and requirements."
                            />
                          </div>

                          {getAllSelectedTech().length > 0 && (
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-2">Selected Technologies:</p>
                              <div className="flex flex-wrap gap-1">
                                {getAllSelectedTech().slice(0, 6).map(({ category, tech }, index) => (
                                  <span
                                    key={index}
                                    className="text-xs px-2 py-1 rounded-full"
                                    style={{
                                      backgroundColor: categoryColors[category as keyof typeof categoryColors].selected + '20',
                                      color: categoryColors[category as keyof typeof categoryColors].selectedText
                                    }}
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {getAllSelectedTech().length > 6 && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-muted-foreground/0 text-muted-foreground">
                                    +{getAllSelectedTech().length - 6} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                                Opening Email...
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Project Inquiry
                              </>
                            )}
                          </Button>
                        </form>

                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground text-center">
                            Opens your email client with pre-filled details
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

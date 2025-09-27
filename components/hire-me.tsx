"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const techStacks = {
  frontend: [
    "React", "Next.js", "Vue.js", "Angular", "Svelte", "TypeScript", "JavaScript", 
    "Tailwind CSS", "Bootstrap", "Material-UI", "Chakra UI", "Styled Components"
  ],
  backend: [
    "Node.js", "Express.js", "Nest.js", "Python", "Django", "FastAPI", "Flask", 
    "Java", "Spring Boot", "C#", ".NET", "PHP", "Laravel", "Ruby on Rails", "Go", "Rust"
  ],
  database: [
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase", "Supabase", 
    "PlanetScale", "DynamoDB", "Cassandra", "InfluxDB", "Neo4j"
  ],
  other: [
    "Docker", "Kubernetes", "AWS", "Google Cloud", "Azure", "Vercel", "Netlify", 
    "GitHub Actions", "Jenkins", "Terraform", "GraphQL", "REST API", "WebSocket", 
    "Microservices", "Serverless", "PWA"
  ]
}

const categoryColors = {
  frontend: { selected: "#1e40af", selectedText: "#3b82f6", selectedBg: "#1e3a8a" },
  backend: { selected: "#059669", selectedText: "#10b981", selectedBg: "#064e3b" },
  database: { selected: "#dc2626", selectedText: "#ef4444", selectedBg: "#7f1d1d" },
  other: { selected: "#7c2d12", selectedText: "#ea580c", selectedBg: "#431407" }
}

export function HireMe() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedTech, setSelectedTech] = useState<{[key: string]: string[]}>({
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
      ? selectedTechList.map(({ category, tech }) => `${tech} (${category})`).join(', ')
      : 'No specific technologies selected'

    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}

Selected Tech Stack:
${techStackText}

Message:
${formData.message}

---
This email was sent from the portfolio contact form.
    `.trim()

    const mailtoLink = `mailto:work.yeswanth@gmail.com?subject=Project Inquiry - Tech Stack: ${selectedTechList.slice(0, 3).map(({tech}) => tech).join(', ')}${selectedTechList.length > 3 ? '...' : ''}&body=${encodeURIComponent(emailBody)}`
    
    window.location.href = mailtoLink
    
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" })
      setSelectedTech({ frontend: [], backend: [], database: [], other: [] })
      setIsSubmitting(false)
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
                  backgroundColor: isSelected ? colors.selected : "rgba(39, 39, 42, 0.3)",
                }}
                whileHover={{
                  backgroundColor: isSelected ? colors.selected : "rgba(39, 39, 42, 0.5)",
                }}
                whileTap={{
                  backgroundColor: isSelected ? colors.selectedBg : "rgba(39, 39, 42, 0.7)",
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
    <section id="hire-me" ref={ref} className="px-4 snap-start">
      <div className="max-w-6xl mx-auto">
        <div
          className={`transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">Let's Build Something Amazing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select the technologies you'd like to use for your project, and let's discuss how we can bring your vision to life.
            </p>
          </div>
        </div>

        <div
          className={`transition-all duration-800 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tech Stack Selection - Takes up 2 columns */}
            <div className="lg:col-span-2">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Choose Your Tech Stack</CardTitle>
                  <CardDescription>
                    Select the technologies that fit your project needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderTechCategory('frontend', 'Frontend')}
                  {renderTechCategory('backend', 'Backend')}
                  {renderTechCategory('database', 'Database')}
                  {renderTechCategory('other', 'DevOps & Other')}
                </CardContent>
              </Card>
            </div>

            {/* Contact Form - Takes up 1 column */}
            <div className="lg:col-span-1">
              <Card className="border-border/50 sticky top-6">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Tell me about your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="Your name"
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
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Project Description</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        required
                        className="min-h-[100px]"
                        placeholder="Describe your project, timeline, and requirements..."
                      />
                    </div>

                    {getAllSelectedTech().length > 0 && (
                      <div className="p-3 bg-muted rounded-lg">
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
                            <span className="text-xs px-2 py-1 rounded-full bg-muted-foreground/20 text-muted-foreground">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

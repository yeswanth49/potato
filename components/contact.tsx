"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Mail, Phone } from "lucide-react"

export function Contact() {
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
    <section id="contact" ref={ref} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Get In Touch</h2>
        </div>

        <div
          className={`transition-all duration-800 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Card className="border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">Let's Work Together</CardTitle>
              <CardDescription className="text-lg leading-relaxed">
                I'm always interested in discussing new opportunities, innovative projects, and collaborations. Feel
                free to reach out if you'd like to connect!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 group hover:bg-foreground hover:text-background transition-all duration-300 bg-transparent"
                  asChild
                >
                  <a href="mailto:work.yeswanth@gmail.com" className="flex items-center gap-3">
                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-semibold">Email</div>
                      <div className="text-sm text-muted-foreground group-hover:text-background/80">
                        work.yeswanth@gmail.com
                      </div>
                    </div>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 group hover:bg-foreground hover:text-background transition-all duration-300 bg-transparent"
                  asChild
                >
                  <a href="tel:9032690321" className="flex items-center gap-3">
                    <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-semibold">Phone</div>
                      <div className="text-sm text-muted-foreground group-hover:text-background/80">9032690321</div>
                    </div>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 group hover:bg-foreground hover:text-background transition-all duration-300 bg-transparent"
                  asChild
                >
                  <a
                    href="https://github.com/yeswanth49"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-semibold">GitHub</div>
                      <div className="text-sm text-muted-foreground group-hover:text-background/80">@yeswanth49</div>
                    </div>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 group hover:bg-foreground hover:text-background transition-all duration-300 bg-transparent"
                  asChild
                >
                  <a
                    href="https://linkedin.com/in/yeswanthm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-semibold">LinkedIn</div>
                      <div className="text-sm text-muted-foreground group-hover:text-background/80">@yeswanthm</div>
                    </div>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div
          className={`transition-all duration-800 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mt-12 pt-8 border-t border-border">
            <p className="text-muted-foreground">© 2025 Yeswanth Madasu. Built with Next.js and Tailwind CSS.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

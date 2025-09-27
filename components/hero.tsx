"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail, Phone } from "lucide-react"

export function Hero() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="opacity-0 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-semibold mb-3 text-balance">Yeswanth Madasu</h1>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-200">
          <p className="text-base md:text-lg text-muted-foreground mb-4 text-balance">Frontend Developer</p>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-300">
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            Frontend-focused developer building accessible, performant web apps with React and Next.js.
          </p>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-400">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <a
              href="tel:9032690321"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              9032690321
            </a>
            <a
              href="mailto:work.yeswanth@gmail.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              work.yeswanth@gmail.com
            </a>
            <a
              href="https://github.com/yeswanth49"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/yeswanthm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-500">
          <Button
            onClick={scrollToAbout}
            variant="outline"
            size="sm"
            className="group transition-colors hover:bg-foreground hover:text-background bg-transparent"
          >
            Explore My Work
            <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}

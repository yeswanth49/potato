"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail, Phone } from "lucide-react"

export function Hero() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="opacity-0 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Yeswanth Madasu</h1>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-200">
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">Frontend Developer</p>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-300">
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed text-pretty">
            Frontend-focused developer with entrepreneurial drive, building accessible, performant web apps using
            React.js, Next.js, Node.js, and REST APIs.
          </p>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-400">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
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
            size="lg"
            className="group transition-all duration-300 hover:bg-foreground hover:text-background bg-transparent"
          >
            Explore My Work
            <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}

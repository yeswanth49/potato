'use client';

import { ArrowDown, Github, Linkedin, Twitter, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="hero" className="flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="opacity-0 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-semibold mb-3 text-balance">Hi, I'm Yeswanth Madasu</h1>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-200">
          <p className="text-base md:text-lg text-muted-foreground mb-4 text-balance">Full Stack Developer</p>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-300">
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            Frontend-focused developer building accessible, performant web apps with React and Next.js.
            Focusing on building accessible, performant web apps with React and Next.js.
          </p>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-400">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <a
              href="https://x.com/Yeshh49"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
            >
              <Twitter className="w-5 h-5" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
                Twitter
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/yeswanth49"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
            >
              <Linkedin className="w-5 h-5" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
                LinkedIn
              </span>
            </a>
            <a
              href="https://github.com/yeswanth49"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
            >
              <Github className="w-5 h-5" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
                GitHub
              </span>
            </a>
            <a
              href="/Yeswanth_Madasu.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
            >
              <FileText className="w-5 h-5" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
                Resume
              </span>
            </a>
          </div>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-500">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="group transition-colors hover:bg-transparent hover:text-foreground bg-transparent"
          >
            <a href="#about">
              Explore My Work
              <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

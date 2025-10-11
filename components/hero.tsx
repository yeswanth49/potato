'use client';

import { ArrowDown, Github, Linkedin, Twitter, FileText } from "lucide-react"
import { useCallback, useState, useEffect } from "react"

import { Button } from "@/components/ui/button"

export function Hero() {
  const [currentAge, setCurrentAge] = useState(() => {
    const birthDate = new Date('2006-01-02T00:00:00Z')
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - birthDate.getTime())
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)
    return diffYears.toFixed(9)
  })

  useEffect(() => {
    const updateAge = () => {
      const birthDate = new Date('2006-01-02T00:00:00Z')
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - birthDate.getTime())
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)
      setCurrentAge(diffYears.toFixed(9))
    }

    updateAge() // Initial calculation
    const interval = setInterval(updateAge, 100) // Update every 100ms for smooth counting

    return () => clearInterval(interval)
  }, [])

  const scrollToProjects = useCallback(() => {
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        // Use instant scroll for users who prefer reduced motion
        projectsSection.scrollIntoView({
          behavior: 'auto',
          block: 'start',
          inline: 'nearest'
        })
        return
      }

      // Programmatic smooth scroll with custom duration and easing
      const startPosition = window.pageYOffset
      const targetPosition = projectsSection.offsetTop
      const distance = targetPosition - startPosition
      const duration = 4000 // 4 seconds
      let startTime: number | null = null

      function easeInOutCubic(t: number): number {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      }

      function animateScroll(currentTime: number) {
        if (startTime === null) {
          startTime = currentTime
        }

        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)

        // Apply easing function
        const easeProgress = easeInOutCubic(progress)

        // Calculate new scroll position
        const newPosition = startPosition + (distance * easeProgress)

        window.scrollTo(0, newPosition)

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        }
      }

      requestAnimationFrame(animateScroll)
    }
  }, [])

  return (
    <section id="hero" className="flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="opacity-0 animate-fade-in-up">
        <h1 className="text-6xl md:text-7xl lg:text-8xl mb-3 font-league_spartan font-bold leading-none flex justify-center" style={{ fontFamily: 'var(--font-league-spartan)', fontWeight: '700', transform: 'translateX(2rem) translateY(4rem)' }}>
            <div className="flex flex-col">
              <span className="text-left">hi, i'm yeswanth.</span>
            </div>
          </h1>
        </div>


        <div className="opacity-0 animate-fade-in-up animate-delay-300">
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-pretty" style={{ transform: 'translateX(2rem) translateY(4rem)' }}>
            been here for {currentAge} years
          </p>
        </div>
        <div className="opacity-0 animate-fade-in-up animate-delay-300">
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-pretty" style={{ transform: 'translateX(2rem) translateY(3rem)' }}>
            trying to learn everything, by breaking everything.
          </p>
        </div>

        <div className="opacity-0 animate-fade-in-up animate-delay-400">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8" style={{ transform: 'translateX(2rem) translateY(4rem)' }}>
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
            variant="outline"
            size="sm"
            className="group transition-colors hover:bg-transparent hover:text-foreground bg-transparent"
            style={{ transform: 'translateX(2rem) translateY(4rem)' }}
            onClick={scrollToProjects}
          >
            Explore My Work
            <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}

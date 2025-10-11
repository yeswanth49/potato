'use client';

import { ArrowDown, Github, Linkedin, Twitter, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

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


  return (
    <section id="hero" className="flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Profile Image - Left Side */}
          <div className="flex-shrink-0">
            <div className="opacity-0 animate-fade-in-up">
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-border/20 shadow-lg">
                <Image
                  src="/profile.JPG"
                  alt="Yeswanth's profile picture"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>

          {/* Content - Right Side */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <div className="opacity-0 animate-fade-in-up animate-delay-200">
              <h1 className="text-5xl md:text-6xl lg:text-7xl mb-3 font-league_spartan font-bold leading-none" style={{ fontFamily: 'var(--font-league-spartan)', fontWeight: '700' }}>
                hi, i'm yeswanth.
              </h1>
            </div>

            <div className="opacity-0 animate-fade-in-up animate-delay-300">
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed text-pretty">
                been here for {currentAge} years
              </p>
            </div>

            <div className="opacity-0 animate-fade-in-up animate-delay-300">
              <p className="text-sm text-muted-foreground mb-0 leading-relaxed text-pretty">
                trying to learn everything, by breaking everything.
              </p>
            </div>
            <div className="opacity-0 animate-fade-in-up animate-delay-300">
              <p className="text-sm text-muted-foreground mb-0 leading-relaxed text-pretty">
                <a
                  href="https://yesh.bearblog.dev/things-i-admire-the-most/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline transition-colors duration-200 cursor-pointer"
                >
                  things i admire the most.
                </a>
              </p>
            </div>

            <div className="opacity-0 animate-fade-in-up animate-delay-300">
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed text-pretty">
                <a
                  href="https://yesh.bearblog.dev/things-i-learnt-in-meanwhile/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline transition-colors duration-200 cursor-pointer"
                >
                  things i learnt meanwhile.
                </a>
              </p>
            </div>

            <div className="opacity-0 animate-fade-in-up animate-delay-400">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8">
                <a
                  href="https://x.com/Yeshh49"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300 ease-in-out"
                >
                  <Twitter className="w-5 h-5 group-hover:drop-shadow-lg" />
                </a>
                <a
                  href="https://www.linkedin.com/in/yeswanth49"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300 ease-in-out"
                >
                  <Linkedin className="w-5 h-5 group-hover:drop-shadow-lg" />
                </a>
                <a
                  href="https://github.com/yeswanth49"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300 ease-in-out"
                >
                  <Github className="w-5 h-5 group-hover:drop-shadow-lg" />
                </a>
                <a
                  href="/Yeswanth_Madasu.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300 ease-in-out"
                >
                  <FileText className="w-5 h-5 group-hover:drop-shadow-lg" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}



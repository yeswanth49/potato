"use client"

import { useState, useEffect } from "react"

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Hire Me", href: "#hire-me" },
  { name: "Contact", href: "#contact" },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    // Use Intersection Observer for better scroll snap compatibility
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section is 20% from top
      threshold: 0
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the section that's most visible
      let mostVisibleSection = ""
      let maxIntersectionRatio = 0

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
          maxIntersectionRatio = entry.intersectionRatio
          mostVisibleSection = entry.target.id
        }
      })

      // If no section is intersecting with the threshold, fall back to scroll position
      if (!mostVisibleSection) {
        const sections = navItems.map((item) => item.href.slice(1))
        const scrollPosition = window.scrollY + window.innerHeight / 3 // Use 1/3 of viewport height

        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            const elementTop = rect.top + window.scrollY
            const elementBottom = elementTop + rect.height
            
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              mostVisibleSection = section
              break
            }
          }
        }
      }

      if (mostVisibleSection && mostVisibleSection !== activeSection) {
        setActiveSection(mostVisibleSection)
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all sections
    navItems.forEach((item) => {
      const element = document.getElementById(item.href.slice(1))
      if (element) {
        observer.observe(element)
      }
    })

    // Also add scroll listener as backup for edge cases
    const handleScroll = () => {
      // Debounced scroll handler for smooth performance
      requestAnimationFrame(() => {
        const sections = navItems.map((item) => item.href.slice(1))
        const scrollPosition = window.scrollY + window.innerHeight / 3

        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            const elementTop = rect.top + window.scrollY
            const elementBottom = elementTop + rect.height
            
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              if (section !== activeSection) {
                setActiveSection(section)
              }
              break
            }
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    
    // Initial check
    handleScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeSection])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="fixed left-8 md:left-12 top-1/2 -translate-y-1/2 z-40">
      <ul className="flex flex-col gap-3 text-sm">
        {navItems.map((item) => (
          <li key={item.name}>
            <button
              onClick={() => scrollToSection(item.href)}
              className={`transition-colors ${
                activeSection === item.href.slice(1)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              } ${item.name === "Hire Me" ? "text-blue-400 hover:text-blue-300 font-medium" : ""}`}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

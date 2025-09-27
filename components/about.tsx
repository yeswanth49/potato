"use client"

import { useEffect, useRef, useState } from "react"

export function About() {
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
    <section id="about" ref={ref} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">About</h2>
        </div>

        <div
          className={`transition-all duration-800 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <p className="mb-6">
              I'm a frontend-focused developer with entrepreneurial drive, passionate about building accessible,
              performant web applications. My expertise spans React.js, Next.js, Node.js, and REST APIs, with a strong
              foundation in modern web technologies.
            </p>

            <p className="mb-6">
              With experience in cloud databases (Supabase, PostgreSQL, MongoDB), API testing, automated UI testing, and
              production deployment, I bring a comprehensive approach to web development. I have a solid understanding
              of data structures and algorithms, open-source collaboration, and the complete journey from idea to
              production.
            </p>

            <p>
              Currently pursuing my Bachelor of Technology in Computer Science and Engineering at Pragati Engineering
              College, I combine academic knowledge with practical experience in building real-world applications that
              serve thousands of users.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

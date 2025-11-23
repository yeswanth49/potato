

import { Button } from "@/components/ui/button"

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto flex flex-col min-h-[400px]">
        <div className="motion-safe:animate-fade-in-up">
          <h2 id="about-heading" className="text-2xl md:text-3xl font-semibold mb-6 text-center">About</h2>
        </div>

        <div className="motion-safe:animate-fade-in-up motion-safe:animate-delay-200 flex-1 flex flex-col">
          <div className="prose max-w-none text-muted-foreground leading-relaxed flex-1">
            <p className="mb-4">
              I'm a frontend-focused developer with entrepreneurial drive, passionate about building accessible,
              performant web applications. My expertise spans React.js, Next.js, Node.js, and REST APIs, with a strong
              foundation in modern web technologies.
            </p>

            <p className="mb-4">
              With experience in cloud databases (Supabase, PostgreSQL, MongoDB), API testing, automated UI testing, and
              production deployment, I bring a comprehensive approach to web development. I have a solid understanding
              of data structures and algorithms, open-source collaboration, and the complete journey from idea to
              production.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

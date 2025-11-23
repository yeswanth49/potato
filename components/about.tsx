
import { Mail, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="px-4">
      <div className="max-w-3xl mx-auto">
        <div className="motion-safe:animate-fade-in-up">
          <h2 id="about-heading" className="text-2xl md:text-3xl font-semibold mb-6 text-center">About</h2>
        </div>

        <div className="motion-safe:animate-fade-in-up motion-safe:animate-delay-200">
          <div className="prose max-w-none text-muted-foreground leading-relaxed">
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
            <div className="motion-safe:animate-fade-in-up motion-safe:animate-delay-200">
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 group hover:bg-transparent hover:text-foreground transition-colors bg-transparent px-6"
                  asChild
                >
                  <a
                    href="https://x.com/yswnth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground group-hover:text-foreground/80">@yswnth</div>
                    </div>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

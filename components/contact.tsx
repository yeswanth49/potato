import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Mail, Phone } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" aria-label="Contact section" className="px-4">
      <div className="max-w-3xl mx-auto">
        <div className="motion-safe:animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Get In Touch</h2>
        </div>

        <div className="motion-safe:animate-fade-in-up motion-safe:animate-delay-200">
          <Card className="border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-xl mb-2">Let's Work Together</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                I'm always interested in discussing new opportunities, innovative projects, and collaborations. Feel
                free to reach out if you'd like to connect!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 group hover:bg-transparent hover:text-foreground transition-colors bg-transparent"
                  asChild
                >
                  <a href="mailto:work.yeswanth@gmail.com" className="flex items-center gap-3">
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Email</div>
                      <div className="text-xs text-muted-foreground group-hover:text-foreground/80">
                        work.yeswanth@gmail.com
                      </div>
                    </div>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 group hover:bg-transparent hover:text-foreground transition-colors bg-transparent"
                  asChild
                >
                  <a href="tel:9032690321" className="flex items-center gap-3">
                    <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Phone</div>
                      <div className="text-xs text-muted-foreground group-hover:text-foreground/80">9032690321</div>
                    </div>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 group hover:bg-transparent hover:text-foreground transition-colors bg-transparent"
                  asChild
                >
                  <a
                    href="https://github.com/yeswanth49"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-medium text-sm">GitHub</div>
                      <div className="text-xs text-muted-foreground group-hover:text-foreground/80">@yeswanth49</div>
                    </div>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 group hover:bg-transparent hover:text-foreground transition-colors bg-transparent"
                  asChild
                >
                  <a
                    href="https://www.linkedin.com/in/yeswanth-madasu-41525b297/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-medium text-sm">LinkedIn</div>
                      <div className="text-xs text-muted-foreground group-hover:text-foreground/80">@yeswanthm</div>
                    </div>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="motion-safe:animate-fade-in-up motion-safe:animate-delay-400">
          <div className="text-center mt-8 pt-6 border-t border-border">
            <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Yeswanth Madasu. Built with Next.js and Tailwind CSS.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

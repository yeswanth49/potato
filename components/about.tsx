

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const blogSeries = [
  {
    title: "Git 101 Series",
    posts: [
      { title: "Day 0/13 of Git 101 Series - Vocabulary and Mental Model", link: "https://yswnthm.medium.com/day-0-git-101-series-e03f3d9fcdc9" },
      { title: "Day 1/13 of Git 101 Series - What Git Actually is", link: "https://yswnthm.medium.com/day-1-13-of-git-101-series-d63b4a96fb5b" },
      { title: "Day 2/13 of Git 101 Series - Git vs Github, Installation", link: "https://yswnthm.medium.com/day-02-13-of-git-101-series-242f0c129ee3" },
    ]
  },
  {
    title: "Personal Drafts ~",
    posts: [
      { title: "things i admire the most.", link: "https://yswnth.bearblog.dev/things-i-admire-the-most/" },
      { title: "things i learnt meanwhile.", link: "https://yswnth.bearblog.dev/things-i-learnt-in-meanwhile/" },
    ]
  },
]

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
            <p className="mb-4">
              I do love writing, and write blogs
            </p>
            <div className="mt-8">
              <h3 className="font-medium mb-2"></h3>
              <Accordion type="single" collapsible className="w-full">
                {blogSeries.map((series, index) => (
                  <AccordionItem key={series.title} value={`item-${index}`} className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm hover:no-underline hover:text-primary justify-start gap-2">
                      <span>{series.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-1 pl-4 border-l border-border/40 ml-1 my-1">
                        {series.posts.map((post, postIndex) => (
                          <a
                            key={postIndex}
                            href={post.link}
                            className="block py-1 px-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {post.title}
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

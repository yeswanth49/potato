import { useEffect, useRef, useState } from 'react';

export function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // In test environment, show animations immediately
    if (process.env.NODE_ENV === 'test') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" aria-label="About section" className="px-4">
      <div className="max-w-3xl mx-auto">
        <div className={isVisible ? "motion-safe:animate-fade-in-up" : ""}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">About</h2>
        </div>

        <div className={isVisible ? "motion-safe:animate-fade-in-up motion-safe:animate-delay-200" : ""}>
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

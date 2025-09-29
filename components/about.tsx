'use client';

import { useEffect, useRef, useState } from 'react';

export function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Feature detection for IntersectionObserver
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" aria-labelledby="about-heading" className="px-4">
      <div className="max-w-3xl mx-auto">
        <div className={isVisible ? "animate-fade-in-up" : "opacity-0"}>
          <h2 id="about-heading" className="text-2xl md:text-3xl font-semibold mb-6 text-center">About</h2>
        </div>

        <div className={isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"}>
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

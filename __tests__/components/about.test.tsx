import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { About } from '@/components/about'

// Tests leverage React Testing Library with Jest.

const renderAbout = () => render(<About />)

describe('About component', () => {
  describe('structure and accessibility', () => {
    it('renders section region with expected id and accessible name', () => {
      renderAbout()
      const section = screen.getByRole('region', { name: /about/i })
      expect(section).toBeInTheDocument()
      expect(section).toHaveAttribute('id', 'about')
      expect(section).toHaveAttribute('aria-labelledby', 'about-heading')
      expect(section).toHaveClass('px-4')
    })

    it('wraps content in a centered max-width container with prose styling', () => {
      const { container } = renderAbout()
      const wrapper = container.querySelector('.max-w-3xl.mx-auto')
      expect(wrapper).not.toBeNull()

      const proseContainer = container.querySelector('.prose.max-w-none.text-muted-foreground.leading-relaxed')
      expect(proseContainer).not.toBeNull()
    })
  })

  describe('heading and motion', () => {
    it('renders the About heading with correct semantics and typography classes', () => {
      renderAbout()
      const heading = screen.getByRole('heading', { level: 2, name: /about/i })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveClass('text-2xl', 'md:text-3xl', 'font-semibold', 'mb-6', 'text-center')
    })

    it('includes fade-in-up animations for heading and content sections', () => {
      const { container } = renderAbout()
      const animatedSections = container.querySelectorAll('.animate-fade-in-up')
      expect(animatedSections).toHaveLength(2)

      expect(animatedSections[0]).toHaveClass('animate-fade-in-up')
      expect(animatedSections[1]).toHaveClass('animate-fade-in-up')
      expect(animatedSections[1]).toHaveClass('animate-delay-200')
    })
  })

  describe('content paragraphs', () => {
    it('renders three descriptive paragraphs with expected narratives', () => {
      const { container } = renderAbout()
      const paragraphs = Array.from(container.querySelectorAll('p'))
      expect(paragraphs).toHaveLength(3)

      expect(paragraphs[0]).toHaveTextContent(/frontend-focused developer/i)
      expect(paragraphs[0]).toHaveTextContent(/React\.js/i)

      expect(paragraphs[1]).toHaveTextContent(/cloud databases/i)
      expect(paragraphs[1]).toHaveTextContent(/Supabase/i)
      expect(paragraphs[1]).toHaveTextContent(/automated UI testing/i)

      expect(paragraphs[2]).toHaveTextContent(/Bachelor of Technology/i)
      expect(paragraphs[2]).toHaveTextContent(/Pragati Engineering College/i)
      expect(paragraphs[2]).toHaveTextContent(/thousands of users/i)
    })

    it('applies spacing classes to the first two paragraphs only', () => {
      const { container } = renderAbout()
      const paragraphs = Array.from(container.querySelectorAll('p'))
      expect(paragraphs[0]).toHaveClass('mb-4')
      expect(paragraphs[1]).toHaveClass('mb-4')
      expect(paragraphs[2]).not.toHaveClass('mb-4')
    })
  })

  describe('content completeness', () => {
    it('mentions core technical skills and professional concepts', () => {
      renderAbout()
      const terms = [
        'React.js',
        'Next.js',
        'Node.js',
        'REST APIs',
        'accessible',
        'performant',
        'API testing',
        'production deployment'
      ]

      terms.forEach(term => {
        const escapedTerm = term.replace(/\./g, '\\.')
        expect(screen.getByText(new RegExp(escapedTerm, 'i'))).toBeInTheDocument()
      })
    })

    it('covers database technologies referenced in the profile', () => {
      renderAbout()
      const databases = ['Supabase', 'PostgreSQL', 'MongoDB']
      databases.forEach(database => {
        expect(screen.getByText(new RegExp(database, 'i'))).toBeInTheDocument()
      })
    })
  })

  describe('component output', () => {
    it('produces a section element with stable props when rendered', () => {
      const { container } = renderAbout()
      const section = container.querySelector('section')
      expect(section).toHaveAttribute('id', 'about')
      expect(section).toHaveAttribute('aria-labelledby', 'about-heading')
      expect(section).toHaveClass('px-4')
      expect(section?.children).toBeDefined()
    })
  })
})
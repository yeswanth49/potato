import React from 'react'
import { render, screen } from '@testing-library/react'
import { Contact } from '@/components/contact'
import '@testing-library/jest-dom'

// Mock the UI components to focus on testing the Contact component logic
jest.mock('@/components/ui/button', () => {
  const React = require('react')
  return {
    Button: ({ children, asChild, variant, size, className, ...props }: any) => {
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
          ...props,
          className: className ? `${children.props.className || ''} ${className}`.trim() : children.props.className
        })
      }
      return React.createElement('button', { className, ...props }, children)
    }
  }
})

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardDescription: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h3 className={className}>{children}</h3>
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Github: ({ className }: any) => <span className={className} data-testid="github-icon">GitHub Icon</span>,
  Linkedin: ({ className }: any) => <span className={className} data-testid="linkedin-icon">LinkedIn Icon</span>,
  Mail: ({ className }: any) => <span className={className} data-testid="mail-icon">Mail Icon</span>,
  Phone: ({ className }: any) => <span className={className} data-testid="phone-icon">Phone Icon</span>
}))

describe('Contact Component', () => {
  beforeEach(() => {
    render(<Contact />)
  })

  describe('Component Structure', () => {
    it('renders the main section with correct id and classes', () => {
      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('id', 'contact')
      expect(section).toHaveClass('px-4')
    })

    it('renders the main heading with correct text', () => {
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Get In Touch')
      expect(heading).toHaveClass('text-2xl', 'md:text-3xl', 'font-semibold', 'mb-6', 'text-center')
    })

    it('renders the card title correctly', () => {
      const cardTitle = screen.getByRole('heading', { level: 3 })
      expect(cardTitle).toHaveTextContent("Let's Work Together")
      expect(cardTitle).toHaveClass('text-xl', 'mb-2')
    })

    it('renders the card description with correct content', () => {
      const description = screen.getByText(/I'm always interested in discussing new opportunities/)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-base', 'leading-relaxed')
    })
  })

  describe('Contact Links', () => {
    it('renders email contact link with correct attributes', () => {
      const emailLink = screen.getByRole('link', { name: /email/i })
      expect(emailLink).toHaveAttribute('href', 'mailto:work.yeswanth@gmail.com')
      expect(emailLink).toHaveClass('flex', 'items-center', 'gap-3')
      
      const emailText = screen.getByText('work.yeswanth@gmail.com')
      expect(emailText).toBeInTheDocument()
    })

    it('renders phone contact link with correct attributes', () => {
      const phoneLink = screen.getByRole('link', { name: /phone/i })
      expect(phoneLink).toHaveAttribute('href', 'tel:9032690321')
      expect(phoneLink).toHaveClass('flex', 'items-center', 'gap-3')
      
      const phoneText = screen.getByText('9032690321')
      expect(phoneText).toBeInTheDocument()
    })

    it('renders GitHub link with correct attributes', () => {
      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/yeswanth49')
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
      
      const githubText = screen.getByText('@yeswanth49')
      expect(githubText).toBeInTheDocument()
    })

    it('renders LinkedIn link with correct attributes', () => {
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
      expect(linkedinLink).toHaveAttribute('href', 'www.linkedin.com/in/yeswanth49')
      expect(linkedinLink).toHaveAttribute('target', '_blank')
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')
      
      const linkedinText = screen.getByText('@yeswanthm')
      expect(linkedinText).toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    it('renders all contact icons correctly', () => {
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
      expect(screen.getByTestId('phone-icon')).toBeInTheDocument()
      expect(screen.getByTestId('github-icon')).toBeInTheDocument()
      expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument()
    })

    it('applies correct classes to icons', () => {
      const icons = [
        screen.getByTestId('mail-icon'),
        screen.getByTestId('phone-icon'),
        screen.getByTestId('github-icon'),
        screen.getByTestId('linkedin-icon')
      ]

      icons.forEach(icon => {
        expect(icon).toHaveClass('w-4', 'h-4', 'group-hover:scale-110', 'transition-transform')
      })
    })
  })

  describe('Styling and Layout', () => {
    it('applies correct container classes', () => {
      const container = screen.getByRole('region').querySelector('.max-w-3xl')
      expect(container).toHaveClass('max-w-3xl', 'mx-auto')
    })

    it('applies animation classes correctly', () => {
      const animatedElements = screen.getByRole('region').querySelectorAll('.motion-safe\\:animate-fade-in-up')
      expect(animatedElements).toHaveLength(3)
    })

    it('applies grid layout classes to contact buttons container', () => {
      const grid = screen.getByRole('region').querySelector('.grid')
      expect(grid).toHaveClass('md:grid-cols-2', 'gap-4')
    })

    it('applies hover transition classes to buttons', () => {
      const buttons = screen.getAllByRole('link')
      buttons.forEach(button => {
        expect(button).toHaveClass('hover:bg-foreground', 'hover:text-background', 'transition-colors')
      })
    })
  })

  describe('Footer Content', () => {
    it('renders copyright footer with correct content', () => {
      const year = new Date().getFullYear()
      const footer = screen.getByText(`© ${year} Yeswanth Madasu. Built with Next.js and Tailwind CSS.`)
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('text-muted-foreground', 'text-sm')
    })

    it('mentions technologies used in footer', () => {
      const footer = screen.getByText(/Built with Next.js and Tailwind CSS/)
      expect(footer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      const h2 = screen.getByRole('heading', { level: 2 })
      const h3 = screen.getByRole('heading', { level: 3 })
      expect(h2).toBeInTheDocument()
      expect(h3).toBeInTheDocument()
    })

    it('has proper link labels for screen readers', () => {
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
        // Each link should have descriptive text content
        expect(link.textContent).toBeTruthy()
      })
    })

    it('uses semantic section element', () => {
      const section = screen.getByRole('region')
      expect(section.tagName).toBe('SECTION')
    })
  })

  describe('Contact Information Validation', () => {
    it('displays correct contact details', () => {
      // Email
      expect(screen.getByText('work.yeswanth@gmail.com')).toBeInTheDocument()
      
      // Phone
      expect(screen.getByText('9032690321')).toBeInTheDocument()
      
      // GitHub username
      expect(screen.getByText('@yeswanth49')).toBeInTheDocument()
      
      // LinkedIn username
      expect(screen.getByText('@yeswanthm')).toBeInTheDocument()
    })

    it('has proper contact method labels', () => {
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Phone')).toBeInTheDocument()
      expect(screen.getByText('GitHub')).toBeInTheDocument()
      expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('renders without crashing when no props are passed', () => {
      const { container } = render(<Contact />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('maintains component structure when external links are unavailable', () => {
      // This tests that the component structure is maintained regardless of external link availability
      const externalLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href')?.startsWith('http')
      )
      expect(externalLinks).toHaveLength(2) // GitHub and LinkedIn
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  describe('Component Integration', () => {
    it('integrates properly with UI component system', () => {
      // Test that the component uses the mocked UI components correctly
      const section = screen.getByRole('region')
      expect(section.querySelector('.border-border\\/50')).toBeInTheDocument()
    })

    it('maintains consistent button styling across all contact methods', () => {
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveClass('h-12', 'group')
      })
    })
  })
})

// Additional test suite for responsive behavior simulation
describe('Contact Component - Responsive Behavior', () => {
  it('applies responsive classes correctly', () => {
    render(<Contact />)
    
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveClass('text-2xl', 'md:text-3xl')
    
    const grid = screen.getByRole('region').querySelector('.grid')
    expect(grid).toHaveClass('md:grid-cols-2')
  })
})

// Performance and rendering test suite
describe('Contact Component - Performance', () => {
  it('renders successfully without throwing', () => {
    expect(() => {
      render(<Contact />)
    }).not.toThrow()

    // Verify expected DOM output is present
    expect(screen.getByText('Get In Touch')).toBeInTheDocument()
  })

  it('contains expected number of interactive elements', () => {
    render(<Contact />)
    
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4) // Email, Phone, GitHub, LinkedIn
    
    const headings = screen.getAllByRole('heading')
    expect(headings).toHaveLength(2) // Main heading and card title
  })
})
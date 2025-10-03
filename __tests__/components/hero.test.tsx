/**
 * Testing framework: Jest + React Testing Library.
 * No existing test setup was found in package.json. These tests are authored for Jest + RTL.
 * If your project uses Vitest instead, replace jest.mock(...) with vi.mock(...),
 * provide equivalent setup to include '@testing-library/jest-dom', and configure path aliases.
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// Helper to create icon mocks that forward all SVG props
const mockIcon = (testId: string) => {
  const IconComponent = (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid={testId} {...props} />
  )
  IconComponent.displayName = `MockIcon(${testId})`
  return IconComponent
}

// Mock external modules virtually to avoid alias resolution issues in tests.
jest.mock('lucide-react', () => ({
  ArrowDown: mockIcon('arrow-down-icon'),
  Github: mockIcon('github-icon'),
  Linkedin: mockIcon('linkedin-icon'),
  Twitter: mockIcon('twitter-icon'),
  FileText: mockIcon('file-text-icon'),
}), { virtual: true })

import { Hero } from '@/components/hero'

jest.mock('@/components/ui/button', () => {
  const React = require('react')
  return {
    Button: ({ children, asChild, variant, size, className, ...props }: any) => {
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
          ...props,
          'data-testid': 'hero-button',
          'data-variant': variant,
          'data-size': size,
          className: className ? `${children.props.className || ''} ${className}`.trim() : children.props.className
        })
      }
      return React.createElement('button', {
        'data-testid': 'hero-button',
        'data-variant': variant,
        'data-size': size,
        className,
        ...props
      }, children)
    }
  }
}, { virtual: true })

describe('Hero Component', () => {
  beforeEach(() => {
    render(<Hero />)
  })

  describe('Structure', () => {
    it('renders the section with correct id and classes', () => {
      const section = document.getElementById('hero') as HTMLElement
      expect(section).toBeInTheDocument()
      expect(section.tagName).toBe('SECTION')
      expect(section).toHaveClass('flex', 'items-center', 'justify-center', 'px-4')
    })

    it('contains a centered max width container', () => {
      const section = document.getElementById('hero') as HTMLElement
      const container = section.querySelector('.max-w-3xl') as HTMLElement
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('mx-auto', 'text-center')
    })
  })

  describe('Primary content', () => {
    it('renders main heading text', () => {
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent("Hi, I'm Yeswanth Madasu")
      expect(h1).toHaveClass('text-4xl', 'md:text-5xl', 'font-semibold', 'mb-3', 'text-balance')
    })

    it('renders subtitle', () => {
      const subtitle = screen.getByText('Full Stack Developer')
      expect(subtitle).toBeInTheDocument()
      expect(subtitle.tagName).toBe('P')
      expect(subtitle).toHaveClass('text-base', 'md:text-lg', 'text-muted-foreground', 'mb-4', 'text-balance')
    })

    it('renders description with both sentences', () => {
      const description = screen.getByText(/Frontend-focused developer/)
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent(/Frontend-focused developer building accessible/)
      expect(description).toHaveTextContent(/Focusing on building accessible/)
      expect(description).toHaveClass(
        'text-sm',
        'text-muted-foreground',
        'mb-8',
        'max-w-2xl',
        'mx-auto',
        'leading-relaxed',
        'text-pretty'
      )
    })
  })

  describe('Animation wrappers', () => {
    it('heading wrapper has fade-in classes', () => {
      const h1 = screen.getByRole('heading', { level: 1 })
      const wrapper = h1.parentElement as HTMLElement
      expect(wrapper).toHaveClass('opacity-0', 'animate-fade-in-up')
    })

    it('staggered delay on subtitle and description', () => {
      const subtitleWrapper = screen.getByText('Full Stack Developer').parentElement as HTMLElement
      expect(subtitleWrapper).toHaveClass('opacity-0', 'animate-fade-in-up', 'animate-delay-200')

      const descriptionWrapper = screen.getByText(/Frontend-focused developer/).parentElement as HTMLElement
      expect(descriptionWrapper).toHaveClass('opacity-0', 'animate-fade-in-up', 'animate-delay-300')
    })

    it('social container and CTA have delayed animations', () => {
      // Find the main social links container by looking for the flex container that contains all social links
      const socialLinks = screen.getAllByRole('link')
      const socialContainer = socialLinks[0].parentElement?.parentElement as HTMLElement
      expect(socialContainer).toHaveClass('opacity-0', 'animate-fade-in-up', 'animate-delay-400')

      const button = screen.getByTestId('hero-button')
      const buttonWrapper = button.parentElement as HTMLElement
      expect(buttonWrapper).toHaveClass('opacity-0', 'animate-fade-in-up', 'animate-delay-500')
    })
  })

  describe('Social links', () => {
    it('has external profile links with secure attributes', () => {
      const twitter = screen.getByRole('link', { name: /twitter/i })
      expect(twitter).toHaveAttribute('href', 'https://x.com/Yeshh49')
      expect(twitter).toHaveAttribute('target', '_blank')
      expect(twitter).toHaveAttribute('rel', 'noopener noreferrer')

      const github = screen.getByRole('link', { name: /github/i })
      expect(github).toHaveAttribute('href', 'https://github.com/yeswanth49')
      expect(github).toHaveAttribute('target', '_blank')
      expect(github).toHaveAttribute('rel', 'noopener noreferrer')

      const linkedin = screen.getByRole('link', { name: /linkedin/i })
      expect(linkedin).toHaveAttribute('href', 'www.linkedin.com/in/yeswanth49')
      expect(linkedin).toHaveAttribute('target', '_blank')
      expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')
    })


    it('resume link opens in new tab securely', () => {
      const resume = screen.getByRole('link', { name: /resume/i })
      expect(resume).toHaveAttribute('href', '/Yeswanth_Madasu.pdf')
      expect(resume).toHaveAttribute('target', '_blank')
      expect(resume).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('social links have expected classes', () => {
      const twitter = screen.getByRole('link', { name: /twitter/i })
      expect(twitter).toHaveClass(
        'group',
        'flex',
        'items-center',
        'gap-2',
        'text-muted-foreground',
        'hover:text-foreground',
        'transition-all',
        'duration-300',
        'ease-in-out'
      )
      const label = screen.getByText('Twitter')
      expect(label).toHaveClass(
        'max-w-0',
        'overflow-hidden',
        'group-hover:max-w-xs',
        'transition-all',
        'duration-300',
        'ease-in-out',
        'whitespace-nowrap'
      )
    })
  })

  describe('Icons', () => {
    it('renders all icons', () => {
      expect(screen.getByTestId('twitter-icon')).toBeInTheDocument()
      expect(screen.getByTestId('github-icon')).toBeInTheDocument()
      expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument()
      expect(screen.getByTestId('file-text-icon')).toBeInTheDocument()
    })

    it('applies correct dimensions on representative icons', () => {
      expect(screen.getByTestId('twitter-icon')).toHaveClass('w-5', 'h-5')
      expect(screen.getByTestId('github-icon')).toHaveClass('w-5', 'h-5')
    })
  })

  describe('CTA Button', () => {
    it('renders CTA with text and icon', () => {
      const button = screen.getByTestId('hero-button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent(/Explore My Work/)
      expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument()
    })

    it('applies variant/size and styling classes', () => {
      const button = screen.getByTestId('hero-button')
      expect(button).toHaveAttribute('data-variant', 'outline')
      expect(button).toHaveAttribute('data-size', 'sm')
      expect(button).toHaveClass('group', 'transition-colors', 'hover:bg-transparent', 'hover:text-foreground', 'bg-transparent')
    })

    it('contains anchor with correct href', () => {
      const link = screen.getByRole('link', { name: /explore my work/i })
      expect(link).toHaveAttribute('href', '#about')
    })

    it('icon has hover translate and transition classes', () => {
      const icon = screen.getByTestId('arrow-down-icon')
      expect(icon).toHaveClass('w-4', 'h-4', 'ml-2', 'group-hover:translate-y-0.5', 'transition-transform')
    })
  })

  describe('Responsive and animation class patterns', () => {
    it('heading and subtitle have responsive text classes', () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-4xl', 'md:text-5xl')
      expect(screen.getByText('Full Stack Developer')).toHaveClass('text-base', 'md:text-lg')
    })

    it('social links container has layout classes', () => {
      // Find the main social links container by looking for the flex container that contains all social links
      const socialLinks = screen.getAllByRole('link')
      const container = socialLinks[0].parentElement as HTMLElement
      expect(container).toHaveClass('flex', 'flex-wrap', 'items-center', 'justify-center', 'gap-6', 'mb-8')
    })

    it('every animated wrapper includes at least one animate-* class', () => {
      const animatedEls = (document.getElementById('hero') as HTMLElement).querySelectorAll('[class*="animate-"]')
      animatedEls.forEach(el => {
        const hasAnimate = Array.from(el.classList).some(c => c.startsWith('animate-'))
        expect(hasAnimate).toBe(true)
      })
    })
  })

  describe('Content sanity checks', () => {
    it('avoids placeholder text and maintains professional tone', () => {
      const text = (document.getElementById('hero') as HTMLElement).textContent || ''
      expect(text).not.toMatch(/lorem ipsum/i)
      expect(text).not.toMatch(/placeholder/i)
      expect(text).toMatch(/React and Next\.js/)
    })

  })
})

describe('Hero Snapshot', () => {
  it('matches DOM snapshot', () => {
    const { container } = render(<Hero />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
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
  Mail: mockIcon('mail-icon'),
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
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-11-23T13:04:16+05:30'))
    render(<Hero />)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Structure', () => {
    it('renders the section with correct id and classes', () => {
      const section = document.getElementById('hero') as HTMLElement
      expect(section).toBeInTheDocument()
      expect(section.tagName).toBe('SECTION')
      expect(section).toHaveClass('flex', 'items-center', 'justify-center', 'px-8')
    })

    it('contains a centered max width container', () => {
      const section = document.getElementById('hero') as HTMLElement
      const container = section.querySelector('.max-w-6xl') as HTMLElement
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('mx-auto')
    })
  })

  describe('Primary content', () => {
    it('renders main heading text', () => {
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent("hi, i'm yswnth.")
      expect(h1).toHaveClass('text-2xl', 'sm:text-3xl', 'md:text-6xl', 'lg:text-7xl', 'mb-1', 'md:mb-3', 'font-league_spartan', 'font-bold', 'leading-none')
    })

    it('renders subtitle', () => {
      const subtitle = screen.getByText(/been here for/)
      expect(subtitle).toBeInTheDocument()
      expect(subtitle.tagName).toBe('P')
      expect(subtitle).toHaveClass('text-xs', 'sm:text-sm', 'text-muted-foreground', 'mb-0', 'md:mb-6', 'leading-relaxed', 'text-pretty')
    })

    it('renders description', () => {
      const description = screen.getByText(/trying to learn everything, by breaking everything./)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass(
        'text-sm',
        'text-muted-foreground',
        'mb-0',
        'leading-relaxed',
        'text-pretty'
      )
    })
  })

  describe('Animation wrappers', () => {
    it('heading wrapper has fade-in classes', () => {
      const h1 = screen.getByRole('heading', { level: 1 })
      const wrapper = h1.parentElement as HTMLElement
      expect(wrapper).toHaveClass('opacity-0', 'animate-fade-in-up', 'animate-delay-200')
    })
  })

  describe('Social links', () => {
    it('has external profile links with secure attributes', () => {
      const xLink = screen.getByRole('link', { name: /x profile/i })
      expect(xLink).toHaveAttribute('href', 'https://x.com/Yeshh49')
      expect(xLink).toHaveAttribute('target', '_blank')
      expect(xLink).toHaveAttribute('rel', 'noopener noreferrer')

      const github = screen.getByRole('link', { name: /github/i })
      expect(github).toHaveAttribute('href', 'https://github.com/yeswanth49')
      expect(github).toHaveAttribute('target', '_blank')
      expect(github).toHaveAttribute('rel', 'noopener noreferrer')

      const linkedin = screen.getByRole('link', { name: /linkedin/i })
      expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/yeswanth49')
      expect(linkedin).toHaveAttribute('target', '_blank')
      expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')
    })


    it('mail link has correct href', () => {
      const mail = screen.getByRole('link', { name: /email/i })
      expect(mail).toHaveAttribute('href', 'mailto:work.yeswanth@gmail.com')
    })

    it('social links have expected classes', () => {
      const xLink = screen.getByRole('link', { name: /x profile/i })
      expect(xLink).toHaveClass(
        'group',
        'flex',
        'items-center',
        'text-muted-foreground',
        'transition-all',
        'duration-300',
        'ease-in-out'
      )
      expect(xLink).not.toHaveClass('hover:scale-110')
    })
  })

  describe('Icons', () => {
    it('renders all icons', () => {
      expect(screen.getByRole('img', { name: 'X' })).toBeInTheDocument()
      expect(screen.getByTestId('github-icon')).toBeInTheDocument()
      expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument()
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
    })

    it('applies correct dimensions on representative icons', () => {
      expect(screen.getByRole('img', { name: 'X' })).toHaveClass('w-4', 'h-4')
      expect(screen.getByTestId('github-icon')).toHaveClass('w-5', 'h-5')
    })
  })

  describe('Responsive and animation class patterns', () => {
    it('heading and subtitle have responsive text classes', () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-2xl', 'sm:text-3xl', 'md:text-6xl', 'lg:text-7xl')
      expect(screen.getByText(/been here for/)).toHaveClass('text-xs', 'sm:text-sm')
    })

    it('social links container has layout classes', () => {
      // Find the main social links container by looking for the flex container that contains the X link
      const xLink = screen.getByRole('link', { name: /x profile/i })
      const container = xLink.parentElement as HTMLElement
      expect(container).toHaveClass('flex', 'flex-wrap', 'items-center', 'justify-start', 'gap-4', 'md:gap-6', 'mb-8')
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
      expect(text).toMatch(/trying to learn everything/i)
    })

  })
})

describe('Hero Snapshot', () => {
  it('matches DOM snapshot', () => {
    const { container } = render(<Hero />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
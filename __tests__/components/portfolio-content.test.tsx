/**
 * Framework & library: Jest + React Testing Library (@testing-library/react, @testing-library/jest-dom)
 * Notes:
 * - The repository has no existing test setup detected; these tests assume a standard Jest + RTL environment.
 * - Path aliases (@/components/*) are mocked virtually to avoid needing Jest moduleNameMapper.
 * - Dynamic import behavior is controlled by mocking next/dynamic per test; we re-import the component with jest.isolateModules to apply overrides.
 */

import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// Virtual mocks for child components (path aliases)
jest.mock('@/components/navigation', () => ({
  __esModule: true,
  Navigation: jest.fn(() => <div data-testid="navigation">Navigation</div>),
}), { virtual: true })

jest.mock('@/components/hero', () => ({
  __esModule: true,
  Hero: jest.fn(() => <div data-testid="hero">Hero</div>),
}), { virtual: true })

jest.mock('@/components/about', () => ({
  __esModule: true,
  About: jest.fn(() => <div data-testid="about">About</div>),
}), { virtual: true })

jest.mock('@/components/experience', () => ({
  __esModule: true,
  Experience: jest.fn(() => <div data-testid="experience">Experience</div>),
}), { virtual: true })

jest.mock('@/components/projects', () => ({
  __esModule: true,
  Projects: jest.fn(() => <div data-testid="projects">Projects</div>),
}), { virtual: true })

jest.mock('@/components/skills', () => ({
  __esModule: true,
  Skills: jest.fn(() => <div data-testid="skills">Skills</div>),
}), { virtual: true })

jest.mock('@/components/contact', () => ({
  __esModule: true,
  Contact: jest.fn(() => <div data-testid="contact">Contact</div>),
}), { virtual: true })

jest.mock('@/components/hire-me', () => ({
  __esModule: true,
  HireMe: jest.fn(() => <div data-testid="hire-me">HireMe</div>),
}), { virtual: true })

// Mock Next.js dynamic loader (deterministic by default)
jest.mock('next/dynamic', () => {
  const impl = (importer: any, options: any) => {
    const Comp: any = () => <div data-testid="hire-me-dynamic">Dynamic HireMe</div>
    Comp.__dynamicOptions = options
    Comp.loading = options?.loading
    return Comp
  }
  const mock = jest.fn(impl)
  return mock
})

// Helper to import a fresh module after (re)configuring mocks
const importPortfolio = () => {
  let mod: any
  jest.isolateModules(() => {
    // Import after mocks are configured so top-level dynamic() runs with current impl
    mod = require('@/components/portfolio-content')
  })
  return mod as { PortfolioContent: React.FC }
}

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

describe('PortfolioContent - structure and composition', () => {
  it('uses next/dynamic with ssr disabled and a loading fallback', () => {
    const dynamic = require('next/dynamic') as jest.Mock
    expect(dynamic).toBeDefined()
    // Ensure clean slate, then import component to trigger top-level dynamic() call
    dynamic.mockClear()
    importPortfolio()

    expect(dynamic).toHaveBeenCalledTimes(1)
    const [, options] = dynamic.mock.calls[0]
    expect(options).toEqual(expect.objectContaining({ ssr: false, loading: expect.any(Function) }))
  })

  it('renders all sections in the expected order (happy path)', () => {
    const { PortfolioContent } = importPortfolio()
    const { container } = render(<PortfolioContent />)

    const expectedOrder = [
      'navigation',
      'hero',
      'about',
      'experience',
      'projects',
      'skills',
      'hire-me-dynamic',
      'contact',
    ]

    const nodes = Array.from(container.querySelectorAll('[data-testid]'))
    const actualOrder = nodes.map((n) => n.getAttribute('data-testid'))
    expect(actualOrder).toEqual(expectedOrder)

    // Sanity presence checks
    expectedOrder.forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument()
    })
  })

  it('applies Tailwind classes to the main container', () => {
    const { PortfolioContent } = importPortfolio()
    const { container } = render(<PortfolioContent />)
    const main = container.firstElementChild as HTMLElement
    expect(main).toHaveClass('relative')
    expect(main).toHaveClass('flex')
    expect(main).toHaveClass('flex-col')
  })
})

describe('PortfolioContent - dynamic loading states', () => {
  it('renders the loading skeleton structure and classes while loading', () => {
    const dynamic = require('next/dynamic') as jest.Mock
    dynamic.mockImplementation((_importer: any, options: any) => {
      // Always render the provided loading fallback
      return () => options.loading()
    })

    const { PortfolioContent } = importPortfolio()
    const { container } = render(<PortfolioContent />)

    const section = container.querySelector('#hire-me') as HTMLElement
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('px-4')

    const maxW = section.querySelector('.max-w-6xl') as HTMLElement
    expect(maxW).toBeInTheDocument()
    expect(maxW).toHaveClass('mx-auto')

    const pulse = maxW.querySelector('.animate-pulse') as HTMLElement
    expect(pulse).toBeInTheDocument()
    expect(pulse).toHaveClass('h-96', 'rounded-2xl', 'border', 'border-dashed', 'border-border/60', 'bg-muted/20', 'animate-pulse')
  })

  it('does not throw even if the dynamic import resolves to null', () => {
    const dynamic = require('next/dynamic') as jest.Mock
    dynamic.mockImplementation(() => {
      return () => null
    })

    const { PortfolioContent } = importPortfolio()
    expect(() => render(<PortfolioContent />)).not.toThrow()
  })
})

describe('PortfolioContent - child component interactions', () => {
  it('invokes each child section exactly once', () => {
    const navMod = require('@/components/navigation')
    const heroMod = require('@/components/hero')
    const aboutMod = require('@/components/about')
    const expMod = require('@/components/experience')
    const projMod = require('@/components/projects')
    const skillsMod = require('@/components/skills')
    const contactMod = require('@/components/contact')

    const { PortfolioContent } = importPortfolio()
    render(<PortfolioContent />)

    expect(navMod.Navigation).toHaveBeenCalledTimes(1)
    expect(heroMod.Hero).toHaveBeenCalledTimes(1)
    expect(aboutMod.About).toHaveBeenCalledTimes(1)
    expect(expMod.Experience).toHaveBeenCalledTimes(1)
    expect(projMod.Projects).toHaveBeenCalledTimes(1)
    expect(skillsMod.Skills).toHaveBeenCalledTimes(1)
    expect(contactMod.Contact).toHaveBeenCalledTimes(1)
  })

  it('passes no props to child components (empty props object)', () => {
    const navMod = require('@/components/navigation')
    const heroMod = require('@/components/hero')

    const { PortfolioContent } = importPortfolio()
    render(<PortfolioContent />)

    expect(navMod.Navigation).toHaveBeenCalledWith({}, {})
    expect(heroMod.Hero).toHaveBeenCalledWith({}, {})
  })

  it('bubbles render errors from child components', () => {
    const navMod = require('@/components/navigation')
    navMod.Navigation.mockImplementation(() => {
      throw new Error('Component failed')
    })

    const { PortfolioContent } = importPortfolio()
    expect(() => render(<PortfolioContent />)).toThrow('Component failed')
  })
})
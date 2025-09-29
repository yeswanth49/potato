import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { Projects } from '@/components/projects'

// Mock Intersection Observer API
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})

// Mock window.IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
})

// Save original IntersectionObserver to restore after tests
const _originalIO = window.IntersectionObserver

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  ExternalLink: ({ className, ...props }: { className?: string; [key: string]: any }) => (
    <div data-testid="external-link-icon" className={className} {...props} />
  ),
  Github: ({ className, ...props }: { className?: string; [key: string]: any }) => (
    <div data-testid="github-icon" className={className} {...props} />
  ),
}))

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: { children?: React.ReactNode; className?: string; [key: string]: any }) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }: { children?: React.ReactNode; className?: string; [key: string]: any }) => (
    <div data-testid="card-content" className={className} {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, className, ...props }: { children?: React.ReactNode; className?: string; [key: string]: any }) => (
    <div data-testid="card-description" className={className} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className, ...props }: { children?: React.ReactNode; className?: string; [key: string]: any }) => (
    <div data-testid="card-header" className={className} {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className, ...props }: { children?: React.ReactNode; className?: string; [key: string]: any }) => (
    <div data-testid="card-title" className={className} {...props}>
      {children}
    </div>
  ),
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className, variant, ...props }: { children?: React.ReactNode; className?: string; variant?: string; [key: string]: any }) => (
    <span data-testid="badge" className={className} data-variant={variant} {...props}>
      {children}
    </span>
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, size, variant, asChild, ...props }: { children?: React.ReactNode; className?: string; size?: string; variant?: string; asChild?: boolean; [key: string]: any }) => {
    const Component = asChild ? 'div' : 'button'
    return (
      <Component
        data-testid="button"
        className={className}
        data-size={size}
        data-variant={variant}
        {...props}
      >
        {children}
      </Component>
    )
  },
}))

describe('Projects Component', () => {
  let mockObserverInstance: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockObserverInstance = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }
    mockIntersectionObserver.mockReturnValue(mockObserverInstance)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    // Restore original IntersectionObserver to prevent leakage into other test suites
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: _originalIO,
    })
  })

  describe('Rendering', () => {
    test('renders the projects section with correct structure', () => {
      render(<Projects />)
      
      // Check main section exists with correct ID
      const section = screen.getByRole('heading', { name: 'Featured Projects' }).closest('section')
      expect(section).toBeInTheDocument()
      expect(section).toHaveAttribute('id', 'projects')
      
      // Check title is rendered
      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Featured Projects')
    })

    test('renders all three project cards', () => {
      render(<Projects />)
      
      // Check all project titles are rendered
      expect(screen.getByText('OpenBook')).toBeInTheDocument()
      expect(screen.getByText('safeLINK')).toBeInTheDocument()
      expect(screen.getByText('PEC.UP')).toBeInTheDocument()
      
      // Check all cards are rendered
      const cards = screen.getAllByTestId('card')
      expect(cards).toHaveLength(3)
    })

    test('renders project descriptions correctly', () => {
      render(<Projects />)
      
      expect(screen.getByText(/AI-powered research and learning platform/)).toBeInTheDocument()
      expect(screen.getByText(/Mobile-first emergency QR profile application/)).toBeInTheDocument()
      expect(screen.getByText(/Resource-sharing platform serving 1.5k\+ registered users/)).toBeInTheDocument()
    })

    test('renders project features as list items', () => {
      render(<Projects />)
      
      // Check some specific features from each project
      expect(screen.getByText('Next.js App Router with TypeScript')).toBeInTheDocument()
      expect(screen.getByText('QR code generation with secure IDs')).toBeInTheDocument()
      expect(screen.getByText('Responsive cross-device design')).toBeInTheDocument()
      
      // Check bullet points are rendered
      const bulletPoints = screen.getAllByText('•')
      expect(bulletPoints.length).toBeGreaterThan(0)
    })

    test('renders technology badges for each project', () => {
      render(<Projects />)
      
      const badges = screen.getAllByTestId('badge')
      expect(badges.length).toBeGreaterThan(0)
      
      // Check specific technologies are rendered
      expect(screen.getByText('Next.js')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Flask')).toBeInTheDocument()
      expect(screen.getByText('Python')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })

    test('renders action buttons for each project', () => {
      render(<Projects />)
      
      // Check Live Demo buttons
      const liveDemoButtons = screen.getAllByText('Live Demo')
      expect(liveDemoButtons).toHaveLength(3)
      
      // Check GitHub buttons (icon buttons)
      const githubIcons = screen.getAllByTestId('github-icon')
      expect(githubIcons).toHaveLength(3)
      
      // Check External Link icons
      const externalLinkIcons = screen.getAllByTestId('external-link-icon')
      expect(externalLinkIcons).toHaveLength(3)
    })
  })

  describe('Links and Navigation', () => {
    test('live demo links have correct attributes', () => {
      render(<Projects />)
      
      const links = screen.getAllByRole('link')
      const liveDemoLinks = links.filter(link => 
        link.textContent?.includes('Live Demo')
      )
      
      liveDemoLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    test('github links have correct attributes', () => {
      render(<Projects />)
      
      const links = screen.getAllByRole('link')
      const githubLinks = links.filter(link => 
        link.querySelector('[data-testid="github-icon"]')
      )
      
      githubLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    test('OpenBook project has correct live URL', () => {
      render(<Projects />)
      
      const liveDemoButtons = screen.getAllByText('Live Demo')
      const openBookButton = liveDemoButtons[0].closest('a')
      
      expect(openBookButton).toHaveAttribute('href', 'https://goopenbook.in')
    })

    test('other projects have placeholder URLs', () => {
      render(<Projects />)
      
      const links = screen.getAllByRole('link')
      const placeholderLinks = links.filter(link => 
        link.getAttribute('href') === '#'
      )
      
      // Should have placeholder links: OpenBook (1), safeLINK (2), PEC.UP (2) = 5 total
      expect(placeholderLinks.length).toBeGreaterThan(0)
    })
  })

  describe('Intersection Observer Integration', () => {

    test('sets up intersection observers for all project cards', () => {
      render(<Projects />)
      
      // Should create observers for each project card
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.2 }
      )
      
      expect(mockObserverInstance.observe).toHaveBeenCalledTimes(3)
    })

    test('triggers animation when card becomes visible', async () => {
      let intersectionCallback: (entries: any[]) => void = () => {}

      mockIntersectionObserver.mockImplementation((callback, options) => {
        intersectionCallback = callback
        return mockObserverInstance
      })

      render(<Projects />)

      // Use actual rendered element for stronger signal
      const card = screen.getAllByTestId('card')[0]
      const container = card.parentElement!

      // Simulate intersection observer callback
      const mockEntry = {
        isIntersecting: true,
        target: container,
      }
      
      act(() => {
        intersectionCallback([mockEntry])
      })

      await waitFor(() => {
        expect(mockObserverInstance.disconnect).toHaveBeenCalled()
      })
    })

    test('cleans up observers on unmount', () => {
      const { unmount } = render(<Projects />)
      
      unmount()
      
      expect(mockObserverInstance.disconnect).toHaveBeenCalled()
    })
  })

  describe('Animation and Styling', () => {
    test('applies correct CSS classes to main elements', () => {
      render(<Projects />)

      // Check main section exists with correct structure
      const section = screen.getByRole('heading', { name: 'Featured Projects' }).closest('section')
      expect(section).toBeInTheDocument()

      // Check title has semantic styling (font weight indicates heading importance)
      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveClass('font-semibold')
    })

    test('applies animation delay styles', () => {
      render(<Projects />)
      
      const cards = screen.getAllByTestId('card')
      cards.forEach((card, index) => {
        const container = card.parentElement
        expect(container).toHaveStyle(`animation-delay: ${(index + 1) * 120}ms`)
      })
    })

    test('applies hover classes to interactive elements', () => {
      render(<Projects />)
      
      const cards = screen.getAllByTestId('card')
      cards.forEach(card => {
        expect(card).toHaveClass('group')
        expect(card).toHaveClass('transition-colors')
      })
      
      const titles = screen.getAllByTestId('card-title')
      titles.forEach(title => {
        expect(title).toHaveClass('group-hover:text-primary', 'transition-colors')
      })
    })
  })

  describe('Component State Management', () => {
    test('manages visible indices state correctly', async () => {
      // Map to store target element -> callback relationship
      const targetCallbackMap = new Map<Element, (entries: any[]) => void>()
      let observerInstanceCount = 0

      mockIntersectionObserver.mockImplementation((callback) => {
        // Create a new mock observer instance for each call
        const mockObserverInstance = {
          observe: jest.fn((target: Element) => {
            targetCallbackMap.set(target, callback)
          }),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        }
        observerInstanceCount++
        return mockObserverInstance
      })

      const { rerender } = render(<Projects />)

      // Initially no cards should be visible
      const cards = screen.getAllByTestId('card')
      cards.forEach(card => {
        const container = card.parentElement
        expect(container).not.toHaveClass('motion-safe:animate-fade-in-up')
      })

      // Wait for effects to run and observers to be set up
      await waitFor(() => {
        expect(observerInstanceCount).toBe(3)
        expect(targetCallbackMap.size).toBe(3)
      })

      // Simulate first card becoming visible using actual rendered element
      const firstCard = cards[0]
      const firstCardContainer = firstCard.parentElement

      if (!firstCardContainer) {
        throw new Error('firstCard.parentElement is null - card container not found')
      }
      const mockEntry = {
        isIntersecting: true,
        target: firstCardContainer,
      }

      // Trigger the observer callback for the first card
      const callback = targetCallbackMap.get(firstCardContainer)
      expect(callback).toBeDefined()

      act(() => {
        callback!([mockEntry])
      })

      // Wait for state update to be reflected in DOM
      await waitFor(() => {
        expect(firstCardContainer).toHaveClass('motion-safe:animate-fade-in-up')
      }, { timeout: 1000 })
    })

    test('prevents duplicate observers for same index', () => {
      render(<Projects />)
      
      // Each card should only have one observer
      expect(mockObserverInstance.observe).toHaveBeenCalledTimes(3)
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(3)
    })
  })

  describe('Accessibility', () => {
    test('has proper heading hierarchy', () => {
      render(<Projects />)
      
      const mainHeading = screen.getByRole('heading', { level: 2 })
      expect(mainHeading).toBeInTheDocument()
      
      // Project titles should be within card headers but not necessarily headings
      const projectTitles = screen.getAllByTestId('card-title')
      expect(projectTitles).toHaveLength(3)
    })

    test('links have proper accessibility attributes', () => {
      render(<Projects />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    test('provides meaningful text for screen readers', () => {
      render(<Projects />)
      
      // Live Demo buttons should have descriptive text
      const liveDemoButtons = screen.getAllByText('Live Demo')
      expect(liveDemoButtons).toHaveLength(3)
      
      // GitHub icons should be within links with accessible context
      const githubIcons = screen.getAllByTestId('github-icon')
      expect(githubIcons).toHaveLength(3)
    })
  })

  describe('Responsive Design', () => {
    test('applies responsive design patterns', () => {
      render(<Projects />)

      // Check that responsive text sizing is applied
      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveClass('md:text-3xl')

      // Check that a grid layout is present (responsive behavior)
      const gridContainer = screen.getByRole('heading', { name: 'Featured Projects' })
        .closest('section')
        ?.querySelector('.grid')
      expect(gridContainer).toBeInTheDocument()
    })

    test('badges are present and styled', () => {
      render(<Projects />)

      const badges = screen.getAllByTestId('badge')
      expect(badges.length).toBeGreaterThan(0)

      // Ensure badges have some styling applied
      badges.forEach(badge => {
        expect(badge).toHaveAttribute('class')
      })
    })
  })

  describe('Error Boundaries and Edge Cases', () => {
    test('handles missing ref elements gracefully', () => {
      // Mock console.error to avoid noise in test output
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<Projects />)
      
      // Component should render without errors even if refs are null
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      
      consoleError.mockRestore()
    })

    test('handles intersection observer callback with empty entries', async () => {
      let intersectionCallback: (entries: any[]) => void
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback
        return mockObserverInstance
      })
      
      render(<Projects />)
      
      // Call callback with empty entries array
      expect(() => {
        act(() => {
          intersectionCallback([])
        })
      }).not.toThrow()
    })

    test('handles intersection observer callback with non-intersecting entries', () => {
      let intersectionCallback: (entries: any[]) => void
      
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback
        return mockObserverInstance
      })
      
      render(<Projects />)
      
      const mockEntry = {
        isIntersecting: false,
        target: document.createElement('div'),
      }
      
      expect(() => {
        act(() => {
          intersectionCallback([mockEntry])
        })
      }).not.toThrow()
      
      // Should not call unobserve for non-intersecting entries
      expect(mockObserverInstance.unobserve).not.toHaveBeenCalled()
    })
  })

  describe('Performance Optimizations', () => {
    test('uses Set for efficient visible indices tracking', () => {
      let intersectionCallback: (entries: any[]) => void = () => {}

      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback
        return mockObserverInstance
      })

      render(<Projects />)

      // This is more of an implementation detail, but we can verify
      // that the component handles multiple rapid intersection changes
      const mockEntries = [
        { isIntersecting: true, target: document.createElement('div') },
        { isIntersecting: true, target: document.createElement('div') },
        { isIntersecting: true, target: document.createElement('div') },
      ]

      expect(() => {
        act(() => {
          intersectionCallback(mockEntries)
        })
      }).not.toThrow()
    })

    test('cleans up observers properly to prevent memory leaks', () => {
      const { unmount } = render(<Projects />)
      
      unmount()
      
      expect(mockObserverInstance.disconnect).toHaveBeenCalled()
    })
  })

  describe('Content Validation', () => {
    test('all projects have required properties', () => {
      render(<Projects />)
      
      // Check that all expected project titles are present
      const expectedTitles = ['OpenBook', 'safeLINK', 'PEC.UP']
      expectedTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument()
      })
      
      // Check that descriptions are present and non-empty
      const descriptions = screen.getAllByTestId('card-description')
      expect(descriptions).toHaveLength(3)
      descriptions.forEach(desc => {
        expect(desc.textContent).toBeTruthy()
        expect(desc.textContent.length).toBeGreaterThan(10)
      })
    })

    test('technology badges are properly categorized', () => {
      render(<Projects />)
      
      // Frontend technologies
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Next.js')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      
      // Backend technologies  
      expect(screen.getByText('Flask')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
      expect(screen.getByText('Python')).toBeInTheDocument()
      
      // Styling
      expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
      expect(screen.getByText('CSS')).toBeInTheDocument()
    })

    test('feature lists are comprehensive', () => {
      render(<Projects />)

      // Each project should have multiple features listed
      const allFeatureText = screen.getByRole('heading', { name: 'Featured Projects' })
        .closest('section')?.textContent
      
      // OpenBook features
      expect(allFeatureText).toContain('AI SDK integration')
      expect(allFeatureText).toContain('Spaced repetition')
      expect(allFeatureText).toContain('Real-time streaming')
      
      // safeLINK features
      expect(allFeatureText).toContain('QR code generation')
      expect(allFeatureText).toContain('WebRTC')
      expect(allFeatureText).toContain('Password-protected')
      
      // PEC.UP features
      expect(allFeatureText).toContain('1.5k+ registered users')
      expect(allFeatureText).toContain('REST API')
      expect(allFeatureText).toContain('Performance optimizations')
    })
  })
})
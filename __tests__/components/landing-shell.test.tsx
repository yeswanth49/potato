/**
 * Tests for LandingShell
 * Framework: Jest + React Testing Library
 * Focus: timer-driven transitions, dynamic background rendering, cleanup
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LandingShell } from '@/components/landing-shell'

// Mock next/dynamic to return a simple test component immediately
jest.mock('next/dynamic', () => {
  return jest.fn(() => {
    // Component rendered when mainBackgroundMode === "keyboard"
    return function MockKeyboardBackgroundClient() {
      return <div data-testid="keyboard-background" />
    }
  })
})

// Mock KeyboardLanding to expose a trigger for onCorrectEntry and show backgroundMode
jest.mock('@/components/keyboard-landing', () => ({
  KeyboardLanding: ({ onCorrectEntry, backgroundMode }: any) => (
    <div data-testid="keyboard-landing">
      <button data-testid="correct-entry" onClick={onCorrectEntry}>
        Correct Entry
      </button>
      <span data-testid="landing-bg-mode">{String(backgroundMode)}</span>
    </div>
  ),
}))

// Mock cn to be deterministic
jest.mock('@/lib/utils', () => ({
  cn: (...classes: Array<string | false>) => classes.filter(Boolean).join(' '),
}))

const getChild = () => <div data-testid="portfolio-child">Portfolio Content</div>
const getLandingContainer = () => (screen.getByTestId('keyboard-landing').parentElement as HTMLElement)

describe('LandingShell - initial render behavior', () => {
  test('renders landing by default and hides portfolio', () => {
    render(<LandingShell>{getChild()}</LandingShell>)
    expect(screen.getByTestId('keyboard-landing')).toBeInTheDocument()
    expect(screen.queryByTestId('portfolio-root')).not.toBeInTheDocument()
    expect(screen.queryByTestId('portfolio-child')).not.toBeInTheDocument()
  })

  test('renders portfolio immediately when showLandingOnLoad=false', () => {
    render(<LandingShell showLandingOnLoad={false}>{getChild()}</LandingShell>)
    expect(screen.getByTestId('portfolio-root')).toBeInTheDocument()
    expect(screen.getByTestId('portfolio-child')).toBeInTheDocument()
    expect(screen.queryByTestId('keyboard-landing')).not.toBeInTheDocument()
  })
})

describe('LandingShell - keyboard landing visibility animation', () => {
  test('landing container fades in after 100ms', () => {
    jest.useFakeTimers()
    render(<LandingShell>{getChild()}</LandingShell>)
    const container = getLandingContainer()

    // Initially hidden
    expect(container).toHaveClass('opacity-0')
    expect(container).not.toHaveClass('animate-fade-in-keyboard')

    act(() => {
      jest.advanceTimersByTime(99)
    })
    expect(container).toHaveClass('opacity-0')

    act(() => {
      jest.advanceTimersByTime(1) // reach 100ms
    })
    expect(container).toHaveClass('animate-fade-in-keyboard')
    expect(container).not.toHaveClass('opacity-0')
  })
})

describe('LandingShell - transition to portfolio', () => {
  test('onCorrectEntry triggers fade-out then shows portfolio after 500ms', () => {
    jest.useFakeTimers()
    render(<LandingShell>{getChild()}</LandingShell>)

    // Trigger transition
    fireEvent.click(screen.getByTestId('correct-entry'))
    const container = getLandingContainer()
    expect(container).toHaveClass('animate-fade-out')

    // Not yet shown before 500ms
    act(() => {
      jest.advanceTimersByTime(499)
    })
    expect(screen.queryByTestId('portfolio-root')).not.toBeInTheDocument()

    // At 500ms, portfolio appears
    act(() => {
      jest.advanceTimersByTime(1)
    })
    const root = screen.getByTestId('portfolio-root')
    expect(root).toBeInTheDocument()
    expect(root).toHaveClass('animate-fade-in-portfolio')
    expect(screen.getByTestId('portfolio-child')).toBeInTheDocument()
    expect(screen.queryByTestId('keyboard-landing')).not.toBeInTheDocument()
  })

  test('portfolio transition class clears 700ms after showPortfolio', () => {
    jest.useFakeTimers()
    render(<LandingShell>{getChild()}</LandingShell>)
    fireEvent.click(screen.getByTestId('correct-entry'))

    // Show portfolio at 500ms
    act(() => {
      jest.advanceTimersByTime(500)
    })
    const root = screen.getByTestId('portfolio-root')
    expect(root).toHaveClass('animate-fade-in-portfolio')

    // Not cleared at 699ms after showPortfolio
    act(() => {
      jest.advanceTimersByTime(699)
    })
    expect(root).toHaveClass('animate-fade-in-portfolio')

    // Cleared at 700ms
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(root).not.toHaveClass('animate-fade-in-portfolio')
  })
})

describe('LandingShell - background modes', () => {
  test('passes backgroundMode to KeyboardLanding', () => {
    render(<LandingShell mainBackgroundMode="keyboard">{getChild()}</LandingShell>)
    expect(screen.getByTestId('landing-bg-mode')).toHaveTextContent('keyboard')
  })

  test('renders keyboard background in portfolio when mode is "keyboard"', () => {
    render(
      <LandingShell mainBackgroundMode="keyboard" showLandingOnLoad={false}>
        {getChild()}
      </LandingShell>,
    )
    expect(screen.getByTestId('keyboard-background')).toBeInTheDocument()
  })

  test('does not render keyboard background in dark mode', () => {
    render(
      <LandingShell mainBackgroundMode="dark" showLandingOnLoad={false}>
        {getChild()}
      </LandingShell>,
    )
    expect(screen.queryByTestId('keyboard-background')).not.toBeInTheDocument()
  })
})

describe('LandingShell - timer cleanup and robustness', () => {
  test('clears timers on unmount during landing phase', () => {
    jest.useFakeTimers()
    const spy = jest.spyOn(window, 'clearTimeout')
    const { unmount } = render(<LandingShell>{getChild()}</LandingShell>)
    unmount()
    expect(spy).toHaveBeenCalled()
  })

  test('clears transition timer on unmount during transition', () => {
    jest.useFakeTimers()
    const spy = jest.spyOn(window, 'clearTimeout')
    const { unmount } = render(<LandingShell>{getChild()}</LandingShell>)
    fireEvent.click(screen.getByTestId('correct-entry'))
    unmount()
    expect(spy).toHaveBeenCalled()
  })

  test('handles rapid multiple correct entries gracefully', () => {
    jest.useFakeTimers()
    render(<LandingShell>{getChild()}</LandingShell>)
    const btn = screen.getByTestId('correct-entry')
    fireEvent.click(btn)
    fireEvent.click(btn)
    fireEvent.click(btn)
    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(screen.getByTestId('portfolio-root')).toBeInTheDocument()
  })
})

describe('LandingShell - edge cases', () => {
  test('works with children when portfolio is shown immediately', () => {
    render(<LandingShell showLandingOnLoad={false}>{getChild()}</LandingShell>)
    expect(screen.getByTestId('portfolio-root')).toBeInTheDocument()
  })

  test('accepts unexpected backgroundMode value (runtime)', () => {
    // Type assertion only to simulate runtime invalid values
    render(<LandingShell mainBackgroundMode={'invalid' as any}>{getChild()}</LandingShell>)
    // Still renders landing and passes the value through to child
    expect(screen.getByTestId('keyboard-landing')).toBeInTheDocument()
    expect(screen.getByTestId('landing-bg-mode')).toHaveTextContent('invalid')
  })

  test('portfolio is rendered inside a <main> element with expected base classes', () => {
    render(<LandingShell showLandingOnLoad={false}>{getChild()}</LandingShell>)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('min-h-screen')
  })
})
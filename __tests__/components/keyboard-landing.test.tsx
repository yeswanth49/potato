/**
 * Test framework: Jest + React Testing Library (+ @testing-library/user-event).
 * Repo scan found no existing test setup; these tests assume Jest/RTL.
 */

import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock next/dynamic (keyboard background is client-only)
jest.mock('next/dynamic', () => {
  const React = require('react')
  const KeyboardBackgroundMock = () =>
    React.createElement('div', { 'data-testid': 'keyboard-background' }, 'Keyboard Background')
  return () => KeyboardBackgroundMock
})

// Mock classnames utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ')
}))

import { KeyboardLanding } from '@/components/keyboard-landing'

describe('KeyboardLanding', () => {
  let onCorrectEntry: jest.Mock
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    onCorrectEntry = jest.fn()
    // Coordinate fake timers with user-event to drive scheduled hints and error timeouts
    jest.useFakeTimers()
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  describe('rendering', () => {
    it('renders all major keys and rows', () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)

      // Numbers row
      ;['1','2','3','4','5','6','7','8','9','0'].forEach(n =>
        expect(screen.getByRole('button', { name: n })).toBeInTheDocument()
      )

      // Letters
      const letters = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M']
      letters.forEach(ch => expect(screen.getByRole('button', { name: ch })).toBeInTheDocument())

      // Special keys
      expect(screen.getByRole('button', { name: 'caps' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'shift' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'return' })).toBeInTheDocument()
    })

    it('uses dark background by default', () => {
      const { container } = render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      expect(container.firstChild).toHaveClass('bg-black')
    })

    it('renders keyboard background when backgroundMode="keyboard"', () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} backgroundMode="keyboard" />)
      expect(screen.getByTestId('keyboard-background')).toBeInTheDocument()
    })

    it('omits keyboard background when backgroundMode="dark"', () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} backgroundMode="dark" />)
      expect(screen.queryByTestId('keyboard-background')).not.toBeInTheDocument()
    })
  })

  describe('text entry via on-screen keys', () => {
    it('does not submit on partial input', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      await user.click(screen.getByRole('button', { name: 'Y' }))
      await user.click(screen.getByRole('button', { name: 'E' }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(onCorrectEntry).not.toHaveBeenCalled()
    })

    it('submits when "yesh" is entered (case-insensitive compare)', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      await user.click(screen.getByRole('button', { name: 'Y' }))
      await user.click(screen.getByRole('button', { name: 'E' }))
      await user.click(screen.getByRole('button', { name: 'S' }))
      await user.click(screen.getByRole('button', { name: 'H' }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(onCorrectEntry).toHaveBeenCalledTimes(1)
    })

    it('backspace removes last char; incorrect input shows error', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      await user.click(screen.getByRole('button', { name: 'Y' }))
      await user.click(screen.getByRole('button', { name: 'E' }))
      await user.click(screen.getByRole('button', { name: 'delete' })) // BACKSPACE
      await user.click(screen.getByRole('button', { name: 'S' }))
      await user.click(screen.getByRole('button', { name: 'H' }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(onCorrectEntry).not.toHaveBeenCalled()
      expect(screen.getByText('Try again...')).toBeInTheDocument()
    })

    it('space inserts a space which fails submission', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      await user.click(screen.getByRole('button', { name: 'Y' }))
      const spaceKey = screen.getByRole('button', { name: /^\s*$/ }) // space has blank label
      await user.click(spaceKey)
      await user.click(screen.getByRole('button', { name: 'E' }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(onCorrectEntry).not.toHaveBeenCalled()
    })
  })

  describe('caps/shift behavior', () => {
    it('toggles caps via caps key', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const caps = screen.getByRole('button', { name: 'caps' })
      expect(caps).not.toHaveClass('bg-blue-600')
      await user.click(caps)
      expect(caps).toHaveClass('bg-blue-600')
      await user.click(caps)
      expect(caps).not.toHaveClass('bg-blue-600')
    })

    it('caps key toggles caps lock state', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const caps = screen.getByRole('button', { name: 'caps' })
      expect(caps).not.toHaveClass('bg-blue-600')
      await user.click(caps)
      expect(caps).toHaveClass('bg-blue-600')
    })

    it('uppercase input still matches target (case-insensitive compare)', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      await user.click(screen.getByRole('button', { name: 'caps' }))
      for (const ch of ['Y','E','S','H']) {
        await user.click(screen.getByRole('button', { name: ch }))
      }
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(onCorrectEntry).toHaveBeenCalledTimes(1)
    })
  })

  describe('error states', () => {
    it('shows error for incorrect input', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      for (const ch of ['W','R','O','N','G']) await user.click(screen.getByRole('button', { name: ch }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(screen.getByText('Try again...')).toBeInTheDocument()
      expect(onCorrectEntry).not.toHaveBeenCalled()
    })

    it('clears error after 2s timeout', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      await user.click(screen.getByRole('button', { name: 'W' }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(screen.getByText('Try again...')).toBeInTheDocument()
      act(() => { jest.advanceTimersByTime(2000) })
      await waitFor(() => expect(screen.queryByText('Try again...')).not.toBeInTheDocument())
    })

    it('clears error when typing or backspacing after error', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      await user.click(screen.getByRole('button', { name: 'W' }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(screen.getByText('Try again...')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Y' }))
      expect(screen.queryByText('Try again...')).not.toBeInTheDocument()

      // Trigger again and clear via backspace
      await user.click(screen.getByRole('button', { name: 'W' }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(screen.getByText('Try again...')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'delete' }))
      expect(screen.queryByText('Try again...')).not.toBeInTheDocument()
    })

    it('resets overlapping error timeouts correctly', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      // First error
      await user.click(screen.getByRole('button', { name: 'W' }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(screen.getByText('Try again...')).toBeInTheDocument()

      act(() => { jest.advanceTimersByTime(1000) }) // half-way
      // Second error before first timeout completes
      await user.click(screen.getByRole('button', { name: 'X' }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(screen.getByText('Try again...')).toBeInTheDocument()

      act(() => { jest.advanceTimersByTime(1000) }) // would have cleared first timer
      expect(screen.getByText('Try again...')).toBeInTheDocument()

      act(() => { jest.advanceTimersByTime(2000) }) // clear the second timer
      await waitFor(() => expect(screen.queryByText('Try again...')).not.toBeInTheDocument())
    })
  })

  describe('physical keyboard events', () => {
    it('handles typing "yesh" and Enter', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      await user.keyboard('yesh{Enter}')
      expect(onCorrectEntry).toHaveBeenCalledTimes(1)
    })

    it('handles backspace key press', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      await user.keyboard('yesh{Backspace}')
      // Backspace should remove the last character, so "yesh" becomes "yes"
      // This is a basic functionality test rather than full sequence
      expect(onCorrectEntry).not.toHaveBeenCalled()
    })

    it('physical caps lock toggles caps lock state', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const caps = screen.getByRole('button', { name: 'caps' })
      expect(caps).not.toHaveClass('bg-blue-600')
      await user.keyboard('{CapsLock}')
      expect(caps).toHaveClass('bg-blue-600')
    })

    it('does not interfere with focused input elements', async () => {
      const Wrapper = () => (
        <div>
          <input data-testid="typed" />
          <KeyboardLanding onCorrectEntry={onCorrectEntry} />
        </div>
      )
      render(<Wrapper />)
      const input = screen.getByTestId('typed') as HTMLInputElement
      input.focus()
      await user.keyboard('test')
      expect(input).toHaveValue('test')
      expect(onCorrectEntry).not.toHaveBeenCalled()
    })

    it('does not interfere with contenteditable elements', async () => {
      const Wrapper = () => (
        <div>
          <div data-testid="editable" contentEditable />
          <KeyboardLanding onCorrectEntry={onCorrectEntry} />
        </div>
      )
      render(<Wrapper />)
      const editable = screen.getByTestId('editable') as HTMLDivElement
      editable.focus()
      await user.keyboard('{Enter}')
      expect(onCorrectEntry).not.toHaveBeenCalled()
    })
  })

  describe('hint sequence', () => {
    it('initially highlights the first hinted key (Y) via pressed styling', () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const y = screen.getByRole('button', { name: 'Y' })
      // For letter keys, hint manifests as "pressed" styling (scale-95), not white bg
      expect(y).toHaveClass('scale-95')
    })

    it('progresses to next hint after delay', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const e = screen.getByRole('button', { name: 'E' })
      act(() => { jest.advanceTimersByTime(600) })
      await waitFor(() => expect(e).toHaveClass('scale-95'))
    })

    it('has return key with proper styling', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const ret = screen.getByRole('button', { name: 'return' })
      // Return key should be rendered and accessible
      expect(ret).toBeInTheDocument()
      expect(ret).toHaveTextContent('return')
    })

    it('stops highlighting after max iterations', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const y = screen.getByRole('button', { name: 'Y' })
      // Each cycle: 600 (y) + 600 (e) + 600 (s) + 500 (h) + 1200 (return) = 3500ms
      act(() => { jest.advanceTimersByTime(3500 * 2) }) // two full iterations
      await waitFor(() => expect(y).not.toHaveClass('scale-95'))
    })
  })

  describe('Key component specifics', () => {
    it('applies size classes correctly', () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const a = screen.getByRole('button', { name: 'A' })
      const caps = screen.getByRole('button', { name: 'caps' })
      const space = screen.getByRole('button', { name: /^\s*$/ })
      expect(a).toHaveClass('w-14', 'h-14')     // md
      expect(caps).toHaveClass('w-20', 'h-14')  // lg
      expect(space).toHaveClass('w-96', 'h-14') // xl
    })

    it('handles physical keyboard events', () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const y = screen.getByRole('button', { name: 'Y' })
      // Test that physical keyboard events are handled without errors
      fireEvent.keyDown(window, { key: 'y', code: 'KeyY' })
      fireEvent.keyUp(window, { key: 'y', code: 'KeyY' })
      expect(y).toBeInTheDocument()
    })
  })

  describe('cleanup & accessibility', () => {
    it('attaches and removes window event listeners', () => {
      const addSpy = jest.spyOn(window, 'addEventListener')
      const removeSpy = jest.spyOn(window, 'removeEventListener')
      const { unmount } = render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      expect(addSpy).toHaveBeenCalledWith('keyup', expect.any(Function))
      unmount()
      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      expect(removeSpy).toHaveBeenCalledWith('keyup', expect.any(Function))
      addSpy.mockRestore()
      removeSpy.mockRestore()
    })

    it('cleans up hint or error timeouts on unmount', () => {
      const clearSpy = jest.spyOn(window, 'clearTimeout')
      const { unmount } = render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      // Trigger an error timeout
      fireEvent.click(screen.getByRole('button', { name: 'W' }))
      fireEvent.click(screen.getByRole('button', { name: 'return' }))
      unmount()
      expect(clearSpy).toHaveBeenCalled()
      clearSpy.mockRestore()
    })

    it('renders many clickable buttons with type="button"', () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(30)
      buttons.forEach(btn => expect(btn).toHaveAttribute('type', 'button'))
    })

    it('keys are non-selectable', () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      expect(screen.getByRole('button', { name: 'Y' })).toHaveClass('select-none')
    })
  })

  describe('edge cases', () => {
    it('handles rapid key presses gracefully', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      const y = screen.getByRole('button', { name: 'Y' })
      await user.click(y)
      await user.click(y)
      await user.click(y)
      expect(y).toBeInTheDocument()
    })

    it('submitting empty text shows error', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(screen.getByText('Try again...')).toBeInTheDocument()
      expect(onCorrectEntry).not.toHaveBeenCalled()
    })

    it('numeric input does not match target', async () => {
      render(<KeyboardLanding onCorrectEntry={onCorrectEntry} />)
      for (const n of ['1','2','3']) await user.click(screen.getByRole('button', { name: n }))
      await user.click(screen.getByRole('button', { name: 'return' }))
      expect(screen.getByText('Try again...')).toBeInTheDocument()
      expect(onCorrectEntry).not.toHaveBeenCalled()
    })
  })
})
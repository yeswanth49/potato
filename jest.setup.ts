// jest.setup.ts
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  private callback: IntersectionObserverCallback;
  private options: IntersectionObserverInit;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options || {};
  }

  observe(element: Element) {
    // Immediately trigger intersection for testing
    const entry: IntersectionObserverEntry = {
      target: element,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRect: element.getBoundingClientRect(),
      rootBounds: null,
      time: Date.now(),
    };
    this.callback([entry], this as any);
  }

  disconnect() {
    return null;
  }

  unobserve() {
    return null;
  }
};

// Shared mock functions for Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockPrefetch = jest.fn();
let mockSearchParams = new URLSearchParams();
let mockPathname = '/';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
  })),
  useSearchParams: jest.fn(() => mockSearchParams),
  usePathname: jest.fn(() => mockPathname),
}));

afterEach(() => {
  jest.clearAllMocks();
  mockSearchParams = new URLSearchParams();
  mockPathname = '/';
});

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

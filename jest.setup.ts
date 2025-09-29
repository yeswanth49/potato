// jest.setup.ts
import '@testing-library/jest-dom';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
const mockObserve = jest.fn()
const mockDisconnect = jest.fn()
const mockUnobserve = jest.fn()

const MockIntersectionObserver = class IntersectionObserver {
  private callback: IntersectionObserverCallback;
  private options: IntersectionObserverInit;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options || {};
    // Call the jest mock to track constructor calls
    mockIntersectionObserver(callback, options);
  }

  observe(element: Element) {
    mockObserve(element);
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
    mockDisconnect();
    return null;
  }

  unobserve() {
    mockUnobserve();
    return null;
  }
};

// Make the mock available globally for tests
;(global as any).mockIntersectionObserver = mockIntersectionObserver;
;(global as any).mockObserve = mockObserve;
;(global as any).mockDisconnect = mockDisconnect;
;(global as any).mockUnobserve = mockUnobserve;
global.IntersectionObserver = MockIntersectionObserver as any;

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

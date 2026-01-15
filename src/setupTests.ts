import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const originalGetComputedStyle = window.getComputedStyle;
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: (element: Element) => {
    try {
      return originalGetComputedStyle(element);
    } catch {
      return {
        getPropertyValue: () => '',
        paddingLeft: '0',
        paddingRight: '0',
        paddingTop: '0',
        paddingBottom: '0',
        marginLeft: '0',
        marginRight: '0',
        marginTop: '0',
        marginBottom: '0',
        borderLeftWidth: '0',
        borderRightWidth: '0',
        borderTopWidth: '0',
        borderBottomWidth: '0',
        width: '0',
        height: '0',
        overflow: 'visible',
        position: 'static',
        display: 'block',
      } as unknown as CSSStyleDeclaration;
    }
  },
});

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn((...args: any[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';

    if (
      message.includes('Not implemented: window.getComputedStyle') ||
      message.includes('An update to') ||
      message.includes('inside a test was not wrapped in act')
    ) {
      return;
    }

    originalError.call(console, ...args);
  });

  console.warn = jest.fn((...args: any[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';

    if (
      message.includes('An update to') ||
      message.includes('inside a test was not wrapped in act')
    ) {
      return;
    }

    originalWarn.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

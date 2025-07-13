import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Custom render function that includes Router
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Test data helpers
export const createMockDomain = (overrides = {}) => ({
  id: 1,
  domain: 'example.com',
  alias: 'test',
  enabled: true,
  comment: 'Test domain',
  metadata: {
    openssl: {
      cert: {
        not_before: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        not_after: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    netscaler: {
      dev: {
        clientcertnotbefore: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        clientcertnotafter: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  },
  ...overrides,
});

export const createMockDomainsList = (count = 3) => 
  Array.from({ length: count }, (_, i) => createMockDomain({
    id: i + 1,
    domain: `example${i + 1}.com`,
  })); 
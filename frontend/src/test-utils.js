import React, { useState } from 'react';
import { render } from '@testing-library/react';
import { AppContext } from './context/AppContextProvider';

const defaultUser = { id: 123, upi: 'ata434', name: 'claire donald' };
// pass in default context with user for tests
const Providers = ({ children }) => {
  const [user, setUser] = useState(defaultUser);
  return <AppContext.Provider value={{ user, setUser }}>{children}</AppContext.Provider>;
};
// over load custom render method to include provider and router
const customRender = (ui, options) => render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';

export { customRender as render };

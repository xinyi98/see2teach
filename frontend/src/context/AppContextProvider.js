import React, { useContext } from 'react';
import { createContext, useState } from 'react';

export const AppContext = createContext();

/**
 * Use this hook to use the user context in the application
 * @returns Context containing {user, setUser}
 */
export function useAppContext() {
  return useContext(AppContext);
}

/**
 * This provider contains the user information. Wrap around APp.
 * @param {*} param0 Children that will be placed between provider
 * @returns JSX of the provider
 */
export function AppContextProvider({ children }) {
  const [user, setUser] = useState({
    id: window.sessionStorage.getItem('user_id'),
    name: window.sessionStorage.getItem('name'),
    upi: window.sessionStorage.getItem('upi'),
  });

  return <AppContext.Provider value={{ user, setUser }}>{children}</AppContext.Provider>;
}

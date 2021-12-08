import { useMediaQuery } from 'react-responsive';

export const useDefaultMediaQuery = () => useMediaQuery({ query: '(min-width: 768px)' });
export const useMobileMediaQuery = () => useMediaQuery({ query: '(max-width: 480px)' });
export const useTabletAndBelowMediaQuery = () => useMediaQuery({ query: '(max-width: 767px)' });

export const Mobile = ({ children }) => {
  const isMobile = useMobileMediaQuery();
  return isMobile ? children : null;
};

export const Default = ({ children }) => {
  const isNotMobile = useDefaultMediaQuery();
  return isNotMobile ? children : null;
};

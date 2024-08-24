import React, { createContext, useContext, useEffect, useState } from 'react';

const WindowWidthContext = createContext();

export const WindowWidthProvider = ({ children }) => {
  const [isSmallerDevice, setIsSmallerDevice] = useState(false);

  useEffect(() => {
    const checkWindowSize = () => {
      setIsSmallerDevice(window.innerWidth < 500);
    };

    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);

    return () => window.removeEventListener('resize', checkWindowSize);
  }, []);

  return (
    <WindowWidthContext.Provider value={{ isSmallerDevice }}>
      {children}
    </WindowWidthContext.Provider>
  );
};

export const useWindowWidth = () => {
  return useContext(WindowWidthContext);
};

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';

const useMobileScreen = () => {
  const { breakpoints } = useTheme();
  const [width, setWidth] = useState(breakpoints.values.lg);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return width <= breakpoints.values.md;
};

export default useMobileScreen;

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';

export interface Mobile {
  md: boolean;
  sm: boolean;
  mobile: boolean;
}

// chromium gibt im mobile mode falsche breite, es kommt hier 600+ an obwohl < 600 eingestellt und angezeigt wird

const useMobileScreen = (): Mobile => {
  const { breakpoints } = useTheme();

  const [medium, setMedium] = useState(true);
  const [small, setSmall] = useState(true);

  useEffect(() => {
    function checkMobileSize(width: number) {
      setMedium(width < breakpoints.values.lg);
      setSmall(width < breakpoints.values.sm);
    }
    // initial checken
    checkMobileSize(window.innerWidth);

    // beim resize nochmal checken
    const handleWindowSizeChange = () => {
      checkMobileSize(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, [breakpoints.values.lg, breakpoints.values.sm]);

  return { md: medium, sm: small, mobile: small || medium };
};

export default useMobileScreen;

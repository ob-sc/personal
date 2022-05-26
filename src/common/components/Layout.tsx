import { Box, Container } from '@mui/material';
import { ParsedUser } from 'src/common/types/server';
import { CProps } from 'src/common/types/client';
import NoAccess from 'src/common/components/NoAccess';
import CenteredSpinner from 'src/common/components/CenteredSpinner';
import Navbar from 'src/common/components/Navbar';
import log from 'src/common/utils/log';

interface Props extends CProps {
  session?: ParsedUser;
  loading?: boolean;
  blockAccess?: boolean;
  flex?: boolean;
  grid?: boolean;
  cols?: number; // grid muss true sein
}

/**
 * Navbar und Container mit Laden-Spinner, Nachricht über fehlende Berechtigungen oder content.
 */
function Layout({
  session,
  loading,
  blockAccess,
  flex,
  grid,
  cols,
  children,
}: Props) {
  const style = {
    pb: 2,
  };

  if (cols !== undefined && grid !== true) {
    log.warn('Layout: cols hat Wert aber grid ist nicht true');
  }

  const flexStyle = {
    display: 'flex',
    flexFlow: 'column nowrap',
    gap: 2,
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols ?? 2}, 1fr)`,
  };

  const styles = [style, flex ? flexStyle : null, grid ? gridStyle : null];

  return (
    <>
      <Navbar session={session} />
      <Container component="main" maxWidth="lg" sx={styles}>
        {loading ? (
          // brauche height, weil der spinner sonst overflow erzeugt
          <Box sx={{ height: 150 }}>
            <CenteredSpinner size="3rem" />
          </Box>
        ) : blockAccess ? (
          <NoAccess />
        ) : (
          children
        )}
      </Container>
    </>
  );
}

export default Layout;

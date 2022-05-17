import { Box, Container } from '@mui/material';
import { ParsedUser } from 'src/common/types/server';
import { CProps } from 'src/common/types/client';
import NoAccess from 'src/common/components/NoAccess';
import CenteredSpinner from 'src/common/components/CenteredSpinner';
import Navbar from 'src/common/components/Navbar';

interface Props extends CProps {
  session?: ParsedUser;
  loading?: boolean;
  blockAccess?: boolean;
}

const style = {
  // overflowX: 'hidden',
  pb: 2,
};

/**
 * Navbar und Container mit Laden-Spinner, Nachricht über fehlende Berechtigungen oder content.
 */
function Layout({ session, loading, blockAccess, children }: Props) {
  return (
    <>
      <Navbar session={session} />
      <Container component="main" maxWidth="lg" sx={style}>
        {loading ? (
          // brauche height weil der spinner sonst overflow erzeugt
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

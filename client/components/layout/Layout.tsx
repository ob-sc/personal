import { Box, Container } from '@mui/material';
import { CProps } from 'types/client';
import { ParsedUser } from 'types/server';
import NoAccess from 'client/components/common/NoAccess';
import Navbar from 'client/components/layout/Navbar';
import CenteredSpinner from 'client/components/common/CenteredSpinner';

interface Props extends CProps {
  session?: ParsedUser;
  loading?: boolean;
  blockAccess?: boolean;
}

const style = { overflowX: 'hidden', pb: 2 };

/**
 * Navbar und Container mit Laden-Spinner, Nachricht über fehlende Berechtigungen oder content.
 */
function Layout({ session, loading, blockAccess, children }: Props) {
  return (
    <>
      <Navbar session={session} />
      <Container component="main" maxWidth="lg" sx={style}>
        {loading ? (
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

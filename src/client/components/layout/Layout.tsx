import { Container } from '@mui/material';
import { CProps } from '../../../../types/client';
import { ParsedUser } from '../../../../types/server';
import CenteredSpinner from '../common/CenteredSpinner';
import Navbar from './Navbar';
import NoAccess from './NoAccess';

interface Props extends CProps {
  session?: ParsedUser;
  loading?: boolean;
}

function Layout({ session, loading, children }: Props) {
  return (
    <>
      <Navbar session={session} />
      <Container component="main" maxWidth="lg">
        {loading ? (
          <CenteredSpinner />
        ) : session?.stations[0] === 0 && session?.access < 1 ? (
          <NoAccess />
        ) : (
          children
        )}
      </Container>
    </>
  );
}

export default Layout;

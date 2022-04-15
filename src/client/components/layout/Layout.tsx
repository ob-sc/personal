import { Container } from '@mui/material';
import { CProps } from '../../../../types';
import { ParsedUser } from '../../../../types/user';
import CenteredSpinner from '../common/CenteredSpinner';
import Navbar from './Navbar';

interface Props extends CProps {
  session?: ParsedUser;
  loading?: boolean;
}

const Layout = ({ session, loading, children }: Props) => (
  <>
    <Navbar session={session} />
    <Container component="main" maxWidth="lg">
      {loading ? <CenteredSpinner /> : children}
    </Container>
  </>
);

export default Layout;

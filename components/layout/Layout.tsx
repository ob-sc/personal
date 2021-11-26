import { Container } from '@mui/material';
import { CProps } from '../../types';
import { Session } from '../../types/api';
import Navbar from './Navbar';

interface Props extends CProps {
  session: Session;
}

const Layout = ({ session, children }: Props) => (
  <>
    <Navbar session={session} />
    <Container component="main" maxWidth="lg">
      {children}
    </Container>
  </>
);

export default Layout;

import { Container } from '@mui/material';
import { CProps } from '../../../../types';
import { Session } from '../../../../types/user';
import Navbar from './Navbar';

interface Props extends CProps {
  session: Session;
}

const Layout = ({ session, children }: Props) => (
  <>
    <Navbar session={session} />
    <Container component="main" maxWidth="xl">
      {children}
    </Container>
  </>
);

export default Layout;

import { Container } from '@mui/material';
import { CProps } from '../../../../types';
import { ParsedUser } from '../../../../types/user';
import Navbar from './Navbar';

interface Props extends CProps {
  session: ParsedUser;
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

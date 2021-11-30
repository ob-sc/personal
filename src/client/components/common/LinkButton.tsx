import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { CProps } from '../../../../types';
import Link from './Link';

interface Props extends CProps {
  href: string;
}

const LinkButton = ({ href, children }: Props) => {
  const router = useRouter();

  const current = router.pathname.indexOf(href);

  return (
    <Button
      variant="text"
      color={current === -1 ? 'secondary' : 'primary'}
      component={Link}
      href={href}
      sx={{ mx: 1 }}
    >
      {children}
    </Button>
  );
};

export default LinkButton;

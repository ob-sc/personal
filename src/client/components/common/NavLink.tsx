import { useRouter } from 'next/router';
import { CProps } from '../../../../types/client';
import Link from './Link';

interface Props extends CProps {
  href: string;
}

function NavLink({ href, children }: Props) {
  const router = useRouter();

  const current = router.pathname.indexOf(href);

  return (
    <Link
      href={href}
      color={current === -1 ? 'secondary' : 'primary'}
      sx={{
        textDecoration: 'none',
        fontWeight: 500,
        mx: 2,
        '&:hover': { color: 'primary.dark' },
      }}
    >
      {children}
    </Link>
  );
}

export default NavLink;

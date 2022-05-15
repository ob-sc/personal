import { useRouter } from 'next/router';
import { CProps } from 'src/common/types/client';
import Link from 'src/common/components/Link';

interface Props extends CProps {
  href: string;
}

const style = {
  fontWeight: 500,
  mx: 2,
  '&:hover': { color: 'primary.dark' },
};

function NavLink({ href, children }: Props) {
  const router = useRouter();

  const current = router.pathname.indexOf(href);

  return (
    <Link
      href={href}
      color={current === -1 ? 'secondary' : 'primary'}
      sx={style}
      underline="none"
    >
      {children}
    </Link>
  );
}

export default NavLink;

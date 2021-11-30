import Image from 'next/image';
import { MouseEventHandler } from '../../../../types';
import styles from '../../styles/Logo.module.css';

interface Props {
  clickHandler: MouseEventHandler;
}

const Logo = ({ clickHandler }: Props) => (
  <Image
    width="64px"
    height="64px"
    src="/favicon.ico"
    alt="logo"
    onClick={clickHandler}
    className={styles.logo}
  />
);

export default Logo;

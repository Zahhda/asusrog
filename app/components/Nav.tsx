import Link from 'next/link';
import Image from 'next/image';
import rogLogo from '../../ROG logo_red.png';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link className="brand" href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src={rogLogo} alt="ROG" width={90} height={90} />
        </Link>
        <div className="spacer" />
        <Link className="cta" href="/contact">Contact Us</Link>
      </div>
    </nav>
  );
}



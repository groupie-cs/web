import Link from 'next/link'

const Navbar = () => {
    return (
        <nav>
                <Link href="/filter">
                    <a>filters</a>
                </Link>
                <Link href="/groups">
                    <a>groups</a>
                </Link>
                <Link href="/invite">
                    <a>invite</a>
                </Link>
        </nav>
    );
  };
  
  export default Navbar;
  
  
  
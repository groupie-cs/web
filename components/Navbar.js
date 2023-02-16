import Link from 'next/link'

const Navbar = () => {
    return (
        <nav>
                <Link href="/filter">
                    filters
                </Link>
                <Link href="/groups">
                    groups
                </Link>
                <Link href="/invite">
                    invite
                </Link>
        </nav>
    );
  };
  
  export default Navbar;
  
  
  
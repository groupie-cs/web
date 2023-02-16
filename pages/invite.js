import Link from 'next/link'
import Navbar from '../components/Navbar'

const InvitePage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div></div>
      <h1>Invite Page</h1>
      <Link href="/groups">
        Previous
      </Link>
    </div>
  )
}

export default InvitePage
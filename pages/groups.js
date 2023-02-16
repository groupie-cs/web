import Link from 'next/link'
import Navbar from '../components/Navbar'

const GroupsPage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div></div>
      <h1>Groups Page</h1>
      <Link href="/filter">
        <a>Previous</a>
      </Link>
      <div></div>
      <Link href="/invite">
        <a>Next</a>
      </Link>
    </div>
  )
}

export default GroupsPage
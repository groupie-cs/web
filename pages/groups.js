import Link from 'next/link'
import Navbar from '../components/Navbar'

const GroupsPage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div></div>
      <h1>Groups Page</h1>
      <Link href="/filter">
        Previous
      </Link>
      <div></div>
      <Link href="/invite">
        Next
      </Link>
    </div>
  )
}

export default GroupsPage
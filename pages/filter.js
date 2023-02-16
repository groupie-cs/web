import Link from 'next/link'
import Navbar from '../components/Navbar'

const FilterPage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div></div>
      <h1>Filters</h1>
      <div></div>
      <Link href="/groups">
        <a>Next</a>
      </Link>
    </div>
  )
}

export default FilterPage
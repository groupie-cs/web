import Link from 'next/link'

const FilterPage = () => {
  return (
    <div>
      <nav>
        <button >
        <Link href="/filter">
        <a>filters</a>
      </Link>
        </button>
        <button >
        <Link href="/groups">
        <a>groups</a>
      </Link>
        </button>
        <button >
        <Link href="/invite">
        <a>invite</a>
      </Link>
        </button>
      </nav>
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
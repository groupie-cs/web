import Link from 'next/link'

const GroupsPage = () => {
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
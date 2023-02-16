import Link from 'next/link'

const InvitePage = () => {
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
      <h1>Invite Page</h1>
      <Link href="/groups">
        <a>Previous</a>
      </Link>
    </div>
  )
}

export default InvitePage
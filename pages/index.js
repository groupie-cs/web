// import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from '../components/Account'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()


  async function signInWithSpotify() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        scopes: 'user-top-read',
        redirectTo: window.location.origin
      }
    })

  }
  
  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? (
        <div>
          <button onClick={signInWithSpotify}>
            Spotify Login
          </button>
        </div>
      ) : (
        <Account session={session} />
      )}
    </div>
  )
}




export default Home
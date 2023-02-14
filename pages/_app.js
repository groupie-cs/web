import '../styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import '@/styles/globals.css'
import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })

function MyApp({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <main className={inter.className}>
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SessionContextProvider>
    </main>
  )
}
export default MyApp
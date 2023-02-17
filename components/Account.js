import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import styles from '@/styles/Home.module.css'
import { Spotify } from '../components/Spotify'

export default function Account({ session }) {
    const supabase = useSupabaseClient()
    const user = useUser()
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [artistData, setArtistData] = useState(false)
    const spotify = new Spotify()

    useEffect(() => {
        getProfile()
    }, [session])


    async function getProfile() {
        try {
            setLoading(true)

            const { provider_token, user } = session
            const userId = user.user_metadata.user_name

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url, artists`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }

            if (data.artists == null) {
                console.log("Testing...")
                updateProfile({ username, website, avatar_url, session })
            }

            const artistData = await spotify.getTopArtists(session)
            setArtistData(artistData)

        } catch (error) {
            alert('Error loading user data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({ username, website, avatar_url, session }) {
        try {
            setLoading(true)

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date().toISOString(),
                artists: artistData
            }

            let { error } = await supabase.from('profiles').upsert(updates)
            if (error) throw error

            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.main}>
            <div>
                <label className={styles.label} htmlFor="email">Email</label>
                <input id="email" type="text" value={session.user.email} disabled />
            </div>
            <div>
                <label className={styles.label} htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label className={styles.label} htmlFor="website">Website</label>
                <input
                    id="website"
                    type="website"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <div>
                <button
                    className={styles.button}
                    onClick={() => updateProfile({ username, website, avatar_url, session })}
                    disabled={loading}
                >
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <button className={styles.button} onClick={() => supabase.auth.signOut()}>
                    Sign Out
                </button>
            </div>
            Your Top Artists
            <div className={styles.app}>
                <div className={styles.hs}>
                {artistData && artistData.items.map((artist) => {
                    return (
                        <div className={styles.card} key={artist.id}>
                            <h2>{artist.name}</h2>
                            <img className={styles.artistimg} src={artist.images[1].url} alt={artist.name} />
                        </div>
                    )
                })}
                </div>
            </div>

        </div>
    )
}
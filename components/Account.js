import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import styles from '@/styles/Home.module.css'
import { Spotify } from '../components/Spotify'
import { Ticketmaster } from './Ticketmaster'
import ArtistData from './ArtistData'
import ConcertData from './ConcertData'
import Filter from './filter'


export default function Account({ session }) {
    const supabase = useSupabaseClient()
    const user = useUser()
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [artistData, setArtistData] = useState(false)
    const [recData, setRecData] = useState(false)
    const spotify = new Spotify()
    const ticketmaster = new Ticketmaster()
    const [activeComponent, setActiveComponent] = useState('artistData')

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
            const topGenres = spotify.getTopGenres(artistData, 4)
            console.log(topGenres)
            const recs = await ticketmaster.getConcerts("Chicago", topGenres)
            setRecData(recs)
            console.log(recs)

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

    function handlePrevClick() {
        if (activeComponent === 'artistData') {
          setActiveComponent('artistData')
        } else if (activeComponent === 'concertData') {
          setActiveComponent('artistData')
        } else {
          setActiveComponent('concertData')
        }
      }

      function handleNextClick() {
        if (activeComponent === 'artistData') {
          setActiveComponent('concertData')
        } else if (activeComponent === 'concertData') {
          setActiveComponent('filter')
        } else {
          setActiveComponent('filter')
        }
      }

    return (
        <div className={styles.main}>
            {/* <div>
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
    */}
            <div className={styles.right}>
                <div className={styles.description}>
                    <p onClick={() => supabase.auth.signOut()}>
                        Sign Out
                    </p>
                </div>
            </div>

            {/* <div className={styles.center}>
                <div className={styles.app}>
                    <Filter></Filter>
                </div>
            </div> */}

            {/* add arrow buttons */}

        {activeComponent === 'artistData' && <ArtistData artistData={artistData} />}
        {activeComponent === 'concertData' && <ConcertData recData={recData} />}
        {/* {activeComponent === 'filter' && <Filter />} */}

        <div>
            <button onClick={handlePrevClick}><i className="arrow left"></i></button>
            <button onClick={handleNextClick}><i className="arrow right"></i></button>
        </div>

        </div>
    )
}
import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import styles from '@/styles/Home.module.css'
import { Spotify } from '../api/Spotify'
import { Ticketmaster } from '../api/Ticketmaster'
import ArtistData from './ArtistData'
import ConcertData from './ConcertData'

export default function Cycler({ session }) {
    const supabase = useSupabaseClient()
    const user = useUser()
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [artistData, setArtistData] = useState(false)
    const [recData, setRecData] = useState(false)
    const [group_id, setGroupId] = useState(null)
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
                .select(`username, website, avatar_url, artists, group_id`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
                setGroupId(data.group_id)
            }

            if (data.artists == null) {
                console.log("Testing...")
                updateProfile({ username, website, avatar_url, session })
            }

            const artistData = await spotify.getTopArtists(session)
            setArtistData(artistData)
            const topGenres = spotify.getTopGenres(artistData, 10)
            console.log(topGenres)
            // remove empty strings from topGenres
            for (let i = 0; i < topGenres.length; i++) {
                if (topGenres[i] == "") {
                    topGenres.splice(i, 1)
                }
            }
            console.log(topGenres)
            
            const recs = await ticketmaster.getConcerts("Chicago", topGenres)
            setRecData(recs)

            console.log(recs)

            // remove any recs from recs if there are two with the same name
            for (let i = 0; i < recs._embedded.events.length; i++) {
                console.log("in the looper")
                for (let j = i + 1; j < recs._embedded.events.length; j++) {
                    if (recs._embedded.events[i].name == recs._embedded.events[j].name) {
                        console.log("in the if")
                        recs._embedded.events.splice(j, 1)
                    }
                }
            }

            console.log(recs)

            
           if (group_id != null) {

                let { data, error} = await supabase
                .from('groups')
                .select(`concert_recs`)
                .eq('group_id', group_id)
                .single()

                if (error) throw error;

                setRecData(data.concert_recs)
           }

            

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
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.right}>
                <div className={styles.description}>
                    <p onClick={() => supabase.auth.signOut()}>
                        Sign Out
                    </p>
                </div>
            </div>

            {activeComponent === 'artistData' && <ArtistData artistData={artistData} session={session}/>}
            {activeComponent === 'concertData' && <ConcertData recData={recData} session={session} groupId={group_id}/>}

            {activeComponent != 'concertData' && <div>
                <button onClick={handlePrevClick}><i className="arrow left"></i></button>
                <button onClick={handleNextClick}><i className="arrow right"></i></button>
            </div>}

        </div>
    )
}
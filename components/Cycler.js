import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import styles from '@/styles/Home.module.css'
import { Spotify } from '../api/Spotify'
import { Ticketmaster } from '../api/Ticketmaster'
import ArtistData from './ArtistData'
import ConcertData from './ConcertData'
import UserSelect from './UserSelect'
import { countGenres } from './utils';

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
    const [genres, setGenres] = useState(null)


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
            setGenres(countGenres(topGenres));

            

            // const recs = await ticketmaster.getConcerts("Chicago", genres)
            // setRecData(recs)

            // console.log(recs)


            // console.log(recs)

           if (user.id != null && topGenres != null) {
            let { error } = await supabase
                    .from('profiles')
                    .update({
                        genre_list: topGenres
                    })
                    .eq('id', user.id)


                    if (error) throw error;
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
                    <UserSelect supabase={supabase} username={username} user ={user} avatar_url={avatar_url}></UserSelect>
                </div>
            </div>

            {activeComponent === 'artistData' && <ArtistData artistData={artistData} session={session}/>}
            {activeComponent === 'concertData' && <ConcertData recData={recData} session={session} groupId={group_id} genres={genres}/>}

            {activeComponent != 'concertData' && <div>
                <button onClick={handleNextClick} className={styles.createButton}>See Concerts</button>
            </div>}
        </div>
    )
}
import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import styles from '@/styles/Home.module.css'
import { Spotify } from '../components/Spotify'
import { v4 as uuidv4 } from 'uuid';

export default function Account({ session }) {
    const supabase = useSupabaseClient()
    const user = useUser()
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [group_id, setGroupId] = useState(null)
    const [groupData, setGroupData] = useState(null)
    const [groupDataIsHere, setGroupDataIsHere] = useState(null)
    const [artistData, setArtistData] = useState(false)
    const [inviteLink, setInviteLink] = useState('')
    const [isAdmin, setIsAdmin] = useState(null)


    useEffect(() => {
        getProfile()
        console.log("getting Profile")
    }, [session])

    useEffect(() => {
        const inviteId = localStorage.getItem('inviteLink')
        if (inviteId) {
            console.log("Adding to Group")
            setIsAdmin(false)
            addToGroup(inviteId)
        } else {
            
            console.log("You are a group owner")
            console.log(group_id)
            setIsAdmin(true)

             async function getGroup(groupId) {
                try {
                    setLoading(true)
                    if (groupId) {
                        const { data: users, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('group_id', groupId)

                        if(error) console.log(error)
                        else {
                            setGroupData(users)
                            setGroupDataIsHere(true)
                            console.log(groupDataIsHere)
                        }
                    }

                } catch (error) {
                    alert('Error Getting Group!')
                    console.log(error)
                } finally {
                    setLoading(false)
                } 
            
            }
            getGroup(group_id)
        }
    }, [group_id, session])


    async function removeUser(userId) {
        try {
            setLoading(true)

            const { data, error } = await supabase
                .from('profiles')
                .update({ group_id: ""})
                .eq('id', userId)
            if (error) throw error

            alert('Profile updated!')
      
          } catch (error) {
            alert('Error updating the data!')
            console.log(error)
          } finally {
            setLoading(false)
          }
    }



    async function addToGroup(inviteId) {
        try {
            setLoading(true)

            const userUpdate = {
                id: user.id,
                updated_at: new Date().toISOString(),
                group_id: inviteId,
                is_group_admin: false
              }
  
              let { newError } = await supabase.from('profiles').upsert(userUpdate)
              if (newError) throw newError

            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function generateInviteLink() {
        try {
            setLoading(true)
      
            const uuid = uuidv4();
            console.log(user.id)
            
            const newGroup = {
                group_id: uuid,
                inserted_at: new Date().toISOString(),
                admin_id: user.id
            }

            let { error } = await supabase.from('groups').upsert(newGroup)
            if (error) throw error
      
            const userUpdate = {
              id: user.id,
              updated_at: new Date().toISOString(),
              group_id: uuid,
              is_group_admin: true
            }

            let { newError } = await supabase.from('profiles').upsert(userUpdate)
            if (newError) throw newError

            alert('Profile updated!')
      
          // Set the state to the new invite link and redirect the user
            setInviteLink(uuid);
      
          } catch (error) {
            alert('Error updating the data!')
            console.log(error)
          } finally {
            setLoading(false)
          }
    }


    async function getProfile() {
        try {
            setLoading(true)

            const { provider_token, user } = session
            const userId = user.user_metadata.user_name
            console.log("Getting Profile Data")
            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url, artists, group_id`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                console.log("Throwing Error")
                throw error
            }


            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
                setGroupId(data.group_id)
            }
            console.log("Set Profile Data")
        } catch (error) {
            alert('Error loading user data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({ username, website, avatar_url, session}) {
        try {
            setLoading(true)

            const spotify = new Spotify()
            const artistData = await spotify.getTopArtists(session)
            setArtistData(artistData)
            console.log(artistData)
            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date().toISOString(),
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




if(group_id != null && groupDataIsHere && groupData != null) {
    //console.log("not null")
    //console.log(groupData)
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
                {isAdmin ? (
                    <button
                        className={styles.button}
                        onClick={() => generateInviteLink()}
                        disabled={loading}
                    >
                        {loading ? 'Loading ...' : 'Generate Invite Link'}
                    </button>
                ) : null}
                {inviteLink && (
                    <p>
                        Share this link with your friends: <a href={`http://localhost:3000/`}>{`http://localhost:3000/?inviteId=${inviteLink}`}</a>
                    </p>
                )}
            </div>
        
            <div>
                <button className={styles.button} onClick={() => supabase.auth.signOut()}>
                    Sign Out
                </button>
            </div>
            Your Top Artists
            <div className={styles.grid}>
            {artistData && artistData.items.map((artist) => {
                return (
                    <div key={artist.id}>
                        <div className={styles.card}>
                            <h2>{artist.name}</h2>
                            <img className={styles.artistImage} src={artist.images[0].url} alt={artist.name} />
                        </div>
                    </div>
                )
            })}
            </div>
            Your Group
           
            <div className={styles.grid}>
            {groupData && groupData.map((member) => {
                return (
                    <div key={member.id}>
                        <div className={styles.card}>
                            <h2>{member.username}</h2>
                            <img className={styles.artistImage} src={member.avatar_url} alt={`${member.username}'s avatar`} />
                            <button onClick={() => removeUser(member.id)}>Remove</button>
                        </div>
                    </div>
                )
            })}
            </div>
                
           
        </div>
    )
}
}
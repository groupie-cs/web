import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import styles from '@/styles/Home.module.css'
import { v4 as uuidv4 } from 'uuid';

export default function LandingPage({session}) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [inviteLink, setInviteLink] = useState('');
  const [userId, setUserId] = useState(null)



  useEffect(() => {
      getProfile()
  }, [session])


  async function getProfile() {
    try {
      setLoading(true)
      const { user } = session

      let { data, error, status } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUserId(data.id)
      }
      console.log('In getProfile()' + userId)
    } catch (error) {
        alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }


  async function generateInviteLink({userUuid}) {
    try {
      setLoading(true)

      const uuid = uuidv4();
      console.log(userUuid)

      const { data, error } = await supabase
        .from('groups')
        .insert([{
          group_id: uuid,
          inserted_at: new Date().toISOString(),
          admin_id: userUuid,
        }])

      if (error) throw error

      const userUpdate = {
        id: userUuid,
        updated_at: new Date().toISOString(),
        group_id: uuid
      }

      let { newError } = await supabase.from('profiles').upsert(userUpdate)
      if (newError) throw newError

    // Set the state to the new invite link and redirect the user
      setInviteLink(uuid);

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
        <button
          className={styles.button}
          onClick={() => generateInviteLink({userId})}
          disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </button>
          {inviteLink && (
        <p>
          Share this link with your friends: <a href={`http://localhost:3000/`}>{`http://localhost:3000/invite/${inviteLink}`}</a>
        </p>
      )}
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import styles from '@/styles/Home.module.css'
import { v4 as uuidv4 } from 'uuid';

export default function LandingPage({session}) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)



  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
      generateInviteLink()
  }, [session])

  async function generateInviteLink() {
    try {
      setLoading(true)
      const user = await session
      const uuid = uuidv4();
      

      const { data, error } = await supabase
        .from('groups')
        .insert([{
          group_id: uuid,
          inserted_at: new Date().toISOString(),
          //admin_id: user.id,
        }])

      if (error) throw error

      // const userUpdate = {
      //   id: user.id,
      //   updated_at: new Date().toISOString(),
      //   group_id: uuid
      // }

      //let { newError } = await supabase.from('profiles').upsert(userUpdate)
      //if (newError) throw newError

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
    <div>
      <h1>Welcome to the landing page!</h1>
      <button onClick={generateInviteLink}>Generate invite link</button>
      {inviteLink && (
        <p>
          Share this link with your friends: <a href={`http://localhost:3000/invite/${inviteLink}`}>{`http://localhost:3000/invite/${inviteLink}`}</a>
        </p>
      )}
    </div>
  );
}


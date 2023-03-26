import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import styles from '@/styles/Home.module.css'

import { v4 as uuidv4 } from 'uuid';

export default function GroupData( {session, groupId, recs} ) {
    const supabase = useSupabaseClient()
    const user = useUser()
    const [loading, setLoading] = useState(true)

    const [group_id, setGroupId] = useState(null)
    const [groupData, setGroupData] = useState(null)
    const [groupDataIsHere, setGroupDataIsHere] = useState(null)

    const [inviteLink, setInviteLink] = useState('')
    const [isAdmin, setIsAdmin] = useState(null)

    useEffect(() => {
        const inviteId = localStorage.getItem('inviteLink')
        setGroupId(groupId)
        console.log("GroupID " + groupId)
        console.log("Session " + session)
        console.log(groupId)
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

            console.log(user.id)
            console.log(userId)

            const { data: userData, error: currentError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)

            if (currentError) throw currentError

            const currentUser = userData[0]

            if (currentUser.updated_by.includes(user.id)) {
                
                const userGroup = currentUser.group_id

                const userUpdate = {
                    id: userId,
                    updated_at: new Date().toISOString(),
                    is_group_admin: false,
                    group_id: null
                }

                // TRIED TO USE array_remove but It didnt work !!!
                // const { newError } = await supabase
                // .from('groups')
                // .update({ members: supabase.sql`array_remove(members, ${user.id})` })
                // .eq('group_id', userGroup)

                // if ( newError ) throw newError


                // Updated Method:

                const { data: groupData, newError } = await supabase
                    .from('groups')
                    .select('members')
                    .eq('group_id', userGroup)
                    .single();

                if (newError) throw newError

                const newMembersArray = groupData.members.filter((uuid) => uuid !== userId);

                const { error: updateError } = await supabase
                    .from('groups')
                    .update({members: newMembersArray})
                    .eq('group_id', userGroup);

                if (updateError) throw updateError
                
                const { data, error } = await supabase
                    .from('profiles')
                    .update(userUpdate)
                    .eq('id', userId)

                if (error) throw error

            }
            

            alert("User Removed!")
      
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
            
            const { data, firstError } = await supabase
                .from('groups')
                .select('admin_id')
                .eq('group_id', inviteId)
                .single();
            if (firstError) throw firstError



            const userUpdate = {
                id: user.id,
                updated_at: new Date().toISOString(),
                group_id: inviteId,
                is_group_admin: false,
                updated_by: data.admin_id
            }
  
            let { error } = await supabase.from('profiles').upsert(userUpdate)
            if (error) throw error

            setGroupId(inviteId)

            const { newError } = await supabase
            .from('groups')
            .update({ members: supabase.sql`array_append(members, ${user.id})` })
            .eq('group_id', inviteId);

            if (newError) throw newError

            let { newData, addError} = await supabase
                .from('groups')
                .select(`concert_recs`)
                .eq('group_id', group_id)
                .single()

                if (addError) throw addError;

                let arr = newData.concert_recs;
                arr = arr.push(recs);


                //Remove Duplicates
                // for (let i = 0; i < arr.length; i++) {
                //     console.log("in the looper")
                //     for (let j = i + 1; j < arr.length; j++) {
                //         if (arr[i].name == arr[j].name) {
                //             console.log("in the if")
                //             arr = arr.splice(j, 1)
                //         }
                //     }
                // }

                const { error: updateError } = await supabase
                    .from('groups')
                    .upsert({concert_recs: arr})
                    .eq('group_id', group_id);
                    
                if (updateError) throw updateError


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
                admin_id: user.id,
                members: [user.id]
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

    return(
        <div className={styles.homePage}>

        
        <div className={styles.group}>
             <div>
                {!isAdmin ? (
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

            <h2>Group Members</h2>
           
          

            
            {groupData && groupData.map((member) => {
                return (

                   
                    <div key={member.id}>
                       <div className={styles.groupcard}>
                            <img className={styles.groupimg} src={member.avatar_url} alt={`${member.username}'s avatar`} />
                            <h3 className={styles.cardtext}>{member.username}</h3>
                            <button onClick={() => removeUser(member.id)}>Remove</button>
                       </div>
                    </div>
                    
                )
            })}
        


        </div>
        </div>
    )

}
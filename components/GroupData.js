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
    const [hasGroupId, setHasGroupId] = useState(null)
    const [groupDataIsHere, setGroupDataIsHere] = useState(null)
    const [groupValues, setGroupValues] = useState(null)
    const [inviteLink, setInviteLink] = useState('')
    const [isAdmin, setIsAdmin] = useState(null)

    useEffect(() => {
        const inviteId = localStorage.getItem('inviteLink')
        setGroupId(groupId)
        if (groupId != null) {
            setHasGroupId(true)
            console.log("HAS GROUP")
            console.log("GroupID " + groupId)

        }
        if (inviteId && !groupValues) {
            setIsAdmin(false)
            addToGroup(inviteId)
            setGroupValues(true)
        } else if (groupValues) {
        } else {
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
            if (groupId == null) {
                console.log("You are a group owner")
                setIsAdmin(true)
            }

             //if (!hasGroupId) {
                getGroup(group_id)
             //}
            
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

                console.log(groupData.members)

                const newMembersArray = groupData.members.filter((uuid) => uuid !== userId);

                console.log("NEW ARRAY")
                console.log(newMembersArray)

                const { error: updateError } = await supabase
                    .from('groups')
                    .update({members: newMembersArray})
                    .eq('group_id', userGroup);

                if (updateError) throw updateError
                
                console.log(userId)
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
        alert("in add to grouo")
        try {
            setLoading(true)
            alert("in try")
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

            setGroupId(userUpdate.group_id)
            setHasGroupId(true)
            console.log("THIS IS THIS INVITE CODE" + userUpdate.group_id)

            const { data: users } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('group_id', userUpdate.group_id)

                        if(error) console.log(error)
                        else {
                            setGroupData(users)
                            setGroupDataIsHere(true)
                            console.log(groupDataIsHere)
                        }



            let { data: newGroupData, newGroupError } = await supabase
                .from('groups')
                .select('members')
                .eq('group_id', inviteId)
                .single();

                if (newGroupError) throw newGroupError
            
                console.log("GOT THE GROUP MEMBERS")
                console.log(newGroupData.members);
                let groups = newGroupData.members;
                
                groups = groups.push(userUpdate.id)
                console.log(groups)
                
            // let { newData, addError} = await supabase
            //     .from('groups')
            //     .select(`concert_recs`)
            //     .eq('group_id', inviteId)
            //     .single()

            //     if (addError) throw addError;

            
                

                const newGroup = {
                    group_id: userUpdate.group_id,
                    updated_at: new Date().toISOString(),
                    members: groups
                }
                console.log("outside this bicth")
                if (groupId != null) {
                    let { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('group_id', groupId)
                
                    if (error) throw error;

                    console.log("in the middle in this bicth")
                
                    if (data) {
                        let profileGenres = data[0].genre_list;
                        console.log("otherside of this bitch")

                        let { data: groupList, error: groupError } = await supabase
                            .from('groups')
                            .select('*')
                            .eq('group_id', groupId)

                        if (groupError) console.log(groupError);

                        let updated_genre_list = groupList[0].group_genre.concat(profileGenres);
                        console.log(updated_genre_list);
                        console.log("its in bicth")
                
                        let { error: updateError } = await supabase
                            .from('groups')
                            .update({
                                group_genre: updated_genre_list
                            })
                            .eq('group_id', groupId);
                
                        if (updateError) throw updateError;
                    }
                }

                // const { error: groupUpdate } = await supabase
                //     .from('groups')
                //     .upsert(newGroup)
                    
                // if (groupUpdate) throw groupUpdate

                // let arr = newData.concert_recs;
                // arr = arr.push(recs);

                // const { error: updateError } = await supabase
                //     .from('groups')
                //     .upsert({concert_recs: arr})
                //     .eq('group_id', group_id);
                    
                // if (updateError) throw updateError



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


          //  alert('Profile updated!')
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
            console.log("PASSED THE FIRST UPDATE")
            let { newError } = await supabase.from('profiles').upsert(userUpdate)
            if (newError) throw newError

            if (uuid != null) {
                console.log("IN THE IF")
                let { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('group_id', uuid)

                if (error) throw error;

                if (data) {

                    let profileGenres = data[0].genre_list;

                    let { error: updateError } = await supabase
                        .from('groups')
                        .update({
                            group_genre: profileGenres
                        })
                        .eq('group_id', uuid);
            
                    if (updateError) throw updateError;
                }
            }

      
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
             <h2>Group Members</h2>
        
                {isAdmin ? (
                    <div className={styles.groupcard}>
                    <button
                        className={styles.button}
                        role="button"
                        onClick={() => generateInviteLink()}
                        disabled={loading}
                    >
                        {loading ? 'Loading ...' : 'Generate Invite Link'}
                    </button>
                     </div>
                ) : null}
                {inviteLink && (
                    <p>
                        Share this link with your friends: <a href={`http://localhost:3000/`}>{`http://localhost:3000/?inviteId=${inviteLink}`}</a>
                        Share this link with your friends: <a href={`https://web-seven-pi.vercel.app/`}>{`https://web-seven-pi.vercel.app/?inviteId=${inviteLink}`}</a>
                    </p>
                )}
        
           
          

            
            {groupData && groupData.map((member) => {
                return (

                   
                    <div key={member.id}>
                       <div className={styles.groupcard}>
                            <img className={styles.groupimg} src={member.avatar_url} alt={`${member.username}'s avatar`} />
                            <h3 className={styles.cardtext}>{member.username}</h3>
                            {isAdmin ? (
                                <button  
                                className={styles.button}
                                role="button" 
                                onClick={() => removeUser(member.id)}>Remove</button>
                            ) : null}
                       </div>
                    </div>
                    
                )
            })}
        


        </div>
        </div>
    )

}

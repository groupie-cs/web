import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


export class Ticketmaster {

    async getConcerts(city, topGenres, startDate = "", endDate = "") {

        const apikey = process.env.TICKETMASTER_API_KEY
        const classificationName = "[" + topGenres.toString() + "]"
        const keyword = ""
        const radius = 100
        const modStartDate = startDate
        const modEndDate = endDate
        const modLocation = city

        // const supabase = useSupabaseClient()
        // const user = useUser()

        
        // try {
        //     setLoading(true)

        //     let { data, error, status } = await supabase
        //     .from('profiles')
        //     .select(`group_id`)
        //     .eq('id', user.id)
        //     .single()

        //     if (error) throw error
            
        // } catch (error) {
        //     alert('Error updating the data!')
        //     console.log(error)
        // } finally {
        //     setLoading(false)
        // }

        // if (data.group_id != null) {
        //     let { newData, addError} = await supabase
        //         .from('groups')
        //         .select(`filters`)
        //         .eq('group_id', group_id)
        //         .single()

        //         if (addError) throw addError;

        //         let arr = newData.filters;


        //         modLocation = arr[0]
        //         modStartDate = arr[3]
        //         modEndDate = arr[4]

                

        // }
        
    

        
        
        const url = "https://app.ticketmaster.com/discovery/v2/events.json?size=15" + 
            "&apikey=" + apikey +
            "&classificationName=" + classificationName +
            "&keyword=" + keyword +
            "&radius=" + radius +
            "&startDateTime=" + modStartDate +
            "&endDateTime=" + modEndDate +
            "&city=" + modLocation +
            "&sort=relevance,asc"

        console.log("Calling TicketMaster")
        const recs = await (
            await fetch (url, {
                method: 'GET'
            })
        ).json()

        return recs
    }

}
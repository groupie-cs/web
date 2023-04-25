import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


export class Ticketmaster {

    async getConcerts(city, topGenres, startDate = "", endDate = "") {

        const apikey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY
        const classificationName = "[" + topGenres.toString() + "]"
        const keyword = ""
        const radius = 100
        const modStartDate = startDate;
        const modEndDate = endDate
        const modLocation = city
        
       
        const url = "https://app.ticketmaster.com/discovery/v2/events.json?size=15" + 
            "&apikey=" + apikey +
            "&classificationName=" + classificationName +
            "&keyword=" + keyword +
            "&radius=" + radius +
            "&startDateTime=" + modStartDate +
            "&endDateTime=" + modEndDate +
            "&city=" + modLocation +
            "&sort=relevance,asc"

        console.log(url);

        console.log("Calling TicketMaster")
        const recs = await (
            await fetch (url, {
                method: 'GET'
            })
        ).json()

        return recs
    }

}
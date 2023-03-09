import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


export class Ticketmaster {

    async getConcerts(city, topGenres, startDate = "", endDate = "") {

        const apikey = 'M6Sn1Qxk66pq6wvy81A6AsFQIgGG3sso'
        const classificationName = "[" + topGenres.toString() + "]"
        const keyword = ""
        const radius = 100
        const modStartDate = startDate
        const modEndDate = endDate
        const modLocation = city
        
        
        const url = "https://app.ticketmaster.com/discovery/v2/events.json?size=10" + 
            "&apikey=" + apikey +
            "&classificationName=" + classificationName +
            "&keyword=" + keyword +
            "&radius=" + radius +
            "&startDateTime=" + modStartDate +
            "&endDateTime=" + modEndDate +
            "&city=" + modLocation

        console.log("Calling TicketMaster")
        const recs = await (
            await fetch (url, {
                method: 'GET'
            })
        ).json()

        return recs
    }

}
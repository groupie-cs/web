import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


export class Ticketmaster {

    async getConcerts(city, topGenres, startDate = "", endDate = "") {

        const apikey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY
        const classificationName = "[rock]"
        const keyword = ""
        const radius = 100
        const modStartDate = startDate
        const modEndDate = endDate
        const modLocation = city

        const totalResponces = 25

        let topFive = []

        for (let i = 0; i < 5; i++) {
            let biggest = 0
            let biggestGenre = ""
            let biggestNumber = 0
            for (var genre in topGenres) {
                if (topGenres[genre] > biggest) {
                    biggest = topGenres[genre]
                    biggestGenre = genre
                    biggestNumber = topGenres[genre]
                    topGenres[genre] = -1
                }
            }
            topFive[i] = [biggestGenre, biggestNumber]
        }

        let totalStff = 0
        for (let i = 0; i < 5; i++) {
            if (topFive[i][0] != "") {
                totalStff += topFive[i][1]
            }
        }

    
        let recs = ""

        for (let i = 0; i < 5; i++) {
            let tempRec = ""
            if (topFive[i][0] == "") {
                continue;
            }

            let sizeValue = (Math.round((topFive[i][1] * totalResponces) / totalStff)) + ""
            

            const url = "https://app.ticketmaster.com/discovery/v2/events.json?" +
            "size=" + sizeValue +
            "&apikey=" + apikey +
            "&classificationName=" + topFive[i][0] +
            "&keyword=" + keyword +
            "&radius=" + radius +
            "&startDateTime=" + modStartDate +
            "&endDateTime=" + modEndDate +
            "&city=" + modLocation +
            "&sort=relevance,asc"

            tempRec = await (
                await fetch (url, {
                    method: 'GET'
                })
            ).json()

            console.log("PRINTING TEMP")
            console.log(topFive[i])
            console.log("SIZE")
            console.log(sizeValue)
            console.log(i)
            console.log(tempRec)

            if (recs == "") {
                recs = tempRec
            } else {
                let newSize = tempRec.page.size 

                let events = tempRec._embedded.events
                console.log("events")
                console.log(events)

                for (let i = recs.page.size; i < recs.page.size + newSize; i++) {
                    recs._embedded.events[i] = tempRec._embedded.events[i-recs.page.size]
                }
                

                recs.page.size = recs._embedded.events.length
                
            }
        }
        // recs.page.size = recs._embedded.events.length
        console.log("DONE")
        console.log(recs)



        return recs
    }

}
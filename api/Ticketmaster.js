import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


export class Ticketmaster {

    async getConcerts(city, topGenres, startDate = "", endDate = "") {

        // for (let i = 0; i < 1000000000; i++) {
        //     i += 0
        // }

        console.log("CALLING TICKETMASTER")

        const apikey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY
        const classificationName = "[rock]"
        const keyword = ""
        const radius = 100
        const modStartDate = startDate
        const modEndDate = endDate
        const modLocation = city

        const totalResponces = 25

        let topFive = []
        let genreTracker = []

        for (let i = 0; i < 5; i++) {
            let biggest = 0
            let biggestGenre = ""
            let biggestNumber = 0
            for (var genre in topGenres) {
                if ((topGenres[genre] > biggest) && (!genreTracker.includes(genre))) {
                    biggest = topGenres[genre]
                    biggestGenre = genre
                    biggestNumber = topGenres[genre]
                }
                
            }
            topFive[i] = [biggestGenre, biggestNumber]
            genreTracker[i] = biggestGenre
        }

        let totalStff = 0
        for (let i = 0; i < 5; i++) {
            if (topFive[i][0] != "") {
                totalStff += topFive[i][1]
            }
        }

        console.log("GENRES")
        console.log(topFive)

    
        let recs = ""

        for (let i = 0; i < 5; i++) {
            let tempRec = ""
            if (topFive[i][0] == "") {
                console.log("Nothing Here....")
                continue;
            }

            let sizeValue = (Math.round((topFive[i][1] * totalResponces) / totalStff)) + ""
            console.log("SIZE VALUE + Genre")
            console.log(sizeValue)
            console.log(topFive[i][0])

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


            if (recs == "") {
                recs = tempRec
            } else {
                if (tempRec._embedded == null) {
                    console.log("Null embded....")
                    continue;
                }

                let newSize = tempRec.page.size 

                for (let i = recs.page.size; i < recs.page.size + newSize; i++) {
                    recs._embedded.events[i] = tempRec._embedded.events[i-recs.page.size]
                }
                

                recs.page.size = recs._embedded.events.length
                
            }
        }

        console.log("RECS HERE")
        console.log(recs)
        return recs
    }

}
import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


export class Spotify {

    async getTopArtists(session) {
        const { provider_token, user } = session
        const topArtists = await (
            await fetch(`https://api.spotify.com/v1/me/top/artists`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${provider_token}`
                },
            })
        ).json()

        return topArtists
    }

    getTopGenres(topArtists, num = 5) {
        let genres = []
        for (let i = 0; i < num; i++) {
            if (i > topArtists.limit) {
                console.log("Your num is larger than total artists to getTopGenres")
                break
            }

            // if (topArtists.items[i].genres[0] != undefined && topArtists.items[i].genres[0] != "") {
            console.log(topArtists.items[i].genres[0])
            if (topArtists.items[i].genres[0] != undefined) {
                genres[i] = topArtists.items[i].genres[0]
            } else {
                genres[i] = ""
            }
            // }

        }
        genres.filter(n => n)

        return genres
    }

    async getRecTracks(session, topArtists) {
        const { provider_token, user } = session
        let artistIDList = ""

        for (let i = 0; i < 5; i++) {
            if (i > topArtists.limit) {
                console.log("5 is larger than total artists to getRecTracks")
                break
            }

            if (i != 0) {
                artistIDList += ","
            }
            artistIDList += topArtists.items[i].id

        }

        console.log(artistIDList)

        const recTracks = await (
            await fetch('https://api.spotify.com/v1/recommendations?' + new URLSearchParams({
                seed_artists: artistIDList
            }), {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${provider_token}`
                },
            })
        ).json().tracks


        return recTracks
    }
}
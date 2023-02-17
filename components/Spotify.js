import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


export default function Spotify({ session }) {
    const supabase = useSupabaseClient()
    const user = useUser()

    async function loadTopArtists(topArtists) {

        const updates = {artists: topArtists}

        let { error } = await supabase.from('profiles').insert(updates)
        if (error) throw error
    }

    async function getTopArtists() {
        const { provider_token, user } = session
        const topArtists = await (
            await fetch(`https://api.spotify.com/v1/me/top/artists`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${provider_token}`
                },
            })
        ).json()
    
        const artistList = topArtists.items
        const artistObject = []
        let test = {}
        let counter = 0
    
        for (const artist in artistList) {
            const artistInfo = {
                name: artist.name,
                genres: artist.genres,
                images: artist.images,
                spotifyURL: artist.external_urls
            }
            test = artistInfo
            artistObject[counter] = artistInfo
            counter++
        }
    
        console.log("Starting")
        console.log(artistObject)
    
        return test
    }
}
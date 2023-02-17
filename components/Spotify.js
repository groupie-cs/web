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


    async parseArtists(topArtists) {
        let artists = []
        for (let i = 0; i < topArtists.limit; i++) {
            artists[i] = topArtists.items[i].name

        }
        return JSON.parse(artists.toString())
    }


}
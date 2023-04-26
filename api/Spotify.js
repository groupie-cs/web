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

        for (let i = 0; i < topArtists.limit; i++) {
            const topSongs = await this.getTopSong(session, topArtists.items[i].id)
            topArtists.items[i]["topSongs"] = topSongs
        }
    

        return topArtists
    }

    getTopGenres(topArtists) {
        let genres = []
        const num = topArtists.limit
        const genreLimitPerArtist = 3
        
        for (let i = 0; i < num; i++) {
            topArtists.items[i].genres.forEach(genre => {
                if ((genre != undefined) && (genreLimitPerArtist-1 < i)) {
                    genres.push(genre)
                }
            });
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

    async getTopSong(session, artistID) {
        const { provider_token, user } = session
        const url = 'https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?market=US'
        const topSong = await (
            await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${provider_token}`
                },
            })
        ).json()

        return topSong
    }

    async getArtist(session, artistName) {
        const { provider_token } = session
        const url = "https://api.spotify.com/v1/search?query=" + artistName + "&type=artist&limit=1"

        const response = await (
            await fetch( url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${provider_token}`
                },
            })
        ).json()

        if (response.artists.items[0] != null) {
            const topSongs = await this.getTopSong(session, response.artists.items[0].id)
            response.artists.items[0]["topSongs"] = topSongs
        }
      
        return response;
      }
}
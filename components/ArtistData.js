import React, { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import { Spotify } from '../api/Spotify'
import ArtistsOption from './ArtistsOption'

const spotify = new Spotify()


export default function ArtistData({ artistData, session }) {
    const [results, setResults] = useState();

    return (
        <div className={styles.center}>
            <div className={styles.app}>
                <h1>Lets look through your tastes</h1>
                <div className={styles.hs}>
                    {artistData && artistData.items.map((artist) => {
                        return (
                            <div className={styles.card} key={artist.id}>
                                <ArtistsOption artist = {artist} session = {session}/>
                                <h2>{artist.name}</h2>
                                {/* <h2>Top Song: {artist.topSongs.tracks[0].name}</h2> */}
                                <img className={styles.artistimg} src={artist.images[0].url} alt={artist.name} />
                            </div>
                        )
                    })}
                    
                </div>
                <h1>And get your friend's tastes next</h1>
            </div>
        </div>
    )
}
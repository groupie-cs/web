import React from 'react'
import styles from '@/styles/Home.module.css'

export default function ArtistData({ artistData }) {
    return (
        <div className={styles.center}>
            <div className={styles.app}>
                <h1>Lets look through your tastes</h1>
                <div className={styles.hs}>
                    
                    {artistData && artistData.items.map((artist) => {
                        return (
                            <div className={styles.card} key={artist.id}>
                                <h2>{artist.name}</h2>
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
import React from 'react'
import styles from '@/styles/Home.module.css'
import Filter from './filter'
import GroupData from './GroupData'

export default function ConcertData({ recData, session, groupId }) {
    console.log("WE ARE IN CONSERT DATA")
    console.log(recData)
    return (
        <div className={styles.center}>
            <div className={styles.app}>
                <h1>Lets look at some concerts</h1>
                <Filter></Filter>
                <div className={styles.hs}>
                    {recData && recData._embedded.events.map((rec) => {
                        return (
                            <a target="_blank" rel="noopener noreferrer" className={styles.card} key={rec.id} href={rec.url}>
                                <h2>{rec.name}</h2>
                                <img className={styles.artistimg} src={rec.images[0].url} alt={rec.name} />
                                {/* <h2>${rec.priceRanges[0].min}</h2> */}
                            </a>
                        )
                    })}
                </div>
            </div>

            <GroupData session={session} groupId={groupId}></GroupData>
        </div>
    )
}
import React from 'react'
import styles from '@/styles/Home.module.css'
import Filter from './filter'
import GroupData from './GroupData'
import DialogSelect from './DialogSelect'

export default function ConcertData({ recData, session, groupId }) {
   
    return (
        <div className={styles.center}>
            <div className={styles.app}>
                <h1>Lets look at some concerts</h1>
                <DialogSelect session={session} groupId={groupId}></DialogSelect>
                <div className={styles.hs}>
                    {recData && recData._embedded.events.map((rec) => {
                        return (
                            <a target="_blank" rel="noopener noreferrer" className={styles.card} key={rec.id} href={rec.url}>
                                {/*Cut rec.name if it is too long */}
                                <h2>{rec.name.length > 20 ? rec.name.substring(0, 20) + "..." : rec.name}</h2>
                                <img className={styles.artistimg} src={
                                    rec.images.sort((a, b) => b.width - a.width)[0].url
                                } alt={rec.name} />
                                {rec.priceRanges && <h2>${rec.priceRanges[0].min} - ${rec.priceRanges[0].max}</h2>}
                            </a>
                        )
                    })}
                </div>
            </div>

            <GroupData session={session} groupId={groupId}></GroupData>
        </div>
    )
}
import React from 'react'
import styles from '@/styles/Home.module.css'
import DialogSelect from './DialogSelect'

export default function ConcertData({ recData }) {
    return (
        <div className={styles.homepage}>

            <div className={styles.group}>
                <h2>Group Members</h2>
                <div className={styles.groupcard}>
                    <img className={styles.groupimg} src='https://0.gravatar.com/avatar/f69c5894d3082052322b3126ba59389f?s=400&d=mm' />
                    <h3 className={styles.cardtext}>Kunwar Sahni</h3>
                </div>

                <div className={styles.groupcard}>
                    <img className={styles.groupimg} src='https://0.gravatar.com/avatar/f69c5894d3082052322b3126ba59389f?s=400&d=mm' />
                    <h3 className={styles.cardtext}>Kunwar Sahni</h3>
                </div>

                <div className={styles.groupcard}>
                    <img className={styles.groupimg} src='https://0.gravatar.com/avatar/f69c5894d3082052322b3126ba59389f?s=400&d=mm' />
                    <h3 className={styles.cardtext}>Kunwar Sahni</h3>
                </div>

                <div className={styles.groupcard}>
                    <img className={styles.groupimg} src='https://0.gravatar.com/avatar/f69c5894d3082052322b3126ba59389f?s=400&d=mm' />
                    <h3 className={styles.cardtext}>Kunwar Sahni</h3>
                </div>
            </div>


            <div className={styles.concertrecomendations}>
                <div className={styles.headertitle}>
                    <h2>Concerts</h2>
                    <DialogSelect></DialogSelect>
                </div>
                {/* <div className={styles.hs}> */}
                {recData && recData._embedded.events.map((rec) => {
                    return (
                        <a target="_blank" rel="noopener noreferrer" className={styles.card} key={rec.id} href={rec.url}>
                            <div className={styles.concertcard}>
                                <img className={styles.concertimg} src={
                                    rec.images.sort((a, b) => b.width - a.width)[0].url
                                } alt={rec.name} />
                                <div className={styles.concertDetails}>
                                    <h2>{rec.name.length > 45 ? rec.name.substring(0, 45) + "..." : rec.name}</h2>
                                    <h3>{rec._embedded.venues[0].city.name} - {rec._embedded.venues[0].name}</h3>                                    
                                    {rec.priceRanges && <h3>${rec.priceRanges[0].min} - ${rec.priceRanges[0].max}</h3>}
                                </div>
                            </div>
                        </a>
                    )
                })}
                {/* </div> */}
            </div>
        </div>
    )
}
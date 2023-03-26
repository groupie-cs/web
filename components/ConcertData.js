import React from 'react'
import styles from '@/styles/Home.module.css'
import DialogSelect from './DialogSelect'
import Cycler from './Cycler'
import { useState, useEffect } from 'react'
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';

export default function ConcertData({ recData }) {
    const [NewPage, setNewPage] = useState(true)
    const [CurrRec, setRec] = useState(null)

    const handleCardClick = (currRec) => {
        setRec(currRec)
        setNewPage(false)
      };

    return (
        <div className={styles.homepage}>
            {NewPage == false && <div>
                <div className={styles.concertrecomendations}>
                <div className={styles.headertitle}>
                    <h2>{CurrRec.name.length > 45 ? CurrRec.name.substring(0, 45) + "..." : CurrRec.name}</h2>
                </div>
                <div className={styles.scroller}>
                        <a target="_blank" rel="noopener noreferrer" className={styles.card} key={CurrRec.id}>
                            <div className={styles.concertcard}>
                                <img className={styles.concertimg} src={
                                    CurrRec.images.sort((a, b) => b.width - a.width)[0].url
                                } alt={CurrRec.name} />
                            </div>
                            <div className={styles.concertDetails}>
                                <h3>{CurrRec._embedded.venues[0].city.name} - {CurrRec._embedded.venues[0].name}</h3>                                  
                                {CurrRec.priceRanges && <h3>${CurrRec.priceRanges[0].min} - ${CurrRec.priceRanges[0].max}</h3>}
                                {CurrRec.info && <h2>{CurrRec.info}</h2>}
                                {CurrRec.ticketLimit && <h2>{CurrRec.ticketLimit.info}</h2>}
                            </div>
                            <a href={CurrRec.url}>
                                <h2>Buy Ticket</h2>
                            </a>
                            <FormControl sx={{ m: 1 }} variant="standard">
                                <Button onClick={() => setNewPage(true)}>Back</Button>
                            </FormControl>
                        </a>
                </div>
            </div>
            </div>}

            {NewPage == true && <div>
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
            </div>}

            {NewPage == true && <div>
            <div className={styles.concertrecomendations}>
                <div className={styles.headertitle}>
                    <h2>Concerts</h2>
                    <DialogSelect></DialogSelect>
                </div>
                <div className={styles.scroller}>
                {recData && recData._embedded.events.map((rec) => {
                    return (
                        <a target="_blank" rel="noopener noreferrer" className={styles.card} key={rec.id}>
                            <div className={styles.concertcard} onClick={() => handleCardClick(rec)}>
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
                </div>
            </div>
            </div>}
        </div>
    )
}
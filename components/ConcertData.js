import { useState, useEffect } from 'react'
import styles from '@/styles/Home.module.css'
import Filter from './filter'
import GroupData from './GroupData'
import DialogSelect from './DialogSelect'
import Cycler from './Cycler'
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import ArtistsOption from './ArtistsOption'
import { Spotify } from '../api/Spotify'
import ArtistData from './ArtistData'

export default function ConcertData({ recData, session, groupId }) {
    const [NewPage, setNewPage] = useState(true)
    const [CurrRec, setRec] = useState(null)
    const [Artists, setArtists] = useState(null)
    const spotify = new Spotify()

    async function getArtists(name) {
        try {
            const artistData = await spotify.getArtist(session, name)
            if (artistData != null) {
                if (artistData.artists.items != null) {
                    setArtists(artistData.artists.items[0])
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleCardClick = (currRec) => {
        setRec(currRec)
        setNewPage(false)
        console.log(currRec)
        if (currRec._embedded != null) {
            if (currRec._embedded.attractions != null) {
                if (currRec._embedded.attractions[0].name != null) {
                    getArtists(currRec._embedded.attractions[0].name)
                }
            }
        }
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
                            {Artists != null && <div>
                                {Artists.external_urls.spotify != null && <div>
                                    <a href={Artists.external_urls.spotify}>
                                    <h2>Artist Page</h2>
                                </a>
                                </div>}
                                <ArtistsOption artist = {Artists} session = {session}/>
                            </div>}
                            <FormControl sx={{ m: 1 }} variant="standard">
                                <Button onClick={() => setNewPage(true)}>Back</Button>
                            </FormControl>
                        </a>
                </div>
            </div>
            </div>}

            {NewPage == true && <div>
                <div className={styles.group}>
                <GroupData session={session} groupId={groupId}> recs={recData}</GroupData>
            </div>
            </div>}

            {NewPage == true && <div>
            <div className={styles.concertrecomendations}>
                <div className={styles.headertitle}>
                    <h2>Concerts</h2>
                    <DialogSelect groupId={groupId}></DialogSelect>
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
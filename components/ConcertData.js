import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import GroupData from './GroupData';
import DialogSelect from './DialogSelect';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Spotify } from '../api/Spotify'
import ArtistSongs from './ArtistSongs';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { Ticketmaster } from '../api/Ticketmaster';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { countGenres } from "./utils.js";

const color = "#FFFFFF";

const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: color,
      },
      secondary: {
        main: '#f50057',
      },
    },
    content: {
        alignItems: "center"
    },
    typography: {
      // fontFamily: '"Inter"',
      allVariants: {
        color: "white"
      },
    },
    components: {
      MuiIconButton: {
        styleOverrides: {
          sizeMedium: {
            color
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color
          }
        }
      }
    }
  });

export default function ConcertData({ recData, session, groupId, genres}) {
    const supabase = useSupabaseClient()
    const [loading, setLoading] = useState(true)
    const [NewPage, setNewPage] = useState(true)
    const [CurrRec, setRec] = useState(null)
    const [Artists, setArtists] = useState(null)
    const spotify = new Spotify()
    const user = useUser()

    const [filters, setFilters] = useState(null);
    const [inputRecs, setInputRecs] = useState(null);
    const [firstSet, setFirstSet] = useState(false);

    const ticketmaster = new Ticketmaster()

    useEffect(() => {
        if (inputRecs == null && firstSet == false) {
          setFirstSet(true)
          doTicketmaster()
            
        }
        if (filters != null) {
            doTicketmaster()
            setFilters(null);
        }
        
    });

    async function updateRecData() {
      try {
        setLoading(true)

        if (groupId != null) {
            let { data, error } = await supabase
                .from('groups')
                .select('*')
                .eq('group_id', groupId)

            if (error) throw error;

            let group_genre_list = data[0].group_genre

            let genre_table = countGenres(group_genre_list)
        }

      } catch (error) {
          alert('Error Getting Group!')
        console.log(error)
      } finally {
         setLoading(false)
      }
    }

    async function doTicketmaster() {
      setFirstSet(true)

      const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)

      if(error) console.log(error)

      let temp_id = users[0].group_id
      if (temp_id != null) {
      
        const { data: groups, groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('group_id', temp_id)

        if(groupError) console.log(groupError)

        let groupGenre = groups[0].group_genre;

        console.log("LOOK HERE")
        console.log(groupGenre)

        genres = countGenres(groupGenre)
        console.log(genres)
      }

      if (filters == null) {
        console.log("NO FILTERS")
        console.log(firstSet)

        try {
          const recsDefault = await ticketmaster.getConcerts("Chicago", genres);

          // remove any recs from recs if there are two with the same name
          if (recsDefault._embedded != null) {
            for (let i = 0; i < recsDefault._embedded.events.length; i++) {
              for (let j = i + 1; j < recsDefault._embedded.events.length; j++) {
                  if (recsDefault._embedded.events[i].name == recsDefault._embedded.events[j].name) {
                      recsDefault._embedded.events.splice(j, 1)
                  }
              }
            }
          }
          if (recsDefault != null) {
            setInputRecs(recsDefault);
            recData = recsDefault
          }
          

        } catch (error) {
          console.log(error)
        }

        

      } else {
          console.log("WITH FILTERS")
          try {
            const recsFilter = await ticketmaster.getConcerts(filters[0], genres, filters[3], filters[4]);
            
            if (recsFilter != null) {
              setInputRecs(recsFilter);
              recData = recsFilter
            }
          } catch (error) {
            console.log(error)
          }

          
          console.log("DONE")
      }
    }

    const handleFilterSubmit = (newFilters) => {
        setFilters(newFilters);
      };

    // IN RETURN
    

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
            <ThemeProvider theme={theme}>
            {NewPage == false && <div>
                <div className={styles.concertrecomendations}>
                <div className={styles.headertitle}>
                    <h2>{CurrRec.name.length > 45 ? CurrRec.name.substring(0, 45) + "..." : CurrRec.name}</h2> 
                </div>
                <div className={styles.scroller}>
                        <a target="_blank" rel="noopener noreferrer" className={styles.card} key={CurrRec.id}>
                        <FormControl sx={{ m: 1 }} variant="standard">
                        <div className={styles.paddingLeft}> 
                            <div>
                                <img className={styles.concertimgtwo} src={
                                    CurrRec.images.sort((a, b) => b.width - a.width)[0].url
                                } alt={CurrRec.name} />
                            </div>
                        </div>
                            <div className={styles.paddingTop}> 
                            <div className={styles.descriptionInfo}> 
                            {CurrRec.priceRanges && <h2>${CurrRec.priceRanges[0].min} - ${CurrRec.priceRanges[0].max}</h2>}
                            <h2>{CurrRec._embedded.venues[0].city.name} - {CurrRec._embedded.venues[0].name}</h2>
                            <div className={styles.detailButton}> 
                            <a target="_blank"  href={CurrRec.url}>
                                <h2>Buy Ticket</h2>
                            </a>
                            </div>
                            {Artists != null && <div>
                                <div className={styles.paddingTop}> 
                                <div className={styles.detailButton}> 
                                {Artists.external_urls.spotify != null && <div>
                                    <a target="_blank" href={Artists.external_urls.spotify}>
                                    <h2>Artist Page</h2>
                                </a>
                                </div>}
                                </div>
                                </div>
                            </div>}  
                            </div>
                            </div>
                            {CurrRec.info && <div className={styles.paddingTop}> <div className={styles.descriptionInfo}><h3>{CurrRec.info}</h3></div></div>}
                            {CurrRec.ticketLimit && <div className={styles.paddingTop}> <div className={styles.descriptionInfo}><h3>{CurrRec.ticketLimit.info}</h3></div></div>}
                            <div className={styles.paddingTop}> 
                            {Artists != null && <div>
                                <div className={styles.descriptionInfo}> 
                                <ArtistSongs artist = {Artists} session = {session}/>
                                </div>
                            </div>}
                            </div>
                            <div className={styles.paddingTop}>
                            <Button onClick={() => setNewPage(true)}>Back</Button>
                            </div>
                            </FormControl>
                        </a>
                </div>
            </div>
            </div>}

            {NewPage == true && <div>
                <div className={styles.group}>
                <GroupData session={session} groupId={groupId}> recs={inputRecs}</GroupData>
            </div>
            </div>}

            {NewPage == true && <div>
            <div className={styles.concertrecomendations}>
                <div className={styles.headertitle}>
                    <h2>Concerts</h2>
                    <DialogSelect groupId={groupId} onSubmit={handleFilterSubmit}></DialogSelect>
                </div>
                <div className={styles.scroller}>
                {inputRecs && inputRecs._embedded.events.map((rec) => {
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
            </ThemeProvider>
        </div>
    )
}
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { Inter } from "next/font/google"
import styles from '@/styles/Home.module.css'

import SpotifyPlayer from 'react-spotify-web-playback';

const inter = Inter({ subsets: ['latin'] })

const musicIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.69419 20.4612L6.99029 20.4019C7.37076 20.3258 7.56099 20.2878 7.7215 20.2257C8.3765 19.9724 8.85063 19.394 8.9706 18.7021C9 18.5325 9 18.3385 9 17.9505V16H6.25245C6.018 16 5.90078 16 5.80205 16.0098C4.85403 16.1041 4.10411 16.854 4.00982 17.802C4 17.9008 4 18.018 4 18.2525C4 18.5322 4 18.6721 4.01244 18.7831C4.13321 19.8608 5.0909 20.646 6.17139 20.553C6.28269 20.5435 6.41986 20.516 6.69419 20.4612Z" fill="#2A4157" fill-opacity="0.24"/>
<path d="M16.6942 18.4612L16.9903 18.4019C17.3708 18.3258 17.561 18.2878 17.7215 18.2257C18.3765 17.9724 18.8506 17.394 18.9706 16.7021C19 16.5325 19 16.3385 19 15.9505V14H16.2525C16.018 14 15.9008 14 15.802 14.0098C14.854 14.1041 14.1041 14.854 14.0098 15.802C14 15.9008 14 16.018 14 16.2525C14 16.5322 14 16.6721 14.0124 16.7831C14.1332 17.8608 15.0909 18.646 16.1714 18.553C16.2827 18.5435 16.4199 18.516 16.6942 18.4612Z" fill="#2A4157" fill-opacity="0.24"/>
<path d="M6.69419 20.4612L6.99029 20.4019C7.37076 20.3258 7.56099 20.2878 7.7215 20.2257C8.3765 19.9724 8.85063 19.394 8.9706 18.7021C9 18.5325 9 18.3385 9 17.9505V16H6.25245C6.018 16 5.90078 16 5.80205 16.0098C4.85403 16.1041 4.10411 16.854 4.00982 17.802C4 17.9008 4 18.018 4 18.2525C4 18.5322 4 18.6721 4.01244 18.7831C4.13321 19.8608 5.0909 20.646 6.17139 20.553C6.28269 20.5435 6.41986 20.516 6.69419 20.4612Z" stroke="#222222" stroke-width="1.2"/>
<path d="M16.6942 18.4612L16.9903 18.4019C17.3708 18.3258 17.561 18.2878 17.7215 18.2257C18.3765 17.9724 18.8506 17.394 18.9706 16.7021C19 16.5325 19 16.3385 19 15.9505V14H16.2525C16.018 14 15.9008 14 15.802 14.0098C14.854 14.1041 14.1041 14.854 14.0098 15.802C14 15.9008 14 16.018 14 16.2525C14 16.5322 14 16.6721 14.0124 16.7831C14.1332 17.8608 15.0909 18.646 16.1714 18.553C16.2827 18.5435 16.4199 18.516 16.6942 18.4612Z" stroke="#222222" stroke-width="1.2"/>
<path d="M9 16H6.25245C6.018 16 5.90078 16 5.80205 16.0098C4.85403 16.1041 4.10411 16.854 4.00982 17.802C4 17.9008 4 18.018 4 18.2525V18.2525C4 18.5322 4 18.6721 4.01244 18.7831C4.13321 19.8608 5.0909 20.646 6.17139 20.553C6.28269 20.5435 6.41986 20.516 6.69419 20.4612L6.99029 20.4019C7.37076 20.3258 7.56099 20.2878 7.7215 20.2257C8.3765 19.9724 8.85063 19.394 8.9706 18.7021C9 18.5325 9 18.3385 9 17.9505V9.27922C9 7.70946 9 6.92459 9.45332 6.37163C9.90663 5.81867 10.6763 5.66475 12.2155 5.35689L14.2155 4.95689C16.4291 4.51417 17.536 4.29281 18.268 4.89292C19 5.49304 19 6.62176 19 8.87922V9M19 14V15.9505C19 16.3385 19 16.5325 18.9706 16.7021C18.8506 17.394 18.3765 17.9724 17.7215 18.2257C17.561 18.2878 17.3708 18.3258 16.9903 18.4019L16.6942 18.4612C16.4199 18.516 16.2827 18.5435 16.1714 18.553C15.0909 18.646 14.1332 17.8608 14.0124 16.7831C14 16.6721 14 16.5322 14 16.2525V16.2525C14 16.018 14 15.9008 14.0098 15.802C14.1041 14.854 14.854 14.1041 15.802 14.0098C15.9008 14 16.018 14 16.2525 14H19ZM19 14V9M19 9L9 11" stroke="#222222" stroke-width="1.2"/>
</svg>

const playIcon =<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM9.73666 7.86847L16.2111 11.1057C16.9482 11.4742 16.9482 12.526 16.2111 12.8946L9.73666 16.1318C8.93878 16.5308 8 15.9506 8 15.0585V8.94178C8 8.04972 8.93878 7.46953 9.73666 7.86847Z" fill="#2A4157" fill-opacity="0.24"/>
<path d="M16.2111 11.1056L9.73666 7.86833C8.93878 7.46939 8 8.04958 8 8.94164V15.0584C8 15.9504 8.93878 16.5306 9.73666 16.1317L16.2111 12.8944C16.9482 12.5259 16.9482 11.4741 16.2111 11.1056Z" stroke="#222222" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="12" cy="12" r="9" stroke="#222222" stroke-width="1.2"/>
</svg>



const color = "#FFFFFF";

const theme = createTheme({
  shape: {
    borderRadius: 20
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#ebdbd1',
    },
    secondary: {
      main: '#f50057',
    },
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

export default function ArtistsOption({artist, session}) {
    const [open, setOpen] = React.useState(false);
    const [playerVisible, setPlayerVisible] = React.useState(null);
    const [trackUri, setTrackUri] = React.useState(null);

    const { provider_token, user } = session


    const handleDateRangeChange = (newValue) => {
      setDateRange(newValue);
    };
    const handleChange = (event) => {
      setAge(Number(event.target.value) || '');
    };
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      // if (reason !== 'backdropClick') {
      setPlayerVisible(false)
      setTrackUri(null)
      setOpen(false);
      // }
    };

    const playMuisc = (uri) => {
      setPlayerVisible(true)
      // setTrackUri(uri)
    }

  return (
    <div>
        <ThemeProvider theme={theme}>
        <Button onClick={handleClickOpen}>
          {musicIcon}
        </Button>
        <Dialog
          hideBackdrop={true}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              backgroundColor: '#D99477', //#e5d7cc
              // boxShadow: 'none',
            },
          }}
        >
          <DialogTitle>Top Songs</DialogTitle>
          <DialogContent>

          {artist.topSongs.tracks.slice(0,5).map((track) => {
            return(
              <div className={styles.artistSongs}>
                <img className={styles.artistsongimg}src={track.album.images[0].url} />
                {track.name.length > 30 ? (
                  <h2 className={styles.artistSongTitle}>
                    {track.name.substring(0, 30)}
                    ...
                  </h2>
                ) : (
                  <h2 className={styles.artistSongTitle}>
                    {track.name}
                  </h2>
                )}
                {track.is_playable == true ? (
                    <Button onClick={() => {
                      setTrackUri(track.uri)
                      setPlayerVisible(true)
                    }
                    }>
                        {playIcon}
                    </Button>
                ) : (
                    <h2>Not Playable</h2>
                )}
                
                </div>
            )
          })}

          { playerVisible == true ? (
            <div className={styles.playerText}>
              <SpotifyPlayer
              token={provider_token}
              uris={[trackUri]}
              play={true}
              hideAttribution={true}
              hideCoverArt={false}
              layout={'responsive'}
              styles={{
                activeColor: '#fff',
                bgColor: '#D99477',
                color: '#fff',
                loaderColor: '#fff',
                sliderColor: '#fff',
                trackNameColor: '#fff',
                trackArtistColor : '#fff',
              }}
              />
            </div>
            ) : (
              null
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}
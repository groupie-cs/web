import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { Inter } from "@next/font/google"
import styles from '@/styles/Home.module.css'

import SpotifyPlayer from 'react-spotify-web-playback';

const inter = Inter({ subsets: ['latin'] })

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
      main: color,
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

export default function ArtistSongs({artist, session}) {
    const [playerVisible, setPlayerVisible] = React.useState(null);
    const [trackUri, setTrackUri] = React.useState(null);

    const { provider_token, user } = session


    const handleDateRangeChange = (newValue) => {
      setDateRange(newValue);
    };
    const handleChange = (event) => {
      setAge(Number(event.target.value) || '');
    };
  
    const handleClose = (event, reason) => {
      // if (reason !== 'backdropClick') {
      setPlayerVisible(false)
      setTrackUri(null)
      // }
    };

    const playMuisc = (uri) => {
      setPlayerVisible(true)
      // setTrackUri(uri)
    }

  return (
    <div>
        <ThemeProvider theme={theme}>
        <Box
          hideBackdrop={true}
          onClose={handleClose}
          bgColor={'#D99477'}
        >
          <h2>Top Songs</h2>

          {artist.topSongs.tracks.slice(0,5).map((track) => {
            return(
              <div className={styles.artistSongs} >
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
        </Box>
      </ThemeProvider>
    </div>
  );
}
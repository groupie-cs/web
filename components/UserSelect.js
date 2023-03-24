import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";
import Geocode from "react-geocode";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
const inter = Inter({ subsets: ['latin'] })


const filterIcon = <img src={ "https://api-private.atlassian.com/users/97bc37c989b435233b603890fe94c982/avatar" || avatar_url} width="24" height="24" alt="Avatar" />;

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

export default function UserSelect({ supabase, username, user, av}) {
  const [open, setOpen] = React.useState(false);
  const [Password, setPassword] = React.useState("");
  const [Email, setEmail] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    // if (reason !== 'backdropClick') {
    setOpen(false);
    // }
  };

  const PasswordInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      color: 'white',
      borderRadius: 12,
      position: 'relative',
      // backgroundColor: theme.palette.background.paper,
      border: '1px solid #FFFFFF',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '"Inter"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 12,
        borderColor: '#FFFFFF',
        // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }));

  const EmailInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      color: 'white',
      borderRadius: 12,
      position: 'relative',
      // backgroundColor: theme.palette.background.paper,
      border: '1px solid #FFFFFF',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '"Inter"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 12,
        borderColor: '#FFFFFF',
        // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }));

  async function updateEmail({ Email }) {
    try {
        setLoading(true)

        alert('Email updated!')
    } catch (error) {
        alert('Error updating Email!')
        console.log(error)
    } finally {
        setLoading(false)
    }
}

async function updatePassword({ Password }) {
  try {
      setLoading(true)

      let { error } = await supabase.auth.resetPasswordForEmail(Email)

      if (error) throw error

      alert('Password updated!')
  } catch (error) {
      alert('Error updating Password!')
      console.log(error)
  } finally {
      setLoading(false)
  }
}


  PasswordInput.defaultProps = {
    defaultValue: Password,
  };

  EmailInput.defaultProps = {
    defaultValue: Email,
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Button onClick={handleClickOpen}>
          {filterIcon}
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
          <DialogTitle onload="myFunction()" align='center'>Hi {username || "User"}!</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: 'grid' }}>
            <FormControl sx={{ m: 1 }} variant="standard" defaultValue="Test">
                <EmailInput id="demo-customized-textbox"/>
              </FormControl>
            <FormControl sx={{ m: 1 }} variant="standard">
                <Button onClick={() => updateEmail({ Email })}>Update Email</Button>
              </FormControl>
              <FormControl sx={{ m: 1 }} variant="standard" defaultValue="Test">
                <PasswordInput id="demo-customized-textbox"/>
              </FormControl>
              <FormControl sx={{ m: 1 }} variant="standard">
                <Button onClick={() => updatePassword({ Password })}>Update Password</Button>
              </FormControl>
              <FormControl sx={{ m: 1 }} variant="standard">
                <Button onClick={() => supabase.auth.signOut()}>Logout</Button>
              </FormControl>
            </Box>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}
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
import { Inter } from "next/font/google"
import '@/styles/Home.module.css'
const inter = Inter({ subsets: ['latin'] })
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useRef } from "react";




const filterIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M20 5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V6.58579C4 6.851 4.10536 7.10536 4.29289 7.29289L8.7071 11.7071C8.89464 11.8946 8.99999 12.149 8.99999 12.4142V19.3063C8.99999 19.6476 9.33434 19.8886 9.65811 19.7806L14.6581 18.114C14.8623 18.0459 15 17.8548 15 17.6396V12.4142C15 12.149 15.1054 11.8946 15.2929 11.7071L19.7071 7.29289C19.8946 7.10536 20 6.851 20 6.58579V5Z" fill="#2A4157" fillOpacity="0.24" />
  <path d="M9.65811 19.7806L9.84784 20.3498H9.84784L9.65811 19.7806ZM14.6581 18.114L14.8478 18.6832H14.8478L14.6581 18.114ZM19.7071 7.29289L20.1314 7.71716L19.7071 7.29289ZM15.2929 11.7071L14.8686 11.2828L15.2929 11.7071ZM5 4.6H19V3.4H5V4.6ZM4.6 6.58579V5H3.4V6.58579H4.6ZM9.13136 11.2828L4.71716 6.86863L3.86863 7.71716L8.28284 12.1314L9.13136 11.2828ZM8.39999 12.4142V19.3063H9.59999V12.4142H8.39999ZM8.39999 19.3063C8.39999 20.0571 9.13556 20.5873 9.84784 20.3498L9.46837 19.2114C9.53312 19.1898 9.59999 19.238 9.59999 19.3063H8.39999ZM9.84784 20.3498L14.8478 18.6832L14.4684 17.5448L9.46837 19.2114L9.84784 20.3498ZM14.8478 18.6832C15.297 18.5335 15.6 18.1131 15.6 17.6396H14.4C14.4 17.5966 14.4275 17.5584 14.4684 17.5448L14.8478 18.6832ZM15.6 17.6396V12.4142H14.4V17.6396H15.6ZM19.2828 6.86863L14.8686 11.2828L15.7172 12.1314L20.1314 7.71716L19.2828 6.86863ZM19.4 5V6.58579H20.6V5H19.4ZM20.1314 7.71716C20.4314 7.4171 20.6 7.01013 20.6 6.58579H19.4C19.4 6.69187 19.3579 6.79361 19.2828 6.86863L20.1314 7.71716ZM15.6 12.4142C15.6 12.3081 15.6421 12.2064 15.7172 12.1314L14.8686 11.2828C14.5686 11.5829 14.4 11.9899 14.4 12.4142H15.6ZM8.28284 12.1314C8.35785 12.2064 8.39999 12.3081 8.39999 12.4142H9.59999C9.59999 11.9899 9.43142 11.5829 9.13136 11.2828L8.28284 12.1314ZM3.4 6.58579C3.4 7.01013 3.56857 7.4171 3.86863 7.71716L4.71716 6.86863C4.64214 6.79361 4.6 6.69187 4.6 6.58579H3.4ZM19 4.6C19.2209 4.6 19.4 4.77909 19.4 5H20.6C20.6 4.11634 19.8837 3.4 19 3.4V4.6ZM5 3.4C4.11634 3.4 3.4 4.11634 3.4 5H4.6C4.6 4.77909 4.77909 4.6 5 4.6V3.4Z" fill="#222222" />
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
    MuiFormLabel: {
      styleOverrides: {
        root: {
         
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {

          color,
        
          
        }
       
      }
    },
  
    MuiInputBase: {
      styleOverrides: {
        root: {
          color,
        }
      }
    }
  }
});

const CustomInputLabel = styled(InputLabel)({
  padding: '18px',
  // copy all original styles from MuiInputLabel
  color: (props) => props.theme.palette.text.primary,
  fontSize: (props) => props.theme.typography.pxToRem(16),
  fontWeight: (props) => props.theme.typography.fontWeightBold,
  lineHeight: 1,
  '&.Mui-focused': {
    color: (props) => props.theme.palette.text.primary,
  },
  '&.Mui-disabled': {
    color: (props) => props.theme.palette.text.disabled,
  },
});

const LocationInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& -MuiInputLabel-root': {
    left: '20px',
    top: '30px',
    position:'relative',
    
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

const MinPriceInput = styled(InputBase)(({ theme }) => ({
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

const MaxPriceInput = styled(InputBase)(({ theme }) => ({
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
    //   // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));


export default function DialogSelect({session, groupId, onSubmit}) {
  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState('');
  const [lat, setLat] = React.useState(null);
  const [lng, setLng] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [city, setCity] = React.useState("Loading Location");
  const [firstDate, setFirstDate] =  React.useState(null);
  const [secondDate, setSecondDate] = React.useState(null);
  const [state, setState] = useState({
    firstDate: null,
    secondDate: null
  });

  const [filterSettings, setFilterSettings] = React.useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    firstDate: '',
    secondDate: '',
  });

  

  const supabase = useSupabaseClient()

  const inputRef = useRef(null);

  React.useEffect(() => {
    getLocation();
  }, []);

  

  

  const handleClickOpen = () => {
    
    setOpen(true);
    checkFilters();
    console.log("Checked Filters");
    console.log("FINISHED CHECK " + filterSettings[0]);
  };

  const user = useUser();

  async function checkFilters() {

    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)

    if(error) console.log(error)
   
    filterSettings[0] = city;

    console.log("THIS IS LOCATION" + filterSettings[0]);

    if (users[0].filters != null) {
      console.log("FILTERS NOT NULL");
      console.log(users[0].filters);
      setFilterSettings(users[0].filters);

    } 
   

    console.log(filterSettings[0]);
  
  }

  const handleClose = (event, reason) => {
    console.log("CLOSED")
    // if (reason !== 'backdropClick') {
    setOpen(false);
    // }
  };

// TODO COMPLETE ***********************
// HAVE FILTER MAKE CALLBACK INTO CONCERT DATA AND THEN INTO CYCLER. THIS CALLBACK SHOULD PASS THROUGH THE FILTER DATA ALL THE WAY INTO 
// GET PROFILES IN CYCLER AND THEN IN THE GETPROFILE(), have the function RECALL THE TICKETMASTER API WITH UPDATED FILTERS
// OR, PASS THORUGH GENRES INTO CONCERTDATA, AND THEN REMAKE THE TICKETMASTERAPI FUNCTION THERE IN ORDER TO JUST HAVE IT REFRESH ONLY ITSELF, MAY BE EASIER
  

// TODO, CHECK ON UPDATING AND CHECKING THE FILTERS PROPERLY IN SUPABASE, TRY TO PREPOPULATE THE DATES
  async function updateFilters() {
    console.log("FILTER SETTINGS HERE");
    console.log(filterSettings);
    console.log("GROUP ID HERE " + groupId);
    //console.log(firstDate);
    var fixFirstDate = firstDate.format('YYYY-MM-DDTHH:mm:ssZ');
    var fixSecondDate = secondDate.format('YYYY-MM-DDTHH:mm:ssZ');
    console.log(fixFirstDate)
    const filters = [filterSettings[0], filterSettings[1], filterSettings[2], fixFirstDate, fixSecondDate];
    const { error: error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          filters: filters
        });

      if (error) throw error

      


    if (groupId != null) {

      const { error: updateError } = await supabase
        .from('groups')
        .upsert({
          'group_id': groupId,
          filters: filters});

      if (updateError) throw updateError
        
      console.log("FILTERS UPDATED")
      
    
    }

    onSubmit(filters);
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        setStatus(null);
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        console.log("Location Retrived!");
        console.log(position);
        Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
          (response) => {
            const address = response.results[0].formatted_address;
            let city, state, country;
            for (let i = 0; i < response.results[0].address_components.length; i++) {
              for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
                switch (response.results[0].address_components[i].types[j]) {
                  case "locality":
                    city = response.results[0].address_components[i].long_name;
                    break;
                  case "administrative_area_level_1":
                    state = response.results[0].address_components[i].long_name;
                    break;
                  case "country":
                    country = response.results[0].address_components[i].long_name;
                    break;
                }
              }
            }
           // console.log(city, state, country);
            //console.log(address);
            setCity(city);
          },
          (error) => {
            console.error(error);
          }
        );
      }, () => {
        setStatus('Unable to retrieve your location');
      });
    }
  }

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormState(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }));
  // }

  // const [formState, setFormState] = useState({
  //   location: '',
  //   minPrice: '',
  //   maxPrice: '',
  // });

  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("SUBMITTED FILTER");
    updateFilters();
    setOpen(false);
  }

  if (filterSettings == null) {
    console.log("NULL!")
  }

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
          <DialogTitle>Filter Concerts</DialogTitle>
          <DialogContent>
            <div ref={inputRef}>
              <Box component="form" sx={{ display: 'grid' }}>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <CustomInputLabel htmlFor="location">Location</CustomInputLabel>
                  <LocationInput
                  type="text"
                  id="location"
                  name="location"
                  value={filterSettings[0] || ''}
                  onChange={(event) =>
                    setFilterSettings({
                      ...filterSettings,
                      [0]: event.target.value,
                    })}
                  
                  />
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <CustomInputLabel htmlFor="minPrice">Minimum Price</CustomInputLabel>
                  <MinPriceInput
                  type="text"
                  id="minPrice"
                  name="minPrice"
                  value={filterSettings[1] || ''}
                  onChange={(event) =>
                    setFilterSettings({
                      ...filterSettings,
                      [1]: event.target.value,
                    })}
                  />
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <CustomInputLabel htmlFor="maxPrice">Maximum Price</CustomInputLabel>
                  <MaxPriceInput
                  type="text"
                  id="maxPrice"
                  name="maxPrice"
                  value={filterSettings[2] || ''}
                  onChange={(event) =>
                    setFilterSettings({
                      ...filterSettings,
                      [2]: event.target.value,
                    })}
                
                  />
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      id="beginning"
                      label={"Start Search Date"}
                      value={firstDate}
                      onChange={(newValue) => setFirstDate(newValue)}
                      borderColor="white"
                      renderInput={(startProps) => (
                        <>
                          <input
                            {...startProps.inputProps}
                          />
                        </>
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      id="end"
                      label="End Search Date"
                      value={secondDate}
                      onChange={(newValue) => setSecondDate(newValue)}
                      renderInput={(startProps) => (
                        <>
                          <input
                            {...startProps.inputProps}
                            placeholder="End Search Date"
                          />
                        </>
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Box>
            </div>
            
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Ok</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
        
    </div>
  );
}
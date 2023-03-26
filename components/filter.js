import React, { useState, useEffect, useRef } from "react";
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

import styles from '@/styles/Home.module.css'

const filterIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M20 5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V6.58579C4 6.851 4.10536 7.10536 4.29289 7.29289L8.7071 11.7071C8.89464 11.8946 8.99999 12.149 8.99999 12.4142V19.3063C8.99999 19.6476 9.33434 19.8886 9.65811 19.7806L14.6581 18.114C14.8623 18.0459 15 17.8548 15 17.6396V12.4142C15 12.149 15.1054 11.8946 15.2929 11.7071L19.7071 7.29289C19.8946 7.10536 20 6.851 20 6.58579V5Z" fill="#2A4157" fillOpacity="0.24" />
  <path d="M9.65811 19.7806L9.84784 20.3498H9.84784L9.65811 19.7806ZM14.6581 18.114L14.8478 18.6832H14.8478L14.6581 18.114ZM19.7071 7.29289L20.1314 7.71716L19.7071 7.29289ZM15.2929 11.7071L14.8686 11.2828L15.2929 11.7071ZM5 4.6H19V3.4H5V4.6ZM4.6 6.58579V5H3.4V6.58579H4.6ZM9.13136 11.2828L4.71716 6.86863L3.86863 7.71716L8.28284 12.1314L9.13136 11.2828ZM8.39999 12.4142V19.3063H9.59999V12.4142H8.39999ZM8.39999 19.3063C8.39999 20.0571 9.13556 20.5873 9.84784 20.3498L9.46837 19.2114C9.53312 19.1898 9.59999 19.238 9.59999 19.3063H8.39999ZM9.84784 20.3498L14.8478 18.6832L14.4684 17.5448L9.46837 19.2114L9.84784 20.3498ZM14.8478 18.6832C15.297 18.5335 15.6 18.1131 15.6 17.6396H14.4C14.4 17.5966 14.4275 17.5584 14.4684 17.5448L14.8478 18.6832ZM15.6 17.6396V12.4142H14.4V17.6396H15.6ZM19.2828 6.86863L14.8686 11.2828L15.7172 12.1314L20.1314 7.71716L19.2828 6.86863ZM19.4 5V6.58579H20.6V5H19.4ZM20.1314 7.71716C20.4314 7.4171 20.6 7.01013 20.6 6.58579H19.4C19.4 6.69187 19.3579 6.79361 19.2828 6.86863L20.1314 7.71716ZM15.6 12.4142C15.6 12.3081 15.6421 12.2064 15.7172 12.1314L14.8686 11.2828C14.5686 11.5829 14.4 11.9899 14.4 12.4142H15.6ZM8.28284 12.1314C8.35785 12.2064 8.39999 12.3081 8.39999 12.4142H9.59999C9.59999 11.9899 9.43142 11.5829 9.13136 11.2828L8.28284 12.1314ZM3.4 6.58579C3.4 7.01013 3.56857 7.4171 3.86863 7.71716L4.71716 6.86863C4.64214 6.79361 4.6 6.69187 4.6 6.58579H3.4ZM19 4.6C19.2209 4.6 19.4 4.77909 19.4 5H20.6C20.6 4.11634 19.8837 3.4 19 3.4V4.6ZM5 3.4C4.11634 3.4 3.4 4.11634 3.4 5H4.6C4.6 4.77909 4.77909 4.6 5 4.6V3.4Z" fill="#222222" />
</svg>


export default function Filter() {
  const [isOpen, setIsOpen] = useState(false);

  const refOne = useRef(null)

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true)
    document.addEventListener("click", hideOnClickOutside, true)
  })

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const handleClick = () => {
    setIsOpen(!isOpen);
  }

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  console.log("Filtering")

  return (

    <>
      <div className={styles.center}>
        <div className={styles.app}>
          <div className={styles.filter}>
            <button onClick={handleClick}>
              {filterIcon}
              {/* <span>Filter</span> */}
            </button>
            <div ref={refOne}>
              {isOpen && <FilterPopup />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterPopup() {
  const supabase = useSupabaseClient();
  const user = useUser()

  const url = 'https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=M6Sn1Qxk66pq6wvy81A6AsFQIgGG3sso&classificationName=music'

  const [displayState, setDisplayState] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);

  const handleDateRangeChange = (newValue) => {
    setDateRange(newValue);
  };


  const [formState, setFormState] = useState({
    location: '',
    priceFloor: '',
    priceCeiling: '',
    startDate: '',
    endDate: ''
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisplayState(formState);
    const filters = [displayState.location, displayState.priceFloor, displayState.priceCeiling, displayState.dateRange]
  }
  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
      {/* <div style={{ paddingTop: '1%' }}> */}
        <label htmlFor="location">Location</label>
        <input type="text" id="location" name="location" value={formState.location} onChange={handleChange} placeholder="Where do you want to find a concert?" />
      {/* </div> */}
      {/* <div> */}
        <label htmlFor="priceFloor">Cheapest Price Preference</label>
        <input type="text" id="priceFloor" name="priceFloor" value={formState.priceFloor} onChange={handleChange} placeholder="Lower Price Range" />
      {/* </div> */}
      {/* <div> */}
        <label htmlFor="priceCeiling">Most Expensive Price Preference</label>
        <input type="text" id="priceCeiling" name="priceCeiling" value={formState.priceCeiling} onChange={handleChange} placeholder="Higher Price Range" />
      {/* </div> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          startText="Start date"
          value={dateRange}
          onChange={handleDateRangeChange}
          renderInput={(startProps) => (
            <>
              <input
                {...startProps.inputProps}
                placeholder="Start Date"
              />
            </>
          )}
        />
      </LocalizationProvider>
      <button type="submit">Submit</button>
    </form>
  )
}
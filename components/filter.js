import React, { useState, useEffect, useRef  } from "react";
import MyIcon from './filter_logo.png';
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";
//import { DateRangePicker } from '@mui/x-date-pickers/DateRangePicker';
//import { DateRangePicker } from '@mui/lab';
//import AdapterDateFns from '@mui/lab/AdapterDateFns';

import styles from '@/styles/Home.module.css'

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
      if ( refOne.current && !refOne.current.contains(e.target) ) {
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
                <img src={MyIcon} alt="MyIcon" />
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
    }
    return (
      <div className={styles.center}>
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
              Please fill out your Concert Filter Preferences:
              <div style={{paddingTop:'1%'}}>
                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" value={formState.location} onChange={handleChange}  placeholder="Where do you want to find a concert?"  />
              </div>
              <div>
                <label htmlFor="priceFloor">Cheapest Price Preference</label>
                <input type="text" id="priceFloor" name="priceFloor" value={formState.priceFloor} onChange={handleChange}  placeholder="Lower Price Range"/>
              </div>
              <div>
                <label htmlFor="priceCeiling">Most Expensive Price Preference</label>
                <input type="text" id="priceCeiling" name="priceCeiling" value={formState.priceCeiling} onChange={handleChange}  placeholder="Higher Price Range"/>
              </div>
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
          </div>
        </div>
      </div>
    )
  }


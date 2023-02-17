import React, { useState } from "react";
import DateRange from "./dateRange";

function Filter() {
    const [formState, setFormState] = useState({
      location: '',
      priceFloor: '',
      priceCeiling: '',
      startDate: '',
      endDate: ''
    });
  
    const [displayState, setDisplayState] = useState(null);
  
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

    const url = 'https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=M6Sn1Qxk66pq6wvy81A6AsFQIgGG3sso'
  
    return (
      <div>
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
           <div>
            <label htmlFor="startDate">Start Date</label>
            <input type="text" id="startDate" name="startDate" value={formState.startDate} onChange={handleChange}  placeholder="Start Date displayed as MM/DD/YYYY"/>
          </div>
          <div>
            <label htmlFor="endDate">End Date</label>
            <input type="text" id="endDate" name="endDate" value={formState.endDate} onChange={handleChange} placeholder="End Date displayed as MM/DD/YYYY"/>
          </div>
          <div>

          </div>
          <button type="submit">Submit</button>
        </form>
        {displayState && (
          <div>
            <h2>Filter Preferences:</h2>
            <ul>
              <li>Locaiton: {displayState.location}</li>
              <li>Price Floor: {displayState.priceFloor}</li>
              <li>Price Ceiling: {displayState.priceCeiling}</li>
              <li>Date Start: {displayState.startDate}</li>
              <li>Date End: {displayState.endDate}</li>
              <li>Url: {url + '&keyword=' + '&radius=' + 50 + '&startDateTime=' + displayState.startDate + '&endDateTime=' + displayState.endDate + '&city=' + displayState.location}</li>

            </ul>
          </div>
        )}
      </div>
    );
  }
  
  export default Filter;

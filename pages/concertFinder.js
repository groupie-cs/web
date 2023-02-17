import Filter from '../components/filter';
import React from 'react';

class ConcertFinder extends React.Component {
   state = {
      // Spotify Username
      name: undefined,
      // Filled out using spotify top artists
      artists: undefined,
      // 
      events: [],
      isSearchDisabled: false,
      isFinished: true
   }

   // Finds concerts from Ticketmaster API for artists found in state.artists based on filter options

   getConcerts = async (e) => {
      e.preventDefault();
      
      // prevent excess spam of Ticketmaster API by checking if search is empty
      if (e.target.elements.location.value) {
         
         // disable search twice to reduce API calls
         this.setState({ isSearchDisabled: true });

         // clear events
         this.setState({ events: [] });

         // wait on searches
         this.setState({ isFinished: false });

         const url = 'https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=M6Sn1Qxk66pq6wvy81A6AsFQIgGG3sso'
         
         // filter values
         // TODO **** Ticketmaster Does not allow to search by price range, will have to be implemented after found concerts
         const city = e.target.elements.location.value;
         const priceFloor = e.target.elements.priceFloor.value;
         const priceCeiling = e.target.elements.priceCeiling.value;
         // TODO *******************************************************************************
         const priceRanges = [priceFloor, priceCeiling];
         const startDateTime = e.target.elements.startDate.value;
         const endDateTime = e.target.elements.endDate.value;
         const radius = '50';

         var limiter = setInterval(finder, 50);
         function finder() {
            // GRAYSON TODO ************
            // Fill artists using Spotify API
            for (i = 0; i < this.state.artists.length; i++) {
               var new_url = url + '&keyword=' + this.state.artists[i].name + '&radius=' + radius + '&startDateTime=' + startDateTime + '&endDateTime=' + endDateTime + '&city=' + city;
               fetch(new_url)
                     .then(response => response.json())
                     .then(data => data._embedded && this.setState({ events: this.state.events.concat(data._embedded.events) }));
            }    

            clearInterval(limiter);
            this.setState({ isSearchDisabled: false });
            this.setState({ isFinished: true });
         }
      }
   }

   render() {
      return (
         <div>
            <Filter
               //name={this.state.name}
               isSearchDisabled={this.state.isSearchDisabled}
               getConcerts={this.getConcerts}
            />
         </div>
      );
   }
}

export default ConcertFinder;
  

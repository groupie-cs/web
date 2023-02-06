import React from "react";
import DateRangePicker from "./dateRangePicker";

import icon from '../public/ticketmasterPlaceholder.jpeg';

class Filter extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.getConcerts} style={{ textAlign: 'center' }}>

                Please fill out your Concert Filter Preferences:
                <div style={{paddingTop:'1%'}}>
                    <img src={icon} alt={"icon"} height={"30"} style={{verticalAlign:'middle'}} />
                    <input type="text" name="location" disabled={this.props.isSearchDisabled} placeholder="Your city..." />
                    <input type="text" name="priceFloor" disabled={this.props.isSearchDisabled} placeholder="How poor are you?" />
                    <input type="text" name="priceCeiling" disabled={this.props.isSearchDisabled} placeholder="How rich are you?" />
                    <DateRangePicker />
                </div>
            </form>
        );
    }
}

export default Filter;
import React from 'react';
import ReactDOM from 'react-dom';
import WeatherCard from './weatherCard';
import './assets/styles/salesforce-lightning-design-system.css';
//import testWeather from './testWeather.json';
import cities from './cities.json';

class WeatherApp extends React.Component{
    state = {
        weatherData: [], //array of all weather
        units: "imperial",
        cities: cities.list, //array of city id and name
        selectedCity: "",
        lastUpdate: null,
    }

    tick() {
        //update weather data
        this.fetchWeather(this.state.units);
    }

    componentDidMount() {
        //update every 10 minutes
        this.interval = setInterval(() => this.tick(), 1000 * 60 * 10);
        this.fetchWeather();
    }

    fetchWeather() {
        //get city data
        if(this.state.cities === [] || this.state.cities.length === 0){
            this.getCities();
        }

        //used for testing only
        //this.setState({weatherData: testWeather.list});

        //fetch data with cityIDs
        //use metric. weather card unit conversions assume metric

        let ids = this.getCityIDs();
        if(ids){
            let uri = `https://api.openweathermap.org/data/2.5/group?id=${ids}&APPID=9140e0acca065aedda597e2f3aea453b&units=metric`;
            fetch(uri)
            .then(res => res.json())
            .then(data => this.setState({ weatherData: data.list, lastUpdate: new Date().toString() }));}
        }

    getCities() {
        //returns values from cities.json
        //could be used to query city data instead
        return(cities.list)
    }

    getCityIDs(){
        if(this.state.cities === null || this.state.cities === []){
            return null;
        }

        //create string of ids separated by comma
        let ids = this.state.cities[0].id;

        for(let i = 1; i < this.state.cities.length; i++){
            ids += "," + this.state.cities[i].id;
        }

        return ids;
    }

    handleCityChange = (e) => {
        this.setState({ selectedCity: e.target.value });
    }

    getSelectedWeather(curCity){
        let weatherData = this.state.weatherData;
        
        //return array based on city selection
        if(curCity === ""){
            return [];
        }else if(curCity === "0"){
            return weatherData;
        }else{
            let curWeather = Array(1).fill(null);

            for(let i = 0; i < weatherData.length; i++){
                if(weatherData[i].id.toString() === curCity){
                    curWeather[0] = weatherData[i];
                    break;
                }
            }
            return curWeather;
        }
    }

    handleUnitChange = (e) => {
        this.setState({ units: e.target.value });
    }

    render(){
        //get the weather to display
        let selectedWeather = this.getSelectedWeather(this.state.selectedCity);

        return (
            <div>
                <WeatherOptions cities={this.state.cities} onCityChange={this.handleCityChange} onUnitChange={this.handleUnitChange} selectedUnits={this.state.units}/>
                
                <div>
                    Last Update: {this.state.lastUpdate}
                </div>
                <div className="slds-grid slds-gutters ">
                    <div className="slds-col">
                        {selectedWeather.map((data) => 
                            <WeatherCard key={data.main.name} weatherData={data} units={this.state.units} />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

//displays city and unit selection box
const WeatherOptions = (props) => {
    return(
            <div className="slds-box slds-theme_default slds-m-bottom_medium">
                <div>
                    <span className="slds-text-heading_small">City</span>
                    <div>
                        <select value={props.selectedCity} onChange={props.onCityChange}>
                            <option value=""></option>
                            <option value="0">All</option>
                            {props.cities.map((city) =>
                                <option key={city.id} value={city.id}>{city.name}</option>
                            )}
                        </select>
                    </div>
                </div>
                
                <div className="slds-m-top_small">
                    <span className="slds-text-heading_small">Units</span>
                    <div>
                        <input type="radio" name="units" value="imperial" onChange={props.onUnitChange} checked={props.selectedUnits === "imperial"}/> American<br />
                        <input type="radio" name="units" value="metric" onChange={props.onUnitChange} checked={props.selectedUnits === "metric"}/> Not American<br />
                        <input type="radio" name="units" value=""  onChange={props.onUnitChange} checked={props.selectedUnits === ""}/> Science
                    </div>
                </div>
            </div>
        )
}

ReactDOM.render(<WeatherApp />, document.getElementById('weather-container'));


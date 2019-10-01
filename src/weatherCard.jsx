import React from 'react';
import './assets/styles/salesforce-lightning-design-system.css';

const WeatherCard = (props) => {
  let weatherData = props.weatherData;

  //return null if there is no weather data
  if(!weatherData){
    return(null)
  }

  //default width for description list
  let dlWidth = {
    width:"370px"
  }

  let degree, windUnit, temp, speed;
  
  //value conversions
  switch(props.units){
    case "imperial":
      temp = (weatherData.main.temp * (9/5) + 32).toFixed(2);
      speed = (weatherData.wind.speed / 1.609).toFixed(2);
      degree = "\u2109";
      windUnit = "mph";
      break;
    case "metric":
      temp = weatherData.main.temp;
      speed = weatherData.wind.speed;
      degree = "\u2103";
      windUnit = "kph";
      break;
    case "":
      temp = (weatherData.main.temp + 273.15).toFixed(2);
      speed = weatherData.wind.speed;
      degree = "K";
      windUnit = "kph"
      break;
    default:
        break;
  }

  return (
    <div className="slds-card">
        <div className="slds-card__header ">
          <header className="slds-media slds-media--center slds-has-flexi-truncate ">
            <div className="slds-media__figure ">
              <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}  alt={weatherData.weather[0].main} />
            </div>
            <div className="slds-media__body slds-truncate">
              <div className="slds-text-heading_medium">{weatherData.name}</div>
              <div className="slds-text-heading_clouds">{weatherData.weather[0].main}</div>
            </div>
          </header>
        </div>
        <div className="slds-card__body">
          <div className="slds-region_narrow slds-p-left_large slds-p-bottom_large" style={dlWidth}>
            <dl className="slds-dl_horizontal">
              <dt className="slds-dl_horizontal__label">Temperature:</dt>
              <dd className="slds-dl_horizontal__detail">{temp}{degree}</dd>
              <dt className="slds-dl_horizontal__label">Pressure:</dt>
              <dd className="slds-dl_horizontal__detail">{weatherData.main.pressure}  hPa</dd>
              <dt className="slds-dl_horizontal__label">Wind Speed:</dt>
              <dt className="slds-dl_horizontal__detail">{speed} {windUnit}</dt>
            </dl> 
          </div>
        </div>
    </div>
  )
};

export default WeatherCard;
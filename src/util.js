import React from 'react'
import {Circle, Popup} from 'react-leaflet'
const sortData = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

const casesTypeColors ={
  cases: {
    hex: '#cc1034',
    multiplier: 800
  },
  recovered: {
    hex: '#7dd71d',
    multiplier: 1200
  },
  deaths: {
    hex: '#868686',
    multiplier: 2000
  } 
}
const showDataOnMap = (data, casesType="cases") => data.map(country => {
  return <Circle 
    center={[country.countryInfo.lat,country.countryInfo.long]}
    fillOpacity={0.5}
    color={casesTypeColors[casesType].hex}
    radius={
      Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier
    }
  >
    <Popup  style={{backgroundColor: '#868686'}}>
      <div>
        <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}} ></div>
        <div className='info-country'>{country.country}</div>
        <div className='info-cases'>Cases: {Number(country.cases).toLocaleString()}</div>
        <div className='info-recovered'>Recovered: {Number(country.recovered).toLocaleString()}</div>
        <div className='info-death'>Deaths: {Number(country.deaths).toLocaleString()}</div>
      </div>
    </Popup>
  </Circle>
  })
export { sortData, showDataOnMap};

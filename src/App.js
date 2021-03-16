import React, { useEffect, useState } from "react";
import "./App.css";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import CountryTable from "./components/Table";
import { sortData } from "./util";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Card,
} from "@material-ui/core";
import LineGraph from "./components/LineGraph";
import 'leaflet/dist/leaflet.css'
import numeral from 'numeral'
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function App() {
  const classes = useStyles();
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryinfo, setCountryinfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 22, lng:17})
  const [mapZoom, setMapZoom] = useState(1.5)
  const [mapCountry, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')
  // useEffect - for dropdown countries
  useEffect(() => {
    // async -> async function it doesn't return value, returns promise
    const getCountriesData = async () => {
      // await -> first wait for the request to load then do something
      await fetch("https://disease.sh/v3/covid-19/countries")
        // promise
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data)
        });
    };
    getCountriesData();
  }, []);
  // useEffect - for worldwide data
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryinfo(data);
      });
  }, []);

  function changeFormat(num) {
    return `${numeral(num).format('0.0a')}`
  }

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?strict=true`;

    await fetch(url)
      .then((respose) => respose.json())
      .then((data) => {
        setCountryinfo(data);
         if(countryCode==="worldwide") { 
          setMapCenter({lat: 22, lng: 17}) 
          setMapZoom(1.5) 
        }else{
          setMapCenter([data?.countryInfo?.lat,data?.countryInfo?.long])
          setMapZoom(4)
        }
      }
      );
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 className="header__title">
            <img
              alt=""
              className="header__image"
              src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9IkZsYXQiPjxnIGZpbGw9IiNjNzQ4M2MiPjxwYXRoIGQ9Im0yODggNTZhMzIgMzIgMCAxIDAgLTQ4IDI3LjcwOHY1Mi4yOTJoMzJ2LTUyLjI5MmEzMS45NzggMzEuOTc4IDAgMCAwIDE2LTI3LjcwOHoiLz48cGF0aCBkPSJtMjI0IDQ1NmEzMiAzMiAwIDEgMCA0OC0yNy43MDh2LTUyLjI5MmgtMzJ2NTIuMjkyYTMxLjk3OCAzMS45NzggMCAwIDAgLTE2IDI3LjcwOHoiLz48cGF0aCBkPSJtOTguOCAxMjguMjg3YTMyIDMyIDAgMSAwIDAgNTUuNDI0bDQ1LjI4NiAyNi4xNDUgMTYtMjcuNzEyLTQ1LjI5NS0yNi4xNDRhMzEuOTc4IDMxLjk3OCAwIDAgMCAtMTUuOTkxLTI3LjcxM3oiLz48cGF0aCBkPSJtNDEzLjIwNSAzODMuNzEzYTMyIDMyIDAgMSAwIDAtNTUuNDI0bC00NS4yODYtMjYuMTQ1LTE2IDI3LjcxMiA0NS4yOSAyNi4xNDRhMzEuOTc4IDMxLjk3OCAwIDAgMCAxNS45OTYgMjcuNzEzeiIvPjxwYXRoIGQ9Im02Ni44IDMyOC4yODdhMzIgMzIgMCAxIDAgNDggMjcuNzE1bDQ1LjI4Ni0yNi4xNDYtMTYtMjcuNzEyLTQ1LjI5NSAyNi4xNDVhMzEuOTggMzEuOTggMCAwIDAgLTMxLjk5MS0uMDAyeiIvPjxwYXRoIGQ9Im00NDUuMjA1IDE4My43MTNhMzIgMzIgMCAxIDAgLTQ4LTI3LjcxNWwtNDUuMjg2IDI2LjE0NiAxNiAyNy43MTIgNDUuMjg2LTI2LjE0NWEzMS45OCAzMS45OCAwIDAgMCAzMiAuMDAyeiIvPjwvZz48cGF0aCBkPSJtNDg4IDI1NmEzMiAzMiAwIDAgMSAtNTkuNzEgMTZoLTM3LjIzYTEzNS44NjIgMTM1Ljg2MiAwIDAgMSAtNTMuNjcgOTIuOTdsMTguNjEgMzIuMjRhMzIgMzIgMCAxIDEgLTI3LjcxIDE2bC0xOC42LTMyLjIyYTEzNi40MTQgMTM2LjQxNCAwIDAgMSAtMTA3LjM4IDBsLTE4LjYgMzIuMjJhMzIgMzIgMCAxIDEgLTI3LjcxLTE2bDE4LjYxLTMyLjI0YTEzNi41NiAxMzYuNTYgMCAwIDEgLTM5LjY2LTQ2LjkyIDEzNS4wMzEgMTM1LjAzMSAwIDAgMSAtMTQuMDEtNDYuMDVoLTM3LjIzYTMyIDMyIDAgMSAxIDAtMzJoMzcuMjNhMTM1Ljg2MiAxMzUuODYyIDAgMCAxIDUzLjY3LTkyLjk3bC0xOC42MS0zMi4yNGEzMiAzMiAwIDEgMSAyNy43MS0xNmwxOC42IDMyLjIyYTEzNi40MTQgMTM2LjQxNCAwIDAgMSAxMDcuMzggMGw1LjU5LTkuNjkgMTMuMDEtMjIuNTNhMzIgMzIgMCAxIDEgMjcuNzEgMTZsLTE4LjYxIDMyLjI0YTEzNS44NjIgMTM1Ljg2MiAwIDAgMSA1My42NyA5Mi45N2gzNy4yM2EzMiAzMiAwIDAgMSA1OS43MSAxNnoiIGZpbGw9IiNkNjUyNDYiLz48cGF0aCBkPSJtNDg4IDI1NmEzMiAzMiAwIDAgMSAtNTkuNzEgMTZoLTM3LjIzYTEzNS44NjIgMTM1Ljg2MiAwIDAgMSAtNTMuNjcgOTIuOTdsMTguNjEgMzIuMjRhMzIgMzIgMCAxIDEgLTI3LjcxIDE2bC0xOC42LTMyLjIyYTEzNi40MTQgMTM2LjQxNCAwIDAgMSAtMTA3LjM4IDBsLTE4LjYgMzIuMjJhMzIgMzIgMCAxIDEgLTI3LjcxLTE2bDE4LjYxLTMyLjI0YTEzNi41NiAxMzYuNTYgMCAwIDEgLTM5LjY2LTQ2LjkyIDE2MS42IDE2MS42IDAgMCAwIDI1LjA1IDEuOTUgMTYwLjA5MiAxNjAuMDkyIDAgMCAwIDE1NS4yOC0xOTguNjhsMTMuMDEtMjIuNTNhMzIgMzIgMCAxIDEgMjcuNzEgMTZsLTE4LjYxIDMyLjI0YTEzNS44NjIgMTM1Ljg2MiAwIDAgMSA1My42NyA5Mi45N2gzNy4yM2EzMiAzMiAwIDAgMSA1OS43MSAxNnoiIGZpbGw9IiNjOTRjNDEiLz48ZyBmaWxsPSIjYzc0ODNjIj48Y2lyY2xlIGN4PSIyMjQiIGN5PSIyMjQiIHI9IjMyIi8+PGNpcmNsZSBjeD0iMzIwIiBjeT0iMjI0IiByPSIzMiIvPjxjaXJjbGUgY3g9IjIyNCIgY3k9IjMyMCIgcj0iMzIiLz48Y2lyY2xlIGN4PSIzMjAiIGN5PSIzMjAiIHI9IjMyIi8+PC9nPjxjaXJjbGUgY3g9IjIwOCIgY3k9IjIwOCIgZmlsbD0iI2RmNjI1NyIgcj0iMzIiLz48Y2lyY2xlIGN4PSIzMDQiIGN5PSIyMDgiIGZpbGw9IiNkZjYyNTciIHI9IjMyIi8+PGNpcmNsZSBjeD0iMjA4IiBjeT0iMzA0IiBmaWxsPSIjZGY2MjU3IiByPSIzMiIvPjxjaXJjbGUgY3g9IjMwNCIgY3k9IjMwNCIgZmlsbD0iI2RmNjI1NyIgcj0iMzIiLz48L2c+PC9zdmc+"
            />{" "}
            COVID-19 TRACKER
          </h1>
          <FormControl className={`${classes.formControl} header__dropdown`}>
            <InputLabel id="dsemo-simple-select-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={country}
              onChange={onCountryChange}
            >
              {/* Loop through all the countries show a dropdown list of the options */}
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            active={casesType === 'cases'}
            activeStyle={{borderTop: '10px solid #fe073a',backgroundColor: "rgb(255, 197, 208) "}}
            stylesText={{ color: "#fe073a" }}  
            stylesCard={{ backgroundColor: "rgb(255, 197, 208) " }}
            title="Confirmed"
            cases={changeFormat(countryinfo.todayCases)}
            total={changeFormat(countryinfo.cases)} 
            onClick = {e=> setCasesType("cases")}           
          />
          <InfoBox
            active={casesType === 'recovered'}
            activeStyle={{borderTop: '10px solid #28a645',backgroundColor: "rgb(228, 244, 232 "}}
            title="Recovered"
            stylesText={{ color: "#28a645" }}
            stylesCard={{ backgroundColor: "rgb(228, 244, 232" }}
            cases={changeFormat(countryinfo.todayRecovered)}
            total={changeFormat(countryinfo.recovered)}
            onClick = {e=> setCasesType("recovered")}
          />
          <InfoBox
            activeStyle={{borderTop: '10px solid #6c757d',backgroundColor: "rgb(246, 246, 247 "}}
            active={casesType === 'deaths' }
            title="Deceased"
            styles={{ color: "#6c757d" }}
            stylesCard={{ backgroundColor: "rgb(246, 246, 247)" }}
            cases={changeFormat(countryinfo.todayDeaths)}
            total={changeFormat(countryinfo.deaths)}
            onClick = {e=> setCasesType("deaths")}
          />
        </div>
        <Map casesType={casesType} countries={mapCountry} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app__right">
        <h3 className="app__tabletitle">Live Cases By Country</h3>
        <CountryTable countries={tableData} />
        <h3 className="app__graphtitle">Worldwide - {casesType}</h3>
        <LineGraph  casesType={casesType} />
      </Card>
    </div>
  );
}

export default App;

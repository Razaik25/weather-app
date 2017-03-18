import React, {Component} from "react";
import {TextField, FlatButton, Card, CardActions, CardHeader, CardTitle, CardText} from "material-ui";
import axios from "axios";
import auth from "../auth";
import _ from "lodash";
import moment from "moment";

function processSearchResponse(data) {
  let dataToReturn = [];
  _.forEach(data, function (v) {
    let tempObj = {};
    tempObj.name = v.name;
    tempObj.country = v.sys.country;
    tempObj.weather_desc = v.weather[0].description;
    tempObj.icon = v.weather[0].icon;
    tempObj.temp = v.main.temp;
    tempObj.temp_max = v.main.temp_max;
    tempObj.temp_min = v.main.temp_min;
    tempObj.wind = v.wind.speed;
    tempObj.humidity = v.main.humidity;
    tempObj.clouds = v.clouds.all;
    tempObj.pressure = v.main.pressure;
    tempObj.location_id = v.id;
    tempObj.unix_timestamp = v.dt;
    dataToReturn.push(tempObj);
  });
  return dataToReturn;
}

class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: false,
      searchResult: null,
      savedLocations: null,
      searchQuery: ""
    };
    this.getLocations();
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSaveLocation = this.handleSaveLocation.bind(this);
    this.checkForUpdates = this.checkForUpdates.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    console.log("%c Home Component -> Init ", "background: red; color: white");
  }

  handleSaveLocation() {
    axios({
      method: 'post',
      url: '/weatherApp',
      headers: {'Authorization': `Bearer ${auth.getToken()}`},
      data: {
        name: this.state.searchResult[0].name,
        country: this.state.searchResult[0].country,
        weather_desc: this.state.searchResult[0].weather_desc,
        icon: this.state.searchResult[0].icon,
        temp: this.state.searchResult[0].temp,
        temp_max: this.state.searchResult[0].temp_max,
        temp_min: this.state.searchResult[0].temp_min,
        wind: this.state.searchResult[0].wind,
        humidity: this.state.searchResult[0].humidity,
        clouds: this.state.searchResult[0].clouds,
        pressure: this.state.searchResult[0].pressure,
        location_id: this.state.searchResult[0].location_id,
        unix_timestamp: this.state.searchResult[0].unix_timestamp
      }
    })
      .then(function (response) {
        console.log("weather locations", response);
        this.setState({
          searchResult: null,
          searchQuery: "",
          snackBarMsg: `${this.state.searchResult[0].name} saved successfully`
        });
        this.getLocations();
      }.bind(this))
      .catch(function (error) {
        console.error(error);
        this.setState({
          snackBarMsg: `There was an error in saving, please try again`
        });
      }.bind(this));
  }

  handleDeleteLocation(locationId) {
    axios({
      method: 'delete',
      url: '/weatherApp/deletelocation',
      headers: {'Authorization': `Bearer ${auth.getToken()}`},
      data: {
        location_id: locationId
      }
    })
      .then(function (response) {
        console.log("deleted location", response);
        this.setState({
          snackBarMsg: `${response.data.name} location deleted successfully`
        })
      }.bind(this))
      .catch(function (error) {
        console.error(error);
      }.bind(this));
    this.getLocations();
  }

  handleClearSearch() {
    this.setState({
      searchResult: null
    });
  }

  renderLocations(locations, type) {
    let self = this;
    return locations.map(function (location) {
      let timestamp = moment.unix(location.unix_timestamp).format("DD MMM YYYY hh:mm a");
      return <div className="cardContainer" key={location.location_id}>
        <Card>
          <CardHeader
            title={location.name}
            subtitle={location.country}
            avatar={`http://openweathermap.org/img/w/${location.icon}.png`}
          />
          <CardTitle
            className="capitalize"
            title={location.weather_desc}
            subtitle={`${location.temp}°С`}/>
          <CardText>
            Wind: {`${location.wind} m/s`}<br/>
            Humidity: {`${location.humidity}%`}<br/>
            Clouds: {`${location.clouds}%`}<br/>
            Pressure: {`${location.pressure} hpa`}<br/>
            Last Updated: {timestamp}
          </CardText>
          <CardActions>
            <FlatButton
              label={type}
              primary={true}
              onTouchTap={type === "Save" ? () => self.handleSaveLocation() : () => self.handleDeleteLocation(location.location_id)}
            />
            {
              type === "Save" ?  <FlatButton
                label="Clear"
                primary={true}
                onTouchTap={self.handleClearSearch}
              />: ""
            }
          </CardActions>
        </Card>
      </div>;
    });
  }

  getLocations() {
    axios({
      method: 'get',
      url: '/weatherApp/getlocations',
      headers: {'Authorization': `Bearer ${auth.getToken()}`},
    })
      .then(function (response) {
        this.setState({
          savedLocations: response.data
        });
      }.bind(this))
      .catch(function (error) {
        console.error(error);
      }.bind(this));
  }

  checkForUpdates() {
    let self = this;
    (this.state.savedLocations || []).map(function (location) {
    axios({
        method: 'get',
        url: `/weatherApp?location=${location.name}`,
        headers: {'Authorization': `Bearer ${auth.getToken()}`},
      })
        .then(function (response) {
          if (location.location_id === response.data.id && location.unix_timestamp !== response.data.dt) {
            axios({
              method: 'put',
              url: '/weatherApp/updatelocation',
              headers: {'Authorization': `Bearer ${auth.getToken()}`},
              data: {
                weather_desc: response.data.weather[0].description,
                temp: response.data.main.temp,
                temp_max: response.data.main.temp_max,
                temp_min: response.data.main.temp_min,
                wind: response.data.wind.speed,
                humidity: response.data.main.humidity,
                clouds: response.data.clouds.all,
                pressure: response.data.main.pressure,
                unix_timestamp: response.data.dt,
                icon: response.data.weather[0].icon,
                location_id: response.data.id
              }
            })
              .then(function (response) {
                console.log("test data updated at the backend", response);
                self.getLocations();
              })
              .catch(function (error) {
                console.error("error in updating locations",error);
              });
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    });
  }

  handleUpdateInput(event) {
    this.setState({
      searchQuery: event.target.value
    });
  }

  handleSearch() {
    axios({
      method: 'get',
      url: `/weatherApp?location=${this.state.searchQuery}`,
      headers: {'Authorization': `Bearer ${auth.getToken()}`},
    })
      .then(function (response) {
        this.setState({
          searchResult: processSearchResponse([response.data]),
          searchQuery: ""
        });
      }.bind(this))
      .catch(function (error) {
        // handle different error cases
        console.error(error);
      }.bind(this));
  }

  render() {
    console.log("%c Home Component -> Render ", "background: black; color: pink", this.state);
    return (
      <div className="container">
        <div>
          <TextField
            hintText="City Name"
            value={this.state.searchQuery}
            onChange={this.handleUpdateInput}
          />
          <FlatButton
            label="Search"
            primary={true}
            onTouchTap={this.handleSearch}
          />
        </div>
        <div className="inlineflexcontainer">
          {this.state.searchResult !== null ? this.renderLocations(this.state.searchResult, "Save") : ""}
          {this.state.savedLocations !== null ? this.renderLocations(this.state.savedLocations, "Delete") : ""}
        </div>
        <FlatButton
          label="Update locations"
          primary={true}
          onTouchTap={this.checkForUpdates}
        />
      </div>
    );
  }
}


export default Home;

import React, {Component} from "react";
import {
  TextField,
  FlatButton,
  Card,
  CardActions,
  CardHeader,
  CardTitle,
  CardText,
  Snackbar,
  IconButton,
  RaisedButton
} from "material-ui";
import axios from "axios";
import auth from "../auth";
import _ from "lodash";
import moment from "moment";
import Update from "material-ui/svg-icons/action/update";

/*
converts the response from api to a format that is consistent with how data is saved in the db
 */
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
      snackbar: false,
      snackbarMsg: "",
      searchQuery: ""
    };
    this.getLocations();
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSaveLocation = this.handleSaveLocation.bind(this);
    this.checkForUpdates = this.checkForUpdates.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    console.log("%c Home Component -> Init ", "background: red; color: white");
  }

  /*
   sets the state for closing the alert message(snackbar)
   */
  handleRequestClose() {
    this.setState({
      snackbar: false
    });
  }

  /*
  post request to the back end to save the location requested by the user
  and sets the state accordingly
   */
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

  /*
   delete request to the back end to delete the location requested by the user
   and sets the state accordingly
   */
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
          snackbar: true,
          snackbarMsg: `${response.data.name} deleted successfully`
        });
        this.getLocations();
      }.bind(this))
      .catch(function (error) {
        console.error(error);
        this.setState({
          snackbar: true,
          snackbarMsg: `Oops, delete unsuccessful. Please try again`
        });
      }.bind(this));
  }

  /*
  clears the result of a search
   */
  handleClearSearch() {
    this.setState({
      searchResult: null
    });
  }

  /*
  method to render the locations
   */
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
            subtitle={`${location.temp}°С  Min: ${location.temp_min}°С Max: ${location.temp_max}°С`}/>
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
              labelStyle={{color: "#7E57C2"}}
              onTouchTap={type === "Save" ? () => self.handleSaveLocation() : () => self.handleDeleteLocation(location.location_id)}
            />
            {
              type === "Save" ? <FlatButton
                label="Clear"
                primary={true}
                labelStyle={{color: "#7E57C2"}}
                onTouchTap={self.handleClearSearch}
              /> : ""
            }
          </CardActions>
        </Card>
      </div>;
    });
  }

  /*
  gets all the saved locations for the current user from the database
  called in the constructor of the component
   */
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

  /*
  loops through all the saved locations for a user and then makes an api call to get the current weather forecast for each locaiton
  checks in the api response if the time stamp is same as the timestamp in the db
  if it is not then makes a put request to the backend to update the location in the database
   */
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
                console.log("data updated at the backend", response);
                self.setState({
                  snackbar: true,
                  snackbarMsg: "Your Saved locations have been updated successfully"
                });
                self.getLocations();
              })
              .catch(function (error) {
                console.error("error in updating locations", error);
              });
          } else {
            self.setState({
              snackbar: true,
              snackbarMsg: "Data for all locations is upto date"
            });
          }
        })
    });
  }

  /*
  sets the state accordingly when onChange is triggered on search field
   */
  handleUpdateInput(event) {
    this.setState({
      searchQuery: event.target.value
    });
  }

  /*
  checks the current search query matches any of the saved locaitons
   */
  validateSearch() {
    return this.state.savedLocations.some(function (location) {
      return location.name.toUpperCase() === this.state.searchQuery.toUpperCase();
    }.bind(this));
  }

  /*
  if all the validations are in place, makes an api call to get the data for the location that user is searching for
   */
  handleSearch() {
    if (!this.validateSearch()) {
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
          if (error.response.data.message === "City not Found") {
            this.setState({
              snackbar: true,
              snackbarMsg: error.response.data.message,
              searchQuery: ""
            });
          } else {
            this.setState({
              snackbar: true,
              snackbarMsg: "Oops, Something went wrong with the server. Please try again",
              searchQuery: ""
            });
          }
        }.bind(this));
    } else {
      this.setState({
        snackbar: true,
        snackbarMsg: "You are already tracking this location"
      });
    }
  }

  render() {
    console.log("%c Home Component -> Render ", "background: black; color: pink", this.state);
    return (
      <div className="container">
        <div>
          <TextField
            floatingLabelText="City Name"
            value={this.state.searchQuery}
            onChange={this.handleUpdateInput}
            floatingLabelStyle={{color: "#7E57C2"}}
            floatingLabelFocusStyle={{color: "#7E57C2"}}
          />
          <RaisedButton
            className="searchButton"
            label="Search"
            backgroundColor="#7E57C2"
            labelColor="#FFFFFF"
            onTouchTap={this.handleSearch}
          />
          <IconButton
            tooltip="Update locations"
            onTouchTap={this.checkForUpdates}
          >
            <Update/>
          </IconButton>
        </div>
        <div className="inlineflexcontainer">
          {this.state.searchResult !== null ? this.renderLocations(this.state.searchResult, "Save") : ""}
          {this.state.savedLocations !== null ? this.renderLocations(this.state.savedLocations, "Delete") : ""}
        </div>
        <Snackbar
          className="center"
          open={this.state.snackbar}
          message={this.state.snackbarMsg}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}


export default Home;

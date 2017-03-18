import React, {Component} from "react";
import {TextField, FlatButton, Card, CardActions, CardHeader, CardTitle, CardText} from "material-ui";
import axios from "axios";
import auth from "../auth";

const styles = {
  root: {
    position: 'relative',
  },
  test: {
    textTransform: 'capitalize'
  }
};


class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: false,
      searchResult: null,
      savedLocations: null
    };
    this.getLocations();
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSaveLocation = this.handleSaveLocation.bind(this);
    console.log("%c Home Component -> Init ", "background: red; color: white");
  }


  setLocation(data) {
    this.setState({savedLocations: data});
  }

  handleSaveLocation() {
    let self  = this;
    axios({
      method: 'post',
      url: '/weatherApp',
      headers: {'Authorization': `Bearer ${auth.getToken()}`},
      data: {
        name: this.state.searchResult.name,
        country: this.state.searchResult.sys.country,
        weather_desc: this.state.searchResult.weather[0].description,
        icon: this.state.searchResult.weather[0].icon,
        temp: this.state.searchResult.main.temp,
        temp_max: this.state.searchResult.main.temp_max,
        temp_min: this.state.searchResult.main.temp_min,
        wind: this.state.searchResult.wind.speed,
        humidity: this.state.searchResult.main.humidity,
        clouds: this.state.searchResult.clouds.all,
        pressure: this.state.searchResult.main.pressure,
        location_id: this.state.searchResult.id,
        unix_timestamp: this.state.searchResult.dt
      }
    })
      .then(function (response) {
        console.log("weather locations", response);
        self.getLocations();
        self.setState({
          searchResult: null
        })
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  handleDeleteLocation(locationId) {
    axios({
      method: 'delete',
      url: '/weatherApp/deletelocation',
      headers: {'Authorization': `Bearer ${auth.getToken()}`},
      data : {
        location_id : locationId
      }
    })
      .then(function (response) {
        console.log("deleted location", response);
      })
      .catch(function (error) {
        console.error(error);
      });
    this.getLocations();
  }

  renderSavedLocations() {
    let self = this;
    return this.state.savedLocations.map(function (location) {
      return <div style={{width: "20%"}}>
        <Card style={styles.root}>
          <CardHeader
            style={styles.root}
            title={location.name}
            subtitle={location.country}
            avatar={`http://openweathermap.org/img/w/${location.icon}.png`}
          />
          <CardTitle
            titleStyle={styles.test}
            title={location.description}
            subtitle={`${location.temp}°С`}/>
          <CardText>
            <div>
              <div>Wind: {`${location.wind}m/s`}</div>location_id
              <div>Humidity: {`${location.humidity}%`}</div>
              <div>Clouds: {`${location.clouds}%`}</div>
              <div>Pressure: {`${location.pressure}hpa`}</div>
            </div>
          </CardText>
          <CardActions>
            <FlatButton
              label="Delete"
              primary={true}
              onTouchTap={() => self.handleDeleteLocation(location.location_id)}
            />
          </CardActions>
        </Card>
      </div>;
    });
  }

  renderSearchResults() {
    return <div style={{width: "30%"}}>
      <Card style={styles.root}>
        <CardHeader
          style={styles.root}
          title={this.state.searchResult.name}
          subtitle={this.state.searchResult.sys.country}
          avatar={`http://openweathermap.org/img/w/${this.state.searchResult.weather[0].icon}.png`}
        />
        <CardTitle
          titleStyle={styles.test}
          title={this.state.searchResult.weather[0].description}
          subtitle={`${this.state.searchResult.main.temp}°С`}/>
        <CardText>
          <div>
            Wind: {`${this.state.searchResult.wind.speed}m/s`}<br />
            <div>Humidity: {`${this.state.searchResult.main.humidity}%`}</div>
            <div>Clouds: {`${this.state.searchResult.clouds.all}%`}</div>
            <div>Pressure: {`${this.state.searchResult.main.pressure}hpa`}</div>
          </div>
        </CardText>
        <CardActions>
          <FlatButton
            label="Save"
            primary={true}
            onTouchTap={this.handleSaveLocation}
          />
        </CardActions>
      </Card>
    </div>;
  }
  getLocations() {
    let self = this;
    axios({
      method: 'get',
      url: '/weatherApp/getlocations',
      headers: {'Authorization': `Bearer ${auth.getToken()}`},
    })
      .then(function (response) {
        self.setLocation(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  handleUpdateInput(event) {
    this.setState({
      searchQuery: event.target.value
    });
  }

  setSearchResult(data){
    this.setState({
      searchResult: data
    })
  }

  handleSearch() {
    axios({
      method: 'get',
      url: `/weatherApp?location=${this.state.searchQuery}`,
      headers: {'Authorization': `Bearer ${auth.getToken()}`},
    })
      .then(function (response) {
        this.setSearchResult(response.data);
      }.bind(this))
      .catch(function (error) {
        // handle different error cases
        console.error(error);
      }.bind(this));
  }

  render() {
    console.log("%c Home Component -> Render ", "background: black; color: pink", this.state);
    return (
      <div className="columnflexcontainer">
        <div>
          <TextField
            hintText="City Name"
            onChange={this.handleUpdateInput}
          />
          <FlatButton
            label="Search"
            primary={true}
            onTouchTap={this.handleSearch}
          />
        </div>
        {this.state.searchResult !== null ? this.renderSearchResults() : ""}
        {this.state.savedLocations !== null ? this.renderSavedLocations() : ""}
      </div>
    );
  }
}

Home.defaultProps = {};
Home.propTypes = {};
export default Home;

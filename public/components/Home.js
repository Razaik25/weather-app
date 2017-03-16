import React, {Component} from "react";
import {TextField, FlatButton, Card, CardActions, CardHeader, CardTitle, CardText} from "material-ui";
import axios from "axios";
import auth from "../auth";

const styles = {
  root: {
    position: 'relative',
    width: '350px',
    color: 'red'
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
      searchResult: null
    };
    this.getLocations();
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.renderSearchResults = this.renderSearchResults.bind(this);
    this.handleSaveLocation = this.handleSaveLocation.bind(this);
    console.log("%c Home Component -> Init ", "background: red; color: white");
  }

  handleSaveLocation() {
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
        pressure: this.state.searchResult.main.pressure
      }
    })
      .then(function (response) {
        console.log("weather locations", response);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  renderSearchResults() {
    return <Card style={styles.root}>
      <CardHeader
        title={this.state.searchResult.name}
        subtitle={this.state.searchResult.sys.country}
        avatar={`http://openweathermap.org/img/w/${this.state.searchResult.weather[0].icon}.png`}
      />
      <CardTitle
        titleStyle={styles.test}
        title={this.state.searchResult.weather[0].description}
        subtitle={`${this.state.searchResult.main.temp}°С`}/>
      <CardText>
        Wind: {`${this.state.searchResult.wind.speed}m/s`}
        Humidity: {`${this.state.searchResult.main.humidity}%`}
        Clouds: {`${this.state.searchResult.clouds.all}%`}
        Pressure: {`${this.state.searchResult.main.pressure}hpa`}
      </CardText>
      <CardActions>
        <FlatButton
          label="Save"
          primary={true}
          onTouchTap={this.handleSaveLocation}
        />
      </CardActions>
    </Card>;
  }

  getLocations() {
    axios({
      method: 'get',
      url: '/weatherApp/getlocations',
      headers: {'Authorization': `Bearer ${auth.getToken()}`},
    })
      .then(function (response) {
        console.log("weather locations", response);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  componentDidMount() {
    // axios({
    //   method: 'get',
    //   url: '/weatherApp/getlocations',
    //   headers: {'Authorization': `Bearer ${auth.getToken()}`},
    // })
    //   .then(function (response) {
    //     console.log("weather locations", response);
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });
  }

  handleUpdateInput(event) {
    this.setState({
      searchQuery: event.target.value
    });
  }


  handleSearch() {
    let self = this;
    axios({
      method: 'get',
      url: `/weatherApp?location=${this.state.searchQuery}`,
      headers: {'Authorization': `Bearer ${auth.getToken()}`},
    })
      .then(function (response) {
        self.setState({
          searchResult: response.data
        })
      })
      .catch(function (error) {
        // handle different error cases
        console.error(error);
        self.setState({
          error: true
        })
      });
  }

  render() {
    console.log("%c Home Component -> Render ", "background: black; color: pink", this.state);
    return (
      <div >
        Home
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
      </div>
    );
  }
}


export default Home;

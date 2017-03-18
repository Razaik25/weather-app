import React, {Component} from "react";

class LocationList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: "LocationList"
    };
    console.log("%c LocationList Component -> Init ", "background: red; color: white");
  }

  render() {
    console.log("%c LocationList Component -> Render ", "background: black; color: pink");
    return (
      <div className={styles.container}>
        This is {this.state.name} Component
      </div>
    );
  }
}
LocationList.defaultProps = {};
LocationList.propTypes = {};
export default LocationList;

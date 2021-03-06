import React, {Component} from "react";
import auth from "../auth";


class Logout extends Component {
  constructor(props, context) {
    super(props, context);
    console.log("%c Logout Component -> Init ", "background: red; color: white");
  }

  componentDidMount() {
    auth.logout()
  }

  render() {
    console.log("%c Logout Component -> Render ", "background: black; color: pink");
    return (
      <div className="center intro">
        <p>GoodBye, Have a great Day.</p>
      </div>
    );
  }
}
Logout.defaultProps = {};
Logout.propTypes = {};
export default Logout;
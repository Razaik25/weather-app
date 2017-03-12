import React, {Component} from "react";

class Home extends Component {
  constructor(props, context) {
    super(props, context);
    console.log("%c Home Component -> Init ", "background: red; color: white");
  }

  componentDidMount() {
    auth.logout()
  }

  render() {
    console.log("%c Home Component -> Render ", "background: black; color: pink");
    return (
      <div >
        Home
      </div>
    );
  }
}

export default Home;

import React, {Component} from "react";
import {FlatButton, TextField} from "material-ui";
import auth from "../auth";


class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    console.log("%c Login Component -> Init ", "background: red; color: white");
  }


  handleSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.getValue();
    const pass = this.refs.pass.getValue();
    auth.login(email, pass, (loggedIn) => {
      if (!loggedIn)
        return this.setState({error: true});

      const {location} = this.props;

      if (location.state && location.state.nextPathname) {
        this.context.router.replace(location.state.nextPathname);
      } else {
        this.context.router.replace('/home');
      }
    })
  }

  render() {
    // have to add validations here
    console.log("%c Login Component -> Render ", "background: black; color: pink");
    return (
      <div >
          <TextField
            ref = "email"
            errorText={null}
            hintText="Email"
            />
          <TextField
            ref = "pass"
            errorText={null}
            type = "password"
            hintText="Password"
          />
          <FlatButton onClick ={this.handleSubmit} >Sign In</FlatButton>
      </div>
    );
  }
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Login;
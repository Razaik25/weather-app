import React, {Component} from "react";
import axios from "axios";
import {FlatButton, TextField} from "material-ui";


class SignUp extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleSubmit = this.handleSubmit.bind(this);
    console.log("%c SignUp Component -> Init ", "background: red; color: white");
  }


  handleSubmit() {
    const email = this.refs.email.getValue();
    const pass = this.refs.pass.getValue();
    const username = this.refs.username.getValue();
    axios.post('/users/signup', {email: email, password: pass, username: username})
      .then((res) => {
        console.log('user is created', res);
      })
      .catch((err) => {
        console.log('error in creating a user', err);
      });

    const {location} = this.props;

    if (location.state && location.state.nextPathname) {
      this.context.router.replace(location.state.nextPathname);
    } else {
      this.context.router.replace('/');
    }

  }

  render() {
    console.log("%c SignUp Component -> Render ", "background: black; color: pink");
    return (
      <div >
        <TextField
          ref = "username"
          errorText={null}
          hintText="username"
        />
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

SignUp.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default SignUp;
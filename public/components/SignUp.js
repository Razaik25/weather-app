import React, {Component} from "react";
import axios from "axios";
import {RaisedButton, TextField} from "material-ui";
import _ from "lodash";

class SignUp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      userNameError: "",
      emailError: "",
      passwordError: "",
      isDirty: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validateName = this.validateName.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    console.log("%c SignUp Component -> Init ", "background: red; color: white");
  }

  validateEmail(event) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(event.target.value)) {
      this.setState({
        emailError: "",
        isDirty: false
      });
    } else {
      this.setState({
        emailError: "Not a valid email",
        isDirty: true
      });
    }
  }

  validateName(event) {
    if (_.isEmpty(event.target.value)) {
      this.setState({
        userNameError: "This field cannot be blank",
        isDirty: true
      });
    } else {
      this.setState({
        userNameError: "",
        isDirty: false
      });
    }
  }

  validatePassword(event) {
    if (_.isEmpty(event.target.value)) {
      this.setState({
        passwordError: "This field cannot be blank",
        isDirty: true
      });
    } else {
      this.setState({
        passwordError: "",
        isDirty: false
      });
    }
  }

  handleSubmit() {
    const email = this.refs.email.getValue();
    const pass = this.refs.pass.getValue();
    const username = this.refs.username.getValue();
    axios.post('/users/signup', {email: email, password: pass, username: username})
      .then((res) => {
        console.info('sign up successfull', res);
      })
      .catch((err) => {
        console.info('error in signing up', err);
      });

    const {location} = this.props;

    if (location.state && location.state.nextPathname) {
      this.context.router.replace(location.state.nextPathname);
    } else {
      this.context.router.replace('/');
    }

  }

  render() {
    console.log("%c SignUp Component -> Render ", "background: black; color: pink", this.state);
    return (
      <div className="fullWidth adjustHeight columnflexcontainer ">
        <div className="cardStyles">
          <div className="inlineflexcontainer fullWidth addPadding">
            <div className="textFieldStyles">
              <TextField
                fullWidth={true}
                floatingLabelText="Username"
                ref="username"
                onChange={this.validateName}
                errorText={this.state.userNameError}
              />
            </div>
            <div className="textFieldStyles">
              <TextField
                fullWidth={true}
                floatingLabelText="Email"
                ref="email"
                onChange={this.validateEmail}
                errorText={this.state.emailError}
              />
            </div>
            <div className="textFieldStyles">
              <TextField
                fullWidth={true}
                floatingLabelText="Password"
                ref="pass"
                type="password"
                onChange={this.validatePassword}
                errorText={this.state.passwordError}
              />
            </div>
            <div className="flexEnd textFieldStyles">
              <RaisedButton
                label="Sign Up"
                primary={true}
                disabled={this.state.isDirty}
                onTouchTap={this.handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignUp.contextTypes = {
  router: React.PropTypes.object.isRequired
};
SignUp.defaultProps = {};
SignUp.propTypes = {};
export default SignUp;
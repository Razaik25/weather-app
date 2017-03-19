import React, {Component} from "react";
import axios from "axios";
import {RaisedButton, TextField, Snackbar} from "material-ui";
import _ from "lodash";

class SignUp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      snackbar: false,
      snackbarMsg: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validateName = this.validateName.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validateData = this.validateData.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    console.log("%c SignUp Component -> Init ", "background: red; color: white");
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
  validates if the value is a valid email and sets the state accordingly
   */
  validateEmail(event) {
    var reg = /^[a-z0-9][_,;:~!*$()=a-z'0-9-\.\+]*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;
    if (reg.test(event.target.value)) {
      this.setState({
        emailError: "",
      });
    } else {
      this.setState({
        emailError: "Not a valid email",
      });
    }
  }

  /*
   validates if the username is blank and sets the state accordingly
   */
  validateName(event) {
    if (_.isEmpty(event.target.value)) {
      this.setState({
        userNameError: "User Name cannot be blank",
      });
    } else {
      this.setState({
        userNameError: "",
      });
    }
  }

  /*
   validates if the password is blank and sets the state accordingly
   */
  validatePassword(event) {
    if (_.isEmpty(event.target.value)) {
      this.setState({
        passwordError:"Password cannot be blank",
      });
    } else {
      this.setState({
        passwordError: "",
      });
    }
  }

  /*
  checks if the email, password, usernames values are empty or not
  This function is in place as the validation for sign up fields is triggered by onChange event listener.
  However, when sign up form is rendered for the first time all the fields are all blank and if the user clicks on the signup button this will not
  trigger onChange event listener and the request will go the backend with empty fields
  To prevent this behaviour this method is called in handleSubmit method before the request goes through to the backend
   */
  validateData() {
    if(_.isEmpty(this.refs.email.getValue()) || _.isEmpty(this.refs.pass.getValue()) || _.isEmpty(this.refs.username.getValue())) {
      return true;
    }
  }

  /*
  if all the validation tests pass, post request goes to the backend to create the user in the db
   */
  handleSubmit() {
    const email = this.refs.email.getValue();
    const pass = this.refs.pass.getValue();
    const username = this.refs.username.getValue();
    if(!this.validateData()) {
      axios.post('/users/signup', {email: email, password: pass, username: username})
        .then((res) => {
          console.info('sign up successfull', res);
          const {location} = this.props;

          if (location.state && location.state.nextPathname) {
            this.context.router.replace(location.state.nextPathname);
          } else {
            this.context.router.replace('/home');
          }
        })
        .catch((err) => {
          console.info('error in signing up', err.response);
          this.setState({
            snackbarMsg: err.response.data.data,
            snackbar: true
          })
        });
    } else {
      this.setState({
        snackbarMsg: "Please fill all the fields",
        snackbar: true
      })
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
                floatingLabelStyle={{color: "#7E57C2"}}
                floatingLabelFocusStyle={{color: "#7E57C2"}}
                errorText={this.state.userNameError}
              />
            </div>
            <div className="textFieldStyles">
              <TextField
                fullWidth={true}
                floatingLabelText="Email"
                floatingLabelStyle={{color: "#7E57C2"}}
                floatingLabelFocusStyle={{color: "#7E57C2"}}
                ref="email"
                onChange={this.validateEmail}
                errorText={this.state.emailError}
              />
            </div>
            <div className="textFieldStyles">
              <TextField
                fullWidth={true}
                floatingLabelText="Password"
                floatingLabelStyle={{color: "#7E57C2"}}
                floatingLabelFocusStyle={{color: "#7E57C2"}}
                ref="pass"
                type="password"
                onChange={this.validatePassword}
                errorText={this.state.passwordError}
              />
            </div>
            <div className="flexEnd textFieldStyles">
              <RaisedButton
                label="Sign Up"
                type="submit"
                backgroundColor="#7E57C2"
                labelColor="#FFFFFF"
                onTouchTap={this.handleSubmit}
                disabled={ !_.isEmpty(this.state.userNameError) || !_.isEmpty(this.state.emailError) || !_.isEmpty(this.state.passwordError)}
              />
            </div>
            <Snackbar
              className="center"
              open={this.state.snackbar}
              message={this.state.snackbarMsg}
              autoHideDuration={3000}
              onRequestClose={this.handleRequestClose}
            />
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
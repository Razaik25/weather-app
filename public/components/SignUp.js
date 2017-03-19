import React, {Component} from "react";
import axios from "axios";
import {RaisedButton, TextField, Snackbar} from "material-ui";
import _ from "lodash";

function isDisabled(str) {
  if(str) {
    return true;
  }
  return false;
}
class SignUp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      userNameError: null,
      emailError: null,
      passwordError: null,
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


  handleRequestClose() {
    this.setState({
      snackbar: false
    });
  }

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

  validateData() {
    if(_.isEmpty(this.refs.email.getValue()) || _.isEmpty(this.refs.pass.getValue()) || _.isEmpty(this.refs.username.getValue())) {
      return true;
    }
  }

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
    console.log("%c SignUp Component -> Render ", "background: black; color: pink");
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
                labelColor="white"
                onTouchTap={this.handleSubmit}
                disabled={isDisabled(this.state.userNameError) || isDisabled(this.state.emailError) || isDisabled(this.state.passwordError)}
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
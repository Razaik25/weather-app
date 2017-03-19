import React, {Component} from "react";
import {RaisedButton, TextField, Snackbar} from "material-ui";
import auth from "../auth";
import _ from "lodash";

function isDisabled(str) {
  if(str) {
    return true;
  }
  return false;
}

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: false,
      snackbar: false,
      snackbarMsg: "",
      emailError: null,
      passwordError: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    console.log("%c Login Component -> Init ", "background: red; color: white");
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

  validatePassword(event) {
    if (_.isEmpty(event.target.value)) {
      this.setState({
        passwordError: "This field cannot be blank",
      });
    } else {
      this.setState({
        passwordError: "",
      });
    }
  }


  handleSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.getValue();
    const pass = this.refs.pass.getValue();
      auth.login(email, pass, (loggedIn) => {
        if (!loggedIn)
          return this.setState({
            error: true,
            snackbar: true,
            snackbarMsg: "Email/Password do not match"
          });

        const {location} = this.props;

        if (location.state && location.state.nextPathname) {
          this.context.router.replace(location.state.nextPathname);
        } else {
          this.context.router.replace('/home');
        }
      })
    }

  render() {
    console.log("%c Login Component -> Render ", "background: black; color: pink", this.state);
    return (
      <div className="fullWidth adjustHeight columnflexcontainer ">
        <div className="cardStyles">
          <div className="inlineflexcontainer fullWidth addPadding">
            <div className="textFieldStyles">
              <TextField
                floatingLabelText="Email"
                ref="email"
                errorText={this.state.emailError}
                onChange={this.validateEmail}
                fullWidth={true}
              />
            </div>
            <div className="textFieldStyles">
              <TextField
                floatingLabelText="Password"
                ref="pass"
                errorText={this.state.passwordError}
                onChange={this.validatePassword}
                fullWidth={true}
                type="password"
              />
            </div>
            <div className="flexEnd  textFieldStyles">
              <RaisedButton
                label="Sign In"
                primary={true}
                disabled={ isDisabled(this.state.emailError) || isDisabled(this.state.passwordError)}
                onTouchTap={this.handleSubmit}
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

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
};
Login.defaultProps = {};
Login.propTypes = {};
export default Login;
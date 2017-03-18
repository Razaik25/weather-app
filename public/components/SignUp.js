import React, {Component} from "react";
import axios from "axios";
import {RaisedButton, TextField} from "material-ui";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class SignUp extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.linkState = this.linkState.bind(this);
    this.checkEmail = this.checkEmail.bind(this);

    console.log("%c SignUp Component -> Init ", "background: red; color: white");
  }

  linkState(str) {
    console.log("linkState", str);
  }

  checkEmail() {
    console.log("inside check email")
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
    // add validation for same user name and email
    console.log("%c SignUp Component -> Render ", "background: black; color: pink");
    return (
      <div className="fullwidth backgroundimage fullheight columnflexcontainer ">
      <div className="Wrap">
      <div className="cardstyles" >
            <div className="inlineflexcontainer fullwidth AdjustPad" onSubmit={this.submit}>
              <div  className="padd ">
                <TextField
                  style={{background: "transparent"}}
                  hintText="Username"
                  ref="username"
                  fullWidth={true}
                  required={true}
                  onInput={ this.linkState('name') }
                />
              </div>
              <div className="padd ">
              <TextField
                style={{background: "transparent"}}
                hintText="Email"
                ref="email"
                type="email"
                required={true}
                fullWidth={true}
                onInput={ this.linkState('email') }
                onChange={ this.checkEmail }
              />
               </div>
              <div className="padd">
              <TextField
                style={{background: "transparent"}}
                hintText="Password"
                ref="pass"
                type="password"
                fullWidth={true}
                required={true}
                onInput={ this.linkState('password') }
              />
               </div>
              <div className="flexend padd">
              <RaisedButton onClick={this.handleSubmit}>Sign In</RaisedButton>
               </div>
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
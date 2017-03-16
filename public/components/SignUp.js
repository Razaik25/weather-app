import React, {Component} from "react";
import axios from "axios";
import {FlatButton, TextField} from "material-ui";
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
      <div >
        <Card>
          <CardText>
            <form action="javascript:" onSubmit={this.submit}>
              {/*<div className={{error:1, showing:error}}>{ error || null }</div>*/}
              <div style={{transition: 'all 500ms ease', overflow: 'hidden'}}>
                <TextField
                  hintText="Username"
                  ref="username"
                  pattern="^[a-z0-9_.-]+$"
                  required={true}
                  onInput={ this.linkState('name') }
                />
              </div>

              <TextField
                hintText="Email"
                ref="email"
                type="email"
                required={true}
                onInput={ this.linkState('email') }
                onChange={ this.checkEmail }
              />
              <TextField
                hintText="Password"
                ref="pass"
                type="password"
                required={true}
                onInput={ this.linkState('password') }
              />
              <FlatButton onClick={this.handleSubmit}>Sign In</FlatButton>
            </form>
          </CardText>
        </Card>

      </div>
    );
  }
}

SignUp.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default SignUp;
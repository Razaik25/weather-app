import React, {Component} from "react";
import {RaisedButton, TextField} from "material-ui";
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
      <div className="fullwidth backgroundimage fullheight columnflexcontainer ">
        <div className="Wrap">
          <div className="cardstyles">
            <div action="javascript:" className="inlineflexcontainer fullwidth AdjustPad" onSubmit={this.submit}>
              <div className="padd ">
                <TextField
                  ref="email"
                  errorText={null}
                  fullWidth={true}
                  hintText="Email"
                />
              </div>
              <div className="padd ">
                <TextField
                  ref="pass"
                  errorText={null}
                  fullWidth={true}
                  type="password"
                  hintText="Password"
                />
              </div>
              <div className="flexend  padd">
                <RaisedButton onClick={this.handleSubmit}>Sign In</RaisedButton>
              </div>
            </div>
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
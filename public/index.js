import React, {Component} from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import {Router, Route, Link, browserHistory} from 'react-router';
import {AppBar} from "material-ui";
import auth from "./auth";
import Login from "./components/Login";
import Home from "./components/Home";
import Logout from "./components/Logout";
import SignUp from "./components/SignUp";

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  }
}

injectTapEventPlugin();

export default class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loggedIn: auth.loggedIn(),
    };
    this.updateAuth = this.updateAuth.bind(this);
    console.log("%c App Component -> Init ", "background: red; color: white");
  }

  updateAuth(loggedIn) {
    this.setState({
      loggedIn: loggedIn
    })
  }

  componentWillMount() {
    auth.onChange = this.updateAuth;
    auth.login()
  }

  render() {
    console.log("%c App Component -> Render ", "background: black; color: pink");
    return (
      <MuiThemeProvider>
        <div>
          Welcome to Weather Bug
          <ul>
            <li>
              {this.state.loggedIn ? (
                <Link to="/logout">Log out</Link>
              ) : (
                <Link to="/login">Log in</Link>
              )}
            </li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
          {this.props.children || <p>You are {!this.state.loggedIn && 'not'} logged in.</p>}
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Login}/>
      <Route path="signup" component={SignUp}/>
      <Route path="logout" component={Logout}/>
      <Route path="home" component={Home} onEnter={requireAuth}/>
    </Route>
  </Router>
), document.getElementById('root'));


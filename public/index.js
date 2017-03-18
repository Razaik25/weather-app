import React, {Component} from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import {Router, Route, Link, browserHistory, IndexRoute} from 'react-router';
import {AppBar, FlatButton} from "material-ui";
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
    });
  }

  componentWillMount() {
    auth.onChange = this.updateAuth;
    auth.login();
  }


  render() {
    console.log("%c App Component -> Render ", "background: black; color: pink", this.state);
    // <div >
    //   <h2>Welcome to Weather Bug</h2>
    //   <ul>
    //     <li>
    //       {this.state.loggedIn ? ( <Link to="/logout">Log out</Link> )
    //         : ( <Link to="/login">Log In</Link> )}
    //     </li>
    //     <li><Link to="/signup">Sign Up</Link></li>
    //   </ul>
    //   {this.props.children || <p>You are {!this.state.loggedIn && 'not'} logged in.</p>}
    // </div>
    return (
      <MuiThemeProvider>
        <div>
          {this.state.loggedIn ?
            <div>
              <AppBar
                style={{backgroundColor: "#7E57C2"}}
                title="Weather Bug"
                showMenuIconButton={false}
                iconElementRight={<FlatButton><Link to="/logout">Logout</Link></FlatButton>}
              />
              {this.props.children || <p>You are {!this.state.loggedIn && 'not'} logged in.</p>}
            </div> :
            <div >
              <AppBar
                style={{backgroundColor: "#7E57C2"}}
                title="Weather Bug"
                showMenuIconButton={false}
                iconElementRight={
                  <div className="appBarLinks">
                    <FlatButton><Link to="/login">Login</Link></FlatButton>
                    <FlatButton><Link to="/signup">Sign Up</Link></FlatButton>
                  </div>
                }
              />
              <div className="intro">
                Welcome to Weather Bug
                <p>Sign up for a free account to track your saved locations real-time</p>
              </div>
              {this.props.children}
            </div>
          }
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


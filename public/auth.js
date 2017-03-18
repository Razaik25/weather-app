import axios from "axios";
/*
Referenced form react-router docs
 */
module.exports = {
  login(email, pass, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return
    }
    loginRequest(email, pass, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token;
        if (cb) cb(true);
        this.onChange(true)
      } else {
        console.log("hfks",res);
        if (cb) cb(false);
        this.onChange(false)
      }
    })

  },

  getToken() {
    return localStorage.token
  },

  logout(cb) {
    delete localStorage.token;
    if (cb) cb();
    this.onChange(false)
  },

  loggedIn() {
    return !!localStorage.token
  },

  onChange() {}
};



function loginRequest(email, pass, cb) {
  axios.post('users/login', {email: email, password: pass})
    .then((res) => {
      cb({
        authenticated: true,
        token: res.data.token
      })
    })
    .catch((err) => {
      cb({
        status:500,
        data: err.response
      })
    })
}
# weather-app

Lets users signup and save locations for which they want to track the weather.
Users can update the locations and track the locations in real time

### Deployed link
https://blooming-tor-12711.herokuapp.com/

### Third Party APIs

```
https://openweathermap.org/api
It provides data for more than 200,000 cities all over the world for free. 
- Can make up to 60 calls/per minute
- The data is updated in <2 hours
- Data is available in JSON, XML, HTML
```
### App Dependencies

```
Backend 
- Express 
- express-jwt (authentication)
- jsonwebtoken (authentication)
- Node 
- pg-promise
- body-parser
- bcrypt
- dotenv
- morgan (logger)
- path
- request
FrontEnd 
- react 
- react-dom 
- material-ui
- moment 
- axios 
- react-router
- react-tap-event-plugin
- browerisfy, babelify, minifyify, uglifyify for bundling 
```
 
### Checklist 

```
- Set up a server - Done
- Set up User authentication -Done
- Design schema of the database and queries in postgres -Done
  Models: users, users_locations - Done
- Set up routes - index,users,weather(to create, update, delete locations) -Done
- Integrate views with react and react router - Done
- Set up testing using Mocha
```

### Running locally

```
* git clone git@github.com:Razaik25/weather-app.git
* cd weather-app
* yarn install 
* create .env file with  following variables
                        DB_USER
                        DB_DATABASE
                        DB_PASS
                        SECRET
                        API_KEY
* set up the database using schema  file and start the postgres server and express server
* npm run bundle and then see the application at localhost:3000
```

### Further Developments

```
- Improve the db schema
- Implement Mocha for testing 
- Migrate to webpack2 
```



const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//Connect to Database
mongoose.connect(config.database,{ useNewUrlParser: true });

//On Successfull Connection
mongoose.connection.on("connected", () => {
    console.log("Connected to database "+config.database);
});

//On Error while connecting
mongoose.connection.on("error", (err) => {
    console.log("Database error "+ err);
});

//PORT
const port = process.env.PORT || 3000;
const users = require('./routes/users');
const app = express();

//CORS middlware
app.use(cors());

//SET static folder
app.use(express.static(path.join(__dirname,'public')));

//Body Parser
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//User router
app.use('/users',users);

// Index Page
app.get('/',(req,res) => {
    res.send("Invalid Endpoint");
});

//Start Server
app.listen(port, () => {
    console.log("Server started on port "+port);
});

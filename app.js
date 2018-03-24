// Require core Node.js modules
const path = require('path');

// Require non-core Node.js modules
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Configuration files
const dbConfig = require('./config/database');

const app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: require('./helpers/hbs')
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(dbConfig.mongoURI)
.then(() => {
    console.log('Connected to database...');
})
.catch(error => {
    console.log('Failed to connect to database...');
    throw error;
});

// Body parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express validator setup
const { emailIsAvailable, handleIsAvailable } = require('./helpers/validators');
app.use(expressValidator({
    customValidators: {
        emailIsAvailable: emailIsAvailable,
        handleIsAvailable: handleIsAvailable
    }
}));

// Express session setup
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Connect flash setup
app.use(flash());

// Run configuration files
require('./config/passport')(passport);

// Set global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routing files
const index = require('./routes/index');
const users = require('./routes/users');
const tweets = require('./routes/tweets');

app.use('/', index);
app.use('/users', users);
app.use('/tweets', tweets);

const portNumber = 8080;
app.listen(portNumber, () => {
    console.log(`Server running on port ${portNumber}...`);
});
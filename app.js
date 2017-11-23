var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
const fileUpload = require('express-fileupload');


var creds = [{
	username: 'devansh',
	password: 'kanha0812'
}];

var index = require('./routes/index');
var login = require('./routes/login');
var homeUser = require('./routes/homeUser');
var homeEmp = require('./routes/homeEmp');
var cb = require('./routes/confirmBooking');
var pb = require('./routes/previousBookings');
var settings = require('./routes/settings');
var settingsEmp = require('./routes/settingsEmp');
var signup = require('./routes/signup');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'images')));
app.use(cookieSession({
	name: 'session',
	secret: 'donttellanyone'
}));
app.use(function(req, res, next) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});
app.use(fileUpload());

// Define URL with routes
app.use('/', index);
app.use('/login', login);
app.use('/homeUser', homeUser);
app.use('/homeEmp', homeEmp);
app.use('/confirmBooking', cb);
app.use('/previousBookings', pb);
app.use('/settings', settings);
app.use('/settingsEmp', settingsEmp);
app.use('/signup',signup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
exports.creds = creds;

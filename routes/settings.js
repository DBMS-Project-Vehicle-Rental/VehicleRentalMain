var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var creds = require('../app');

var id;
var d = [];
var ob = new Object();

router.get('/', function(req, res, next) {
	console.log("Entered /settings");

	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'VEHICLE_RENTAL'
	});

	con.connect(function(err) {
		if(err) throw err;
		console.log("Connected to VEHICLE_RENTAL");

		if (req.session.user) {
			id = req.session.id;

			var sql = "SELECT * FROM User WHERE User_ID = '" + id + "';";
			con.query(sql, function(err, result) {
				if(err) throw err;

				console.log(result[0].User_ID);
				ob['uid'] = result[0].User_ID;
				ob['email'] = result[0].Email;
				ob['pno'] = result[0].Phone_No;
				ob['address'] = result[0].Address;
				ob['wallet'] = result[0].Wallet;

				d.push(ob);
				res.render('settings', {title: 'User\'s Settings', uid: id, valid: 3, data: d});
				console.log(ob);
				console.log(d);
			});
		} else if (req.session.emp) {
			id = req.session.id;
			res.render('settings', {title: 'User\'s Settings', uid: id, valid: 3, data: d});
		} else {
			res.redirect('/login');
		}
		//con.close();
	});
});

router.post('/change', function(req, res, next) {
	id = req.session.id;
	res.render('settings', {title: 'User\'s Settings', uid: id, valid: 4, data: d});
});

router.post('/changePass', function(req, res, next) {
	//res.render('settings', {title: 'User\'s Settings', uid: id, valid: 4, data: d});

	var valid;
	id = req.session.id;

	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'VEHICLE_RENTAL'
	});

	con.connect(function(err) {
		if(err) throw err;
		console.log('Connected to VEHICLE_RENTAL');

		if (req.session.user) {
			var sql = "SELECT Password FROM User WHERE User_ID = '" + id + "';";

			con.query(sql, function(err, result) {
				if(err) throw err;

				// ob['uid'] = result[0].User_ID;
				// ob['email'] = result[0].Email;
				// ob['pno'] = result[0].Phone_No;
				// ob['address'] = result[0].Address;
				// ob['wallet'] = result[0].Wallet;

				console.log("Result: " + result);
				if(req.body.oldPass == result[0].Password) {
					if(req.body.oldPass == req.body.newPass) {
						valid = 2;
					} else {
						valid = 0;

						sql = "UPDATE User SET Password = '" + req.body.newPass + "' WHERE User_ID = '" + id + "';";
						con.query(sql, function(err, result) {
							if(err) throw err;
						})
					}
				} else {
					valid = 1;
				}

				//var data = [];
				//data.push(ob);

				console.log("valid : " + valid);

				res.render('settings', {title: 'User\'s Settings', uid: id, valid: valid, data: d});
			});

			// var sql = "SELECT User_ID, Name, Email, Phone_No, Address, Wallet FROM User where User_ID = '" + id + "';";
			//
			// con.query(sql, function(err, result) {
			// 	if(err) throw err;
			// });
			//
		} else {

		}
	});
});
module.exports = router;

var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var id;

router.get('/', function(req, res, next) {
	if(req.session.user || req.session.emp) {
		id = req.session.id;
		res.render('settings', {title: 'User\'s Settings', uid: id, valid: 3});
	} else {
		res.redirect('/login');
	}
});

router.post('/changePass', function(req, res, next) {
	var valid;
	id = req.session.id;

	var con = mysql.createConnection({
		host: 'localhost',
		user: 'devansh',
		password: 'kanha0812',
		database: 'VEHICLE_RENTAL'
	});

	con.connect(function(err) {
		if(err) throw err;
		console.log('Connected to VEHICLE_RENTAL');

		if (req.session.user) {
			var sql = "SELECT Password FROM User WHERE User_ID = '" + id + "';";

			con.query(sql, function(err, result) {
				if(err) throw err;

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
			});

			res.render('settings', {title: 'User\'s Settings', uid: id, valid: valid});
		} else {

		}
	});
});
module.exports = router;

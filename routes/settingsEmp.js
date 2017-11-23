var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var fs = require('fs');

var creds = require('../app');

var id;
var d = [];
var ob = new Object();
var img;

router.get('/', function(req, res, next) {
	console.log("Entered /settingsEmp");

	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'VEHICLE_RENTAL'
	});

	con.connect(function(err) {
		if(err) throw err;
		console.log("Connected to VEHICLE_RENTAL");

		if (req.session.emp) {
			id = req.session.id;

			var sql = "SELECT * FROM Employee WHERE User_ID = '" + id + "';";
			con.query(sql, function(err, result) {
				if(err) throw err;

				console.log(result[0].User_ID);
				ob['uid'] = result[0].User_ID;
				ob['name'] = result[0].Name;
				ob['email'] = result[0].Email;
				ob['pno'] = result[0].Phone_No;
				ob['address'] = result[0].Address;
				d.push(ob);


				var path = './public/images/ProfileEmp/';
				var imgSrc = '/images/ProfileEmp/';

				if (fs.existsSync(path + id.toUpperCase() + '.png')) {
					console.log('png exists');
					img = imgSrc = imgSrc + id.toUpperCase() + '.png';
				} else if (fs.existsSync(path + id.toUpperCase() + '.jpg')) {
					console.log('jpg exists');
					img = imgSrc = imgSrc + id.toUpperCase() + '.jpg';
				} else {
					console.log('png/jpg/jpeg does not exists');
					img = imgSrc = imgSrc + 'default.jpg';
				}

				res.render('settingsEmp', {title: 'Employee Settings', eid: id, valid: 3, data: d,imgSrc: imgSrc});
				console.log(ob);
				console.log(d);
			});
		} else {
			res.redirect('/login');
		}
		//con.close();
	});
});

router.post('/change', function(req, res, next) {
	id = req.session.id;
	res.render('settingsEmp', {title: 'Employee Settings', eid: id, valid: 4, data: d, imgSrc: img});
});

router.post('/changePass', function(req, res, next) {
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

		if (req.session.emp) {
			var sql = "SELECT Password FROM Employee WHERE User_ID = '" + id + "';";

			con.query(sql, function(err, result) {
				if(err) throw err;

				console.log("Result: " + result);
				if(req.body.oldPass == result[0].Password) {
					if(req.body.oldPass == req.body.newPass) {
						valid = 2;
					} else {
						valid = 0;

						sql = "UPDATE Employee SET Password = '" + req.body.newPass + "' WHERE User_ID = '" + id + "';";
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

				res.render('settingsEmp', {title: 'Employee Settings', eid: id, valid: valid, data: d, imgSrc: img});
			});
		} else {
        //User Settings
		}
	});
});
module.exports = router;

var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var creds = require('../app');

var empid;

router.get('/', function(req, res, next) {
	if(req.session.emp) {
		res.render('addVehicles');
	} else {
		res.redirect('/login');
	}
});

router.post('/', function(req, res, next) {
	if(req.session.emp) {
		empid = req.session.id;

		var con = mysql.createConnection({
			host: 'localhost',
			user: creds.creds[0].username,
			password: creds.creds[0].password,
			database: 'VEHICLE_RENTAL'
		});

		con.connect(function(err) {
			if (err) throw err;

			console.log("Connected");

			var sql = "SELECT * FROM VehicleDetails WHERE Plate_No = '" + req.body.plno + "' AND G_ID = (SELECT G_ID FROM Employee WHERE User_ID = '" + empid + "');";
			console.log(sql);
			con.query(sql, function(err, result) {
				if(err) throw err;

				console.log(result);
				console.log(result.length);
				if(result.length == 0) {
					sql = "INSERT INTO Vehicles VALUES ('" + req.body.modname + "', '" + req.body.compname + "', '" + req.body.vtype + "', '" + req.body.type + "', " + req.body.seats + ", 1, " + req.body.cost + ") ON DUPLICATE KEY UPDATE Units = Units + 1;";
					console.log(sql);

					con.query(sql, function(err, result) {
						if(err) throw err;

						sql = "INSERT INTO VehicleDetails VALUES ('" + req.body.plno + "', '" + req.body.modname + "', '" + req.body.color + "', (SELECT G_ID FROM Employee WHERE User_ID = '" + empid + "'), 0);";
						console.log(sql);

						con.query(sql, function(err, result) {
							if(err) throw err;

							console.log("Vehicle added");

							// Show as SUCCESS
							res.redirect('/homeEmp');
						});
					});
				} else {
					console.log("Duplicate");

					// Show as FAILED
				}
			});
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;

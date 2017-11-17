var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var alert = require('alert-node');

var creds = require('../app');

var uid, plno, toDate, fromDate, cost;

// GET login page.
router.get('/', function(req, res, next) {
	uid = req.query.uid;
	plno = req.query.plateNo;
	toDate = req.query.toDate;
	fromDate = req.query.fromDate;
	//var payMet = req.body.pay;

	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'VEHICLE_RENTAL'
	});

	con.connect(function(err) {
		if(err) throw err;
		console.log('Connected to VECHICLE_RENTAL database');
		var toSend;

		var sql = "Select Plate_No,v.Model_Name as Model,Company,Type,V_Type,Seats,Quantity,Color,G_ID, Cost from Vehicles v, VehicleDetails vd where v.Model_Name=vd.Model_Name and Plate_No='"+plno+"';";
		console.log(sql);
		con.query(sql, function(err, result) {
			if(err) throw err;

			var vehicleData = [];
			var elem = new Object();
			elem["plno"] = result[0].Plate_No;
			elem["model"] = result[0].Model;
			elem["company"] = result[0].Company;
			elem["type"] = result[0].Type;
			elem["vcltype"] = result[0].V_Type;
			elem["seats"] = result[0].Seats;
			elem["qty"] = result[0].Quantity;
			elem["color"] = result[0].Color;
			elem["gid"] = result[0].G_ID;
			elem['cost'] = result[0].Cost;

			cost = elem['cost'];

			vehicleData.push(elem);
			console.log(vehicleData);
			res.render('confirmBooking', { title: 'Confirm Booking', vdata: vehicleData, toDate: toDate, fromDate: fromDate, uid: uid });
		});
	});
});

router.post('/payment', function(req, res, next) {
	var payMethod = req.body.pay;

	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'VEHICLE_RENTAL'
	});

	con.connect(function(err) {
		if(err) throw err;
		console.log('Connected to VECHICLE_RENTAL database');

		console.log(uid);
		console.log(req.body);
		var sql = "INSERT INTO Payment (User_ID, Pay_Date, Amount, Method, Success) VALUES ('" + uid + "', CURDATE(), " + cost + ", '" + payMethod + "', NULL);";
		console.log(sql);
		con.query(sql, function(err, result) {
			if(err) throw err;

			//console.log(result);

			var sql_1 = "UPDATE Payment SET Success = @poss;";
			con.query(sql_1, function(err, result) {
				if(err) throw err;
			});
			var sql_2 = "SELECT @poss AS poss;";
			con.query(sql_2, function(err, result) {
				if(err) throw err;

				console.log(result);
				if(result[0].poss == 1) {
					alert("Success");

					var sql_3 = "INSERT INTO Booking (User_ID, Plate_No, Start_Date, End_Date, No_of_Days, Pay_ID) VALUES ('" + uid + "', '" + plno + "', '" + fromDate + "', '" + toDate + "', DATEDIFF(End_Date, Start_Date), (SELECT MAX(Pay_ID) FROM Payment));";
					con.query(sql_3, function(err, result) {
						if(err) throw err;
					});
				} else {
					alert("Failed");
				}
				res.redirect('/homeUser');
			});
		})
	});
});

module.exports = router;

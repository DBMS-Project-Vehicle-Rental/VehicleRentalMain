var express = require('express');
var mysql = require('mysql');
var router = express.Router();
// var alert = require('alert-node');

var creds = require('../app');

var uid, plno, toDate, fromDate, cost, tcost, modelnm;

// GET login page.
router.get('/', function(req, res, next) {
	uid = req.query.uid;
	plno = req.query.plateNo;
	toDate = req.query.toDate;
	fromDate = req.query.fromDate;
	//var payMet = req.body.pay;
  // var timeDifference = Math.abs(Date(toDate).getTime() - Date(fromDate).getTime());
	// var ndays = Math.ceil(timeDifference / (1000 * 3600 * 24));
	dt1 = new Date(fromDate);
	dt2 = new Date(toDate);
 	var ndays =  1+Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
	console.log('Number of Days = '+ndays);

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

		var sql = "Select Plate_No,v.Model_Name as Model,Company,Type,V_Type,Seats,Units,Color,G_ID, Cost from Vehicles v, VehicleDetails vd where v.Model_Name=vd.Model_Name and Plate_No='"+plno+"';";
		console.log(sql);
		con.query(sql, function(err, result) {
			if(err) throw err;

			var vehicleData = [];
			var elem = new Object();
			elem["plno"] = result[0].Plate_No;
			modelnm = elem["model"] = result[0].Model;
			elem["company"] = result[0].Company;
			elem["type"] = result[0].Type;
			elem["vcltype"] = result[0].V_Type;
			elem["seats"] = result[0].Seats;
			elem["qty"] = result[0].Units;
			elem["color"] = result[0].Color;
			elem["gid"] = result[0].G_ID;
			elem['cost'] = result[0].Cost;
			tcost = (result[0].Cost)*ndays;
			cost = elem['cost'];

			vehicleData.push(elem);
			console.log(vehicleData);
			res.render('confirmBooking', { title: 'Confirm Booking', vdata: vehicleData, toDate: toDate, fromDate: fromDate, uid: uid, ndays: ndays, value: 1  });
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
		var sql = "INSERT INTO Payment (User_ID, Pay_Date, Amount, Method, Success) VALUES ('" + uid + "', CURDATE(), " + tcost + ", '" + payMethod + "', NULL);";
		console.log(sql);
		con.query(sql, function(err, result) {
			if(err) throw err;

			//console.log(result);

			var sql_1 = "UPDATE Payment SET Success = @poss where Pay_ID = @mpid;";
			console.log(sql_1);
			con.query(sql_1, function(err, result) {
				if(err) throw err;
			});
			var sql_2 = "SELECT @poss AS poss;";
			con.query(sql_2, function(err, result) {
				if(err) throw err;

				console.log(result);
				if(result[0].poss == 1) {
					// alert("Success","notify-send");
					var sql_3 = "INSERT INTO Booking (User_ID, Plate_No, Start_Date, End_Date, No_of_Days, Pay_ID) VALUES ('" + uid + "', '" + plno + "', '" + fromDate + "', '" + toDate + "', DATEDIFF(End_Date, Start_Date)+1, (SELECT MAX(Pay_ID) FROM Payment));";
					con.query(sql_3, function(err, result) {
						if(err) throw err;
						var sql_5 = "Update VehicleDetails set Booked = 1 where Plate_No = '"+plno+"';";
						con.query(sql_5, function(err, result) {
							if(err) throw err;
							if(payMethod=='Wallet') {
								var sql_4 = "Update User set Wallet = (Wallet - "+tcost+" ) where User_ID = '"+uid+"';";
								con.query(sql_4, function(err, result) {
									if(err) throw err;
								});
							}
						});
					});
          res.render('confirmBooking', { title: 'Payment Status', value: 2 });
				} else {
					// alert("Failed","notify-send");
          res.render('confirmBooking', { title: 'Payment Status', value: 3 });
				}
				// res.redirect('/homeUser');
			});
		})
	});
});

module.exports = router;

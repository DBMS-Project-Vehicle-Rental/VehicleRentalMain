var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var creds = require('../app');

var userid;
var fromDate;
var toDate;

router.get('/', function(req, res, next) {
	/*console.log(req.query.uid);
	if(typeof req.query.uid !== 'undefined' && req.query.uid) {
	userid = req.query.uid;
	}*/
	if(req.session.user == 1) {
		userid = req.session.id;
		res.render('homeUser', {title: 'User\'s Home', uid: userid ,vdata: []});
	} else {
		res.redirect('/login');
	}
});

router.post('/getDate', function(req, res, next) {
	var dates = String(req.body.daterange).split(" ");
	fromDate = dates[0];
	toDate = dates[2];
	res.redirect('/homeUser#typeSection');
});

router.post('/', function(req, res, next) {
	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'VEHICLE_RENTAL'
	});

	con.connect(function(err) {
		if(err) throw err;
		console.log('Connected to PROJECT database');
		var toSend;

		if(req.body.car=='Cars') {
			toSend = 'car';
		} else {
			toSend = 'bike';
		}
		var sql = "Select Plate_No,v.Model_Name as Model,Company,Type,V_Type,Seats,Quantity,Color,G_ID, Cost from Vehicles v, VehicleDetails vd where Quantity>0 and v.Model_Name=vd.Model_Name and V_type='"+toSend+"';";
		console.log(sql);
		con.query(sql, function(err, result) {
			if(err) throw err;
			var vehicleData = [];
			for(i=0;i<result.length;++i) {
				var elem = new Object();
				elem["plno"] = result[i].Plate_No;
				elem["model"] = result[i].Model;
				elem["company"]= result[i].Company;
				elem["type"]= result[i].Type;
				elem["vcltype"]= result[i].V_Type;
				elem["seats"]= result[i].Seats;
				elem["qty"]= result[i].Quantity;
				elem["color"]= result[i].Color;
				elem["gid"]= result[i].G_ID;
				elem["cost"]= result[i].Cost;
				vehicleData.push(elem);
				//console.log(result[i]);
			}
			// vehicleData.forEach(function(entry) {
			//     console.log(entry.plno);
			// });
			res.render('homeUser', {title: 'User\'s Home', uid: userid, vdata: vehicleData});

		});
	});
});


router.post('/bookingVehicle', function(req, res, next) {
	res.redirect('/confirmBooking?uid='+userid+'&plateNo='+req.body.chosen+'&fromDate='+fromDate+'&toDate='+toDate);
});

module.exports = router;

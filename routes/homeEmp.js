var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var empid;

router.get('/', function(req, res, next) {
	if(req.session.emp == 1) {
		// Set id from cookies
		empid = req.session.id;

		var con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'p@t@n@hi',
			database: 'VEHICLE_RENTAL'
		});

		con.connect(function(err) {
			if(err) throw err;

			console.log('Connected');

			var sql = "SELECT User_ID, Name, e.G_ID, G_Name, Location, vd.Model_Name, vd.Plate_No FROM Employee	e, Garage g, VehicleDetails vd WHERE e.User_ID = '" + empid + "' AND g.G_ID = e.G_ID AND vd.G_ID = e.G_ID;";
			con.query(sql, function(err, result) {
				if(err) throw err;
				var data = [];

				var ob = new Object();
				ob["empid"] = result[0].User_ID;
				ob["ename"] = result[0].Name;
				ob["gid"] = result[0].G_ID;
				ob["gname"] = result[0].G_Name;
				ob["gloc"] = result[0].Location;

				data.push(ob);

				var vdata = [];
				for(i = 0; i < result.length; i++) {
					var ob = new Object();
					ob["modname"] = result[i].Model_Name;
					ob["plno"] = result[i].Plate_No;

					vdata.push(ob);
				}
				console.log(data);
				console.log(vdata);

				// Render page using 'ID' and 'data'

				// Send only Model_Name and Plate_No as list of objects
				// Send other Employee data as simple list

				res.render('homeEmp', { title: 'Employee\'s Home', eid: empid, data: data, vdata: vdata });
			});
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;

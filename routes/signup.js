var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var creds = require('../app');

// GET login page.
router.get('/', function(req, res, next) {
		res.render('signup', { title: 'Sign Up',value: 0 });
});

router.post('/', function(req, res, next) {
		if(req.body.Employee=='Employee') {

			var con = mysql.createConnection({
				host: 'localhost',
				user: creds.creds[0].username,
				password: creds.creds[0].password,
				database: 'VEHICLE_RENTAL'
			});

			con.connect(function(err) {
				if(err) throw err;
				console.log("Connected to VEHICLE_RENTAL");

				var sql = "Select G_ID from Garage;";
				con.query(sql, function(err, result) {
					if(err) throw err;
					var gid1 = result[0].G_ID;
					var gid2 = result[1].G_ID;
					res.render('signup', { title: 'Sign Up',value: 1, gdata1: gid1, gdata2: gid2 });
			  });
			});
		}
		else {
			res.render('signup', { title: 'Sign Up',value: 2 });
		}
});

router.post('/submitUser', function(req, res, next) {
		console.log(req.body.usrid);

		var con = mysql.createConnection({
			host: 'localhost',
			user: creds.creds[0].username,
			password: creds.creds[0].password,
			database: 'VEHICLE_RENTAL'
		});

		con.connect(function(err) {
			if(err) throw err;
			console.log("Connected to VEHICLE_RENTAL");

			var sql = "INSERT INTO User VALUES('"+req.body.usrid+"','"+req.body.nm+"','"+req.body.email+"',"+req.body.phno+",'"+req.body.addr+"','"+req.body.pwd+"',"+req.body.wallet+");";
			con.query(sql, function(err, result) {
				if(err) throw err;
				res.redirect('/login');
		  });
		});


		// console.log(req.files.photo);
		// if (!req.files)
    //   console.log('No files were uploaded.');
    //
    // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    // let sampleFile = req.files.photo;
    //
    // // Use the mv() method to place the file somewhere on your server
    // sampleFile.mv('/home/ayush98/dbms/WebsiteProject/VehicleRentalMain/public/images/ProfileUser/'+req.body.nm+'.png', function(err) {
    //   if (err)
    //     console.log(err);
    //
    //   console.log('File uploaded!');
    // });

});

router.post('/submitEmployee', function(req, res, next) {
		console.log(req.body.empid);

		var con = mysql.createConnection({
			host: 'localhost',
			user: creds.creds[0].username,
			password: creds.creds[0].password,
			database: 'VEHICLE_RENTAL'
		});

		con.connect(function(err) {
			if(err) throw err;
			console.log("Connected to VEHICLE_RENTAL");

			var sql = "INSERT INTO Employee VALUES('"+req.body.empid+"','"+req.body.enm+"','"+req.body.email+"',"+req.body.phno+",'"+req.body.addr+"','"+req.body.pwd+"','"+req.body.gid+"');";
			con.query(sql, function(err, result) {
				if(err) throw err;
				res.redirect('/login');
		  });
		});
});

module.exports = router;

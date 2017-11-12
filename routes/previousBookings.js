var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var userid;
var fromDate;
var toDate;

router.get('/', function(req, res, next) {
	if(req.session.user == 1) {
		// Set id from cookies
		userid = req.session.id;

		var con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'p@t@n@hi',
			database: 'VEHICLE_RENTAL'
		});

		con.connect(function(err) {
			if(err) throw err;

			console.log('Connected');

			var sql = "Select Pay_ID, Pay_Date, Amount, Method, b.Book_ID as BID,Plate_No, Book_Date, No_of_Days from Booking b, Payment p where p.Book_ID = b.Book_ID and p.User_ID = b.User_ID and Success = 1 and p.User_ID = '"+userid+"';";
			con.query(sql, function(err, result) {
				if(err) throw err;

				var vdata = [];
				for(i = 0; i < result.length; i++) {
					var ob = new Object();
					ob["payid"] = result[i].Pay_ID;
					ob["paydt"] = result[i].Pay_Date;
					ob["amt"] = result[i].Amount;
					ob["method"] = result[i].Method;
					ob["bid"] = result[i].BID;
					ob["plno"] = result[i].Plate_No;
					ob["bdt"] = result[i].Book_Date;
					ob["ndays"] = result[i].No_of_Days;

					vdata.push(ob);
				}

				res.render('previousBookings', { title: 'Booking History', uid: userid, vdata: vdata });
			});
		});
	} else {
		res.redirect('/login');
	}
});


module.exports = router;

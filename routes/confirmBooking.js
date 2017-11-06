var express = require('express');
var mysql = require('mysql');
var router = express.Router();

// GET login page.
router.get('/', function(req, res, next) {
  var uid = req.query.uid;
  var plno = req.query.plateNo;
  var toDate = req.query.toDate;
  var fromDate = req.query.fromDate;

  var con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'p@t@n@hi',
        database: 'VEHICLE_RENTAL'
    });
    
    con.connect(function(err) {
        if(err) throw err;
        console.log('Connected to PROJECT database');
        var toSend;

        var sql = "Select Plate_No,v.Model_Name as Model,Company,Type,V_Type,Seats,Quantity,Color,G_ID from Vehicles v, VehicleDetails vd where v.Model_Name=vd.Model_Name and Plate_No='"+plno+"';";
        console.log(sql);
        con.query(sql, function(err, result) {
                if(err) throw err;

                var vehicleData = [];
                var elem = new Object();
                elem["plno"] = result[0].Plate_No;
                elem["model"] = result[0].Model;
                elem["company"]= result[0].Company;
                elem["type"]= result[0].Type;
                elem["vcltype"]= result[0].V_Type;
                elem["seats"]= result[0].Seats;
                elem["qty"]= result[0].Quantity;
                elem["color"]= result[0].Color;
                elem["gid"]= result[0].G_ID;
                vehicleData.push(elem);
                //console.log(vehicleData);
                res.render('confirmBooking', { title: 'Confirm Booking', vdata: vehicleData, toDate: toDate, fromDate: fromDate, uid: uid });
        });
    });
});

module.exports = router;
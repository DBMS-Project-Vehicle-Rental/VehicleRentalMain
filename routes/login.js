var express = require('express');
var mysql = require('mysql');
var router = express.Router();

// GET login page.
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

// POST from login page.
router.post('/verify', function(req, res, next) {
	// Verify login crendentials from DB.
	var con = mysql.createConnection({
		host: 'localhost',
		user: 'devansh',
		password: 'kanha0812',
		database: 'VEHICLE_RENTAL'
	});

	con.connect(function(err) {
        if(err) throw err;

        console.log('Connected to PROJECT database');

        var sql = 'SELECT Password FROM User WHERE User_ID = ' + mysql.escape(req.body.username);
        con.query(sql, function(err, result) {
            if(err) throw err;

            var reqPass = String(req.body.password);
            var resPass = result[0].Password;

            if(resPass === reqPass) {
                console.log('True');
                //auth = true;

                //res.write('Credentials verified... Redirecting to homepage...')
                //sleep.sleep(2)
                //res.redirect('/homepage')
            }
            else {
                console.log('False')

                //res.write('Credentials invalid... Redirecting to login...')
                //sleep.sleep(2)
                res.redirect(302, '/login')
            }
        });
    });
});
module.exports = router;

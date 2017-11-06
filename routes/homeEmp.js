var express = require('express');
var router = express.Router();

var empid;

router.get('/', function(req, res, next) {
	if(req.session.emp == 1) {
		empid = req.session.id;
		res.render('homeEmp', { title: 'Employee\'s Home'});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;

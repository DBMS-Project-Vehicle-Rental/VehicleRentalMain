var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('homeEmp', { title: 'Employee\'s Home'});
});

module.exports = router;

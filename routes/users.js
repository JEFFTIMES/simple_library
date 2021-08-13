var express = require('express');
var router = express.Router();

const routeCool = function(req, res, next){
  res.send('your are really cool.')
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// add new route in user
router.get('/cool',routeCool);

module.exports = router;

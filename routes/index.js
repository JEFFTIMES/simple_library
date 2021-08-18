const express = require('express');
const router = express.Router();
//const path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/catalog');
});


// router.get('/', function (req, res, next) {
//   var options = {
//     root: path.join(path.resolve('./'), 'public'),
//     //dotfiles: 'deny',
//     headers: {
//       'x-timestamp': Date.now(),
//       'x-sent': true
//     }
//   }

//   //var fileName = req.params.name
//   res.sendFile('mock.html', options, function (err) {
//     if (err) {
//       next(err)
//     } else {
//       console.log('Sent:', 'mock.html')
//       res.end();
//     }
//   })
// })


module.exports = router;



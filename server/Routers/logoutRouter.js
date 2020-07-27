const express = require('express');
const authController = require('../Controllers/authController.js');
const passport = require('passport');

const router = express.Router();
// when get a post request fine and compare user
router.get('/', function (req, res) {
	req.logout();

	req.session.save(function () {
		res.status(200).send('logOut success');
	});
});

module.exports = router;

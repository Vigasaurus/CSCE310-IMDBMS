const express = require('express');
const router = express.Router();
const sql = require('../postgres');
const middleware = require('../middleware');

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/movies', function (req, res) {
	res.render('dashboard');
});

router.get('/login', middleware.checkNotAuthenticated, function (req, res) {
	res.render('login');
});

router.get('/signup', middleware.checkNotAuthenticated, function (req, res) {
	res.render('signup');
});

module.exports = router;

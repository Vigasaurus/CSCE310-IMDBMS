const express = require('express');
const router = express.Router();
const sql = require('../postgres');

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/about-us', function (req, res) {
	res.render('about-us');
});

router.get('/terms-and-conditions', function (req, res) {
	res.render('terms-and-conditions');
});

router.get('/privacy-policy', function (req, res) {
	res.render('privacy-policy');
});

module.exports = router;

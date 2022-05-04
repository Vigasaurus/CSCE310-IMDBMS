const express = require('express');
const router = express.Router();
const sql = require('../postgres');
const {
	checkNotAuthenticated,
	checkAuthenticated,
	checkAdmin,
} = require('../middleware');

router.get('/', checkNotAuthenticated, function (req, res) {
	res.render('landing');
});

router.get('/dashboard', checkAuthenticated, function (req, res) {
	req.flash('success', 'Welcome to IMDBMS!');
	res.render('dashboard', {auth: req.user});
});

router.get('/login', checkNotAuthenticated, function (req, res) {
	res.render('login', {auth: false});
});

router.get('/signup', checkNotAuthenticated, function (req, res) {
	res.render('signup', {auth: false});
});

router.get('/profile/:user', checkAuthenticated, function (req, res) {
	res.render('profile', { user: req.params.user, auth: req.user });
});

router.get('/movie/:movie', checkAuthenticated, function (req, res) {
	res.render('movie', { movie: req.params.movie, auth: req.user });
});

router.get('/moderation', checkAdmin, function (req, res) {
	res.render('moderation', {auth: req.user});
});

module.exports = router;

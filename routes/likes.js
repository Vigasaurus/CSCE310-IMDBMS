const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Returns all likes for currently logged in user (will update how to access that later, for now just hardcode)
router.get('/likes', function (req, res) {
	res.send({});
});

// Returns a specific like given the like id
router.get('/likes/:id', function (req, res) {
	res.send({});
});

// Adds a like for the given user - uses req.params.user for the user id, and req.body for the movie id
router.post('/likes/:user', function (req, res) {
	res.send({});
});

// Updates a like given the like id - uses req.params.id for the like id, and req.body for updated index
router.patch('/likes/:id', function (req, res) {
	res.send({});
});

// Deletes a like given the like id from req.params.id
router.delete('/likes/:id', function (req, res) {
	res.send({});
});

module.exports = router;

const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Returns all movies in the database, including the casting information
router.get('/movies', function (req, res) {
	res.send({});
});

// Returns a single movie, including the casting information - use req.params.id for movie id
router.get('/movies/:id', function (req, res) {
	res.send({});
});

// Adds new movie (Vig will handle admin-only authorization) - use req.body for all data input
router.post('/movies', function (req, res) {
	res.send({});
});

// Updates fields of a movie - use req.params.id for movie id, and req.body for updated data
router.patch('/movies/:id', function (req, res) {
	res.send({});
});

// Deletes a movie - use req.params.id for movie id
router.delete('/movies/:id', function (req, res) {
	res.send({});
});

module.exports = router;

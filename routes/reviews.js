const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Retrieves all reviews for a movie - uses req.params.movie for movie id
router.get('/reviews/:movie', function (req, res) {
	res.send({});
});

// Adds a new review - uses req.body for all data input
router.post('/reviews', function (req, res) {
	res.send({});
});

// Updates a review - uses req.params.id for review id, and req.body for updated data
router.patch('/reviews/:id', function (req, res) {
	res.send({});
});

// Deletes a review - uses req.params.id for review id
router.delete('/reviews/:id', function (req, res) {
	res.send({});
});

module.exports = router;

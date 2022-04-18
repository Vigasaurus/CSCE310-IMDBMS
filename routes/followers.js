const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Get all followers for a user - use req.params.id for user id
router.get('/followers/:id', function (req, res) {
	res.send({});
});

// Adds a new follower for a user - use req.body for all data
router.post('/followers', function (req, res) {
	res.send({});
});

// Updates the status of a follower item - use req.params.id for follower item id
router.patch('/followers/:id', function (req, res) {
	res.send({});
});

// Deletes a follower item - use req.params.id for follower item id
router.delete('/followers/:id', function (req, res) {
	res.send({});
});

module.exports = router;

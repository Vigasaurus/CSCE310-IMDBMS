const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Retrieves most recent x modlog items
router.get('/modlog', function (req, res) {
	res.send({});
});

// Adds a new modlog item of a given type - use req.params.type for type, use req.body for all other data
router.post('/modaction/:type', function (req, res) {
	res.send({});
});

// Updates a review body - use req.params.id for review id
router.patch('/modclear/:id', function (req, res) {
	res.send({});
});

// Deletes a user or review - use req.params.type for type specification and req.params.id for user or review id
router.delete('/moddelete/:type/:id', function (req, res) {
	res.send({});
});

module.exports = router;

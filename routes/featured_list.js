const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Gets current featured list - should check the date range using current datetime
router.get('/featured', function (req, res) {
	res.send({});
});

// Adds new item to featured list - use req.body for new data (Vig will handle admin-only authorization)
router.post('/featured', function (req, res) {
	res.send({});
});

// Updates a featured list item - use req.params.id for item id, use req.body for updated index
router.patch('/featured/:id', function (req, res) {
	res.send({});
});

// Delte a featured list item - use req.params.id for item id
router.delete('/featured/:id', function (req, res) {
	res.send({});
});

module.exports = router;

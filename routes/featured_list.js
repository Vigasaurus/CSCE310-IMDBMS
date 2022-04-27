const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Gets current featured list - should check the date range using current datetime
router.get('/featured', async function (req, res) {
	const userid = 2;

	// Featured list query
	const featured_list = await sql`
		SELECT movie_id FROM featured_movies where creator_id = ${userid};
	`;
	
	res.send({featured_list});
});

// Adds new item to featured list - use req.body for new data (Vig will handle admin-only authorization)
router.post('/featured', async function (req, res) {
	res.send({});
});

// Updates a featured list item - use req.params.id for item id, use req.body for updated index
router.patch('/featured/:id', async function (req, res) {
	res.send({});
});

// Delte a featured list item - use req.params.id for item id
router.delete('/featured/:id', async function (req, res) {
	res.send({});
});

module.exports = router;

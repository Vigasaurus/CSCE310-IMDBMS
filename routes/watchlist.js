const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Gets watchlist for a user - use req.params.user for user id
router.get('/watchlist/:user', async function (req, res) {
	const userid = 2;

	// Featured list query
	const featured_list = await sql`
		SELECT movie_id FROM watches where id = ${userid};
	`;

	const example = await sql`
		SELECT movie_id FROM watches where id = ${userid} INNER JOIN on movies where movies.id = movie_id;
	`;
	
	res.send({});
});

// Adds new watchlist item for a user - use req.params.user for user id
router.post('/watchlist/:user', async function (req, res) {
	res.send({});
});

// Updates a watchlist item for a user - use req.params.id for watchlist item id, use req.body for updated data
router.patch('/watchlist/:id', async function (req, res) {
	res.send({});
});

// Deletes a watchlist item for a user - use req.params.id for watchlist item id
router.delete('/watchlist/:id', async function (req, res) {
	res.send({});
});

module.exports = router;

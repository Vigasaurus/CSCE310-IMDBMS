const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Gets watchlist for a user - use req.params.user for user id
router.get('/watchlist/:user', async function (req, res) {
	console.log(req.params.id);
	console.log(req.body);
	const query = await sql`
		SELECT * FROM watches where user_id = ${req.params.user}
	`
	res.send({query});
});

// Adds new watchlist item for a user - use req.params.user for user id
router.post('/watchlist/:user', async function (req, res) {
	console.log(req.params.id);
	const user_id = req.params.id;
	
	const query = await sql`
		INSERT INTO watches(user_id, movie_id, index)
		VALUES (${req.params.user}, ${req.body}, 1})

	`
	res.send({query});
});

// Updates a watchlist item for a user - use req.params.id for watchlist item id, use req.body for updated data
router.patch('/watchlist/:id', async function (req, res) {
	const query = await sql`
		UPDATE watches 
		SET movie_id = ${req.body}, index = ${req.body}
		WHERE id = ${req.params.id} AND user_id = ${req.params.user}
	`
	res.send({query});
});

// Deletes a watchlist item for a user - use req.params.id for watchlist item id
router.delete('/watchlist/:id', async function (req, res) {
	const query = await sql`
		DELETE FROM watches where id = ${req.params.id} AND user_id = ${req.params.user}
	`
	res.send({query});
});

module.exports = router;

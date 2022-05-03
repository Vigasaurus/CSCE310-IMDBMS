const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Gets watchlist for a user - use req.params.user for user id
router.get('/watchlist/:user', async function (req, res) {
	console.log(req.body);
	const query = await sql`
		SELECT * FROM watches where user_id = ${req.params.user}
	`;
	res.send({query});
});

// Adds new watchlist item for a user - use req.params.user for user id
router.post('/watchlist/:user', async function (req, res) {
	// title is key for body
	const query = await sql`
		INSERT INTO watches (user_id, movie_id, index)
		VALUES (
			${req.params.user}
			, (select id from movies where title like '%${req.body.title}%' limit 1)
			, 1
		)
	`;

	res.send({query});
});

// Updates a watchlist item for a user - use req.params.id for watchlist item id, use req.body for updated data
router.patch('/watchlist/:id', async function (req, res) {
	const query = await sql`
		UPDATE watches
		SET movie_id = (select id from movies where title like '%${req.body.title}%' limit 1), index = 1
		WHERE id = ${req.params.id}
	`;

	res.send({query});
});

// Deletes a watchlist item for a user - use req.params.id for watchlist item id
router.delete('/watchlist/:id', async function (req, res) {
	const query = await sql`
		DELETE FROM watches where id = ${req.params.id}
	`;

	res.send({query});
});

module.exports = router;

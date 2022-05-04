const express = require('express');
const { checkAuthenticated } = require('../middleware');
const router = express.Router();
const sql = require('../postgres');

// Gets watchlist for authenticated user
router.get('/watchlist', checkAuthenticated, async function (req, res) {
	const watchlist = await sql`
		SELECT title, watches.index, watches.id as watch_id, movies.id FROM movies
		JOIN watches ON movies.id = watches.movie_id
		WHERE watches.user_id  =${req.user.id}
		ORDER BY watches.index;
	`;

	res.send({ watchlist });
});

// Adds new watchlist item for authenticated user
router.post(
	'/watchlist/:movie_id',
	checkAuthenticated,
	async function (req, res) {
		try {
			const query = await sql`
		INSERT INTO watches (user_id, movie_id, index) VALUES (${req.user.id}, ${req.params.movie_id}, 1)
	`;
			req.flash('success', 'Movie added to your watchlist');
			res.redirect(`/movie/${req.params.movie_id}`);
		} catch (e) {
			console.log(e);
			res.status(500).send('An error occurred.');
		}
	}
);

// Updates a watchlist item for a user - use req.params.id for watchlist item id, use req.body for updated data
router.patch('/watchlist/:id', checkAuthenticated, async function (req, res) {
	let existing_watchlist_item;
	try {
		existing_watchlist_item = (
			await sql`
			SELECT * FROM watches WHERE id = ${req.params.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_watchlist_item) {
		res.status(400).send('Watchlist item not found.');
		return;
	}

	if (req.user.id !== existing_watchlist_item.user_id) {
		res
			.status(403)
			.send('You do not have permission to update this watchlist item.');
		return;
	}

	try {
		await sql`
			UPDATE watches
			SET index = ${req.body.index || existing_watchlist_item.index}
			WHERE id = ${req.params.id};
		`;
		req.flash('success', 'Movie moved to the top of your watchlist');
		res.redirect(`/movie/${existing_watchlist_item.movie_id}`);
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Deletes a watchlist item for authenticated user - use req.params.id for watchlist item id
router.delete('/watchlist/:id', checkAuthenticated, async function (req, res) {
	let existing_watchlist_item;
	try {
		existing_watchlist_item = (
			await sql`
			SELECT * FROM watches WHERE id = ${req.params.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_watchlist_item) {
		res.status(400).send('Watchlist item not found.');
		return;
	}

	if (req.user.id !== existing_watchlist_item.user_id) {
		res
			.status(403)
			.send('You do not have permission to delete this watchlist item.');
		return;
	}

	try {
		await sql`
		DELETE FROM watches WHERE id = ${req.params.id};
	`;

		req.flash('success', 'Movie removed from your watchlist');
		res.redirect(`/movie/${existing_watchlist_item.movie_id}`);
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

module.exports = router;

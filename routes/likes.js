const express = require('express');
const router = express.Router();
const sql = require('../postgres');
const { checkAuthenticated } = require('../middleware');
// Feature Set by Jesica Jimenez

// Returns all likes for currently logged in user
router.get('/likes', checkAuthenticated, async function (req, res) {
	const likes = await sql`
		SELECT title, likes.index, likes.id as like_id, movies.id as id, movies.genre FROM movies
		JOIN likes ON movies.id = likes.movie_id
		WHERE likes.user_id  =${req.user.id}
		ORDER BY likes.index ASC;
	`;

	res.send({ likes });
});

// Returns a specific like given the like id
router.get('/likes/:id', async function (req, res) {
	const likes = await sql`
		SELECT movies.title, users.first_name, users.last_name, index FROM likes
		JOIN movies ON movies.id = likes.movie_id
		JOIN users ON likes.user_id = users.id
		WHERE likes.id  =${req.params.id};
	`;

	res.send({ likes });
});

// Adds a like for the authenticated user - uses req.params.movie_id for the movie id
router.post('/likes/:movie_id', checkAuthenticated, async function (req, res) {
	try {
		await sql`
			INSERT INTO likes(user_id, movie_id, index)
			VALUES ( ${req.user.id}, ${req.params.movie_id}, 1);
		`;
		req.flash('success', 'Movie added to your liked list');
			res.redirect(`/movie/${req.params.movie_id}`);
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Updates a like given the like id - uses req.params.id for the like id, and req.body for updated index
router.patch('/likes/:id', checkAuthenticated, async function (req, res) {
	let existing_like;
	try {
		existing_like = (
			await sql`
			SELECT * FROM likes WHERE id = ${req.params.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_like) {
		res.status(400).send('Like not found.');
		return;
	}

	if (req.user.id !== existing_like.user_id) {
		res.status(403).send('You do not have permission to edit this like.');
		return;
	}

	try {
		await sql`
		UPDATE likes
		SET index = ${req.body.index || existing_like.index}
		WHERE id = ${req.params.id};
	`;
	req.flash('success', 'Movie moved to the top of your liked list');
	res.redirect(`/movie/${existing_like.movie_id}`);
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Deletes a like given the like id from req.params.id
router.delete('/likes/:id', async function (req, res) {
	let existing_like;
	try {
		existing_like = (
			await sql`
			SELECT * FROM likes WHERE id = ${req.params.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_like) {
		res.status(400).send('Like not found.');
		return;
	}

	if (req.user.id !== existing_like.user_id) {
		res.status(403).send('You do not have permission to delete this like.');
		return;
	}

	try {
		await sql`
		DELETE FROM likes WHERE id = ${req.params.id};
	`;
	req.flash('success', 'Movie removed from your liked list');
	res.redirect(`/movie/${existing_like.movie_id}`);
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

module.exports = router;

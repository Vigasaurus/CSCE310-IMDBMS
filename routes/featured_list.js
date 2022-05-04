const express = require('express');
const postgres = require('postgres');
const { checkAuthenticated } = require('../middleware');
const router = express.Router();
const sql = require('../postgres');
// Feature Set by David Tang

// Gets current featured list - should check the date range using current datetime
router.get('/featured', async function (req, res) {
	let maxWeek;
	try {
		maxWeek = (
			await sql`
			SELECT MAX(week) FROM featured_movies;
		`
		)[0].max;
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	const featured_movies = await sql`
		SELECT movies.title, movies.genre, movies.runtime, index, featured_movies.id, movie_id, first_name, last_name FROM featured_movies
		INNER JOIN movies ON featured_movies.movie_id = movies.id
		INNER JOIN users ON featured_movies.creator_id = users.id
		WHERE week = ${maxWeek}
		ORDER BY index ASC;
	`;

	res.send({ featured_movies });
});

// Adds new item to featured list - use req.body for new data
router.post('/featured', checkAuthenticated, async function (req, res) {
	const weekNumber = new Date(new Date().toISOString().split('T')[0]).getTime();

	if (!req.user.isadmin) {
		res.status(403).send('You are not authorized to add to the featured list.');
		return;
	}

	try {
		await sql`
	INSERT INTO featured_movies(week, movie_id, creator_id, index)
	VALUES (${weekNumber}, ${req.body.movie_id}, ${req.user.id}, 1)
`;
		req.flash('success', 'Featured movie added.');
		res.redirect(`/moderation`);
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}
});

// Updates a featured list item - use req.params.id for item id, use req.body for updated index
router.patch('/featured/:id', checkAuthenticated, async function (req, res) {
	let existing_featured_movie;
	try {
		existing_featured_movie = (
			await sql`
			SELECT * FROM featured_movies WHERE id = ${req.params.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_featured_movie) {
		res.status(400).send('Featured movie not found.');
		return;
	}

	if (!req.user.isadmin) {
		res
			.status(403)
			.send('You do not have permission to edit this featured movie.');
		return;
	}

	try {
		await sql`
		UPDATE featured_movies
		SET index = ${req.body.index || existing_featured_movie.index}
		WHERE id = ${req.params.id};
	`;
		req.flash('success', 'Featured movie index updated.');
		res.redirect(`/moderation`);
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Delte a featured list item - use req.params.id for item id
router.delete('/featured/:id', checkAuthenticated, async function (req, res) {
	let existing_featured_movie;
	try {
		existing_featured_movie = (
			await sql`
			SELECT * FROM featured_movies WHERE id = ${req.params.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_featured_movie) {
		res.status(400).send('Featured movie not found.');
		return;
	}

	if (!req.user.isadmin) {
		res
			.status(403)
			.send('You do not have permission to edit this featured movie.');
		return;
	}

	try {
		const query = await sql`
		DELETE FROM featured_movies WHERE id = ${req.params.id}
	`;
		req.flash('success', 'Featured movie deleted.');
		res.redirect(`/moderation`);
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}
});

module.exports = router;

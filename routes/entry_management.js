const express = require('express');
const { checkAuthenticated } = require('../middleware');
const router = express.Router();
const sql = require('../postgres');

// Returns all movies in the database, not including the casting information
router.get('/movies', async function (req, res) {
	const movies = await sql`
		SELECT * FROM movies;
	`;
	res.send({ movies });
});

// Returns a single movie, including the casting information - use req.params.id for movie id
router.get('/movies/:movie_id', async function (req, res) {
	try {
		const movies = await sql`
		SELECT movies.title, movies.genre, movies.runtime FROM movies WHERE movies.id = ${req.params.movie_id};
	`;

		if (!movies.length) {
			res.status(404).send('Movie not found.');
			return;
		}

		const cast = await sql`
		SELECT first_name, last_name, compensation, type FROM castings WHERE movie_id = ${req.params.movie_id};
	`;

		res.send({ movie: { ...movies[0], cast } });
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Adds new movie (Vig will handle admin-only authorization) - use req.body for all data input
router.post('/movies', checkAuthenticated, async function (req, res) {
	if (!req.user.isadmin) {
		res.status(403).send('You do not have permission to add movies.');
		return;
	}

	try {
		await sql`
		INSERT INTO movies (title, genre, runtime) VALUES (${req.body.title}, ${req.body.genre}, ${req.body.runtime});
	`;
		res.send('Movie added.');
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

router.post('/movies/casting', checkAuthenticated, async function (req, res) {
	if (!req.user.isadmin) {
		res
			.status(403)
			.send('You do not have permission to add casting information.');
		return;
	}

	if (
		[
			req.body.first_name,
			req.body.last_name,
			req.body.compensation,
			req.body.type,
			req.body.movie_id,
		].some((value) => !value)
	) {
		res.status(400).send('Missing required fields.');
		return;
	}

	try {
		const movies = await sql`
		SELECT * FROM movies;
	`;

		if (!movies.length) {
			res.status(403).send('Movie does not exist.');
			return;
		}

		await sql`
		INSERT INTO castings (first_name, last_name, compensation, movie_id, type) VALUES (${req.body.first_name}, ${req.body.last_name}, ${req.body.compensation}, ${req.body.movie_id}, ${req.body.type});
	`;
		res.send('Casting entry added.');
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Updates fields of a movie - use req.params.id for movie id, and req.body for updated data
router.patch('/movies/:id', checkAuthenticated, async function (req, res) {
	if (!req.user.isadmin) {
		res
			.status(403)
			.send('You do not have permission to edit movie information.');
		return;
	}

	let existing_movie;
	try {
		existing_movie = (
			await sql`
			SELECT * FROM movies WHERE id = ${req.params.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_movie) {
		res.status(400).send('Movie does not exist.');
	}

	try {
		await sql`
		UPDATE movies SET title = ${
			req.body.title || existing_movie.title
		}, genre = ${req.body.genre || existing_movie.genre}, runtime = ${req.body.runtime || existing_movie.runtime} WHERE id = ${req.params.id};
	`;
		res.send('Movie updated.');
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Deletes a movie - use req.params.id for movie id
router.delete('/movies/:id', checkAuthenticated, async function (req, res) {
	if (!req.user.isadmin) {
		res.status(403).send('You do not have permission to delete a movie.');
		return;
	}

	let existing_movie;
	try {
		existing_movie = (
			await sql`
			SELECT * FROM movies WHERE id = ${req.params.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_movie) {
		res.status(400).send('Movie not found.');
		return;
	}

	try {
		await sql`
		DELETE FROM castings WHERE movie_id = ${req.params.id}
	`;

		await sql`
		DELETE FROM movies WHERE id = ${req.params.id}
	`;
		res.send('Movie deleted.');
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}
});

module.exports = router;

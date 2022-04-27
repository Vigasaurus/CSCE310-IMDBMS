const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Returns all movies in the database, including the casting information
router.get('/movies', async function (req, res) {
	const all_movies = await sql`
		SELECT movies.title, movies.genre, movies.runtime FROM movies INNER JOIN featured_movies ON movies.id = featured_movies.id;
	`;
	res.send({all_movies});
});

// Returns a single movie, including the casting information - use req.params.id for movie id
router.get('/movies/:id', async function (req, res) {
	const movie_id = 2;
	/*
	// If you want two separate queries

	// Main info query
	const main_info = await sql`
		SELECT title, genre, runtime FROM movies where id = ${movie_id};
	`;

	// Cast query
	const cast = await sql`
		SELECT firstname, lastname FROM casting where movie_id = ${movie_id};
	`;
	*/

	// Or if you want single query
	const all_info = await sql`
		SELECT movies.title, movies.genre, movies.runtime, casting.first_name, casting.last_name FROM movies INNER JOIN castings ON movies.id = castings.id WHERE movies.id = ${movie_id};
	`;

	res.send({all_info});
});

// Adds new movie (Vig will handle admin-only authorization) - use req.body for all data input
router.post('/movies', async function (req, res) {
	const add_movie = await sql`
		INSERT INTO movies (title, genre, runtime) VALUES (req.body inputs);
	`;

	res.send({add_movie});
});

// Updates fields of a movie - use req.params.id for movie id, and req.body for updated data
router.patch('/movies/:id', async function (req, res) {
	const movie_id = 2;

	const update_movie = await sql`
		UPDATE movies SET (req.body inputs) WHERE movies.id = ${movie_id};
	`;

	res.send({update_movie});
});

// Deletes a movie - use req.params.id for movie id
router.delete('/movies/:id', async function (req, res) {
	const movie_id = 2;

	const delete_movie = await sql`
		DELETE FROM movies WHERE id = ${movie_id};
	`;

	res.send({delete_movie});
});

module.exports = router;

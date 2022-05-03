const express = require('express');
const router = express.Router();
const sql = require('../postgres');
// Feature Set by Jesica Jimenez


// Returns all likes for currently logged in user (will update how to access that later, for now just hardcode)
router.get('/likes', async function (req, res) {
	console.log(req.params.id);

	console.log(req.body);

	const likes = await sql`
		SELECT title FROM movies
		JOIN likes ON movies.id = likes.movie_id
		WHERE likes.user_id  =${req.params.id};

	`;
	res.send({ likes });
	// SELECT title FROM movies
	// JOIN likes ON movies.id = likes.movie_id
	// WHERE likes.user_id =1 ;
});

// Returns a specific like given the like id
router.get('/likes/:id', async function (req, res) {
	console.log(req.params.id);
	console.log(req.body);

	const likes = await sql`
		SELECT title FROM movies
		JOIN likes ON movies.id = likes.movie_id
		WHERE likes.id =${req.params.id};
	`;
// SELECT title FROM movies
// JOIN likes ON movies.id = likes.movie_id
// WHERE likes.id = 1;
	res.send({likes});
});

// Adds a like for the given user - uses req.params.user for the user id, and req.body for the movie id
router.post('/likes/:user', async function (req, res) {

	// INSERT INTO likes(user_id, movie_id, index)
	// VALUES ( 1, 2, 1) ;
	console.log(req.params.id);
	console.log(req.body);

	const likes = await sql`
		INSERT INTO likes(user_id, movie_id, index)
		VALUES ( ${req.params.user}, ${req.body}, 1);

	`;
	res.send({likes});
});

// Updates a like given the like id - uses req.params.id for the like id, and req.body for updated index
router.patch('/likes/:id', async function (req, res) {

// UPDATE likes
// SET movies_id =4, index_num =1
// WHERE  id = 3 ;


	console.log(req.params.id);
	console.log(req.body);

	const likes = await sql`
		UPDATE likes
		SET index = ${req.params.user}
		WHERE  id = ${req.params.id};

	`;

	res.send({likes});
});

// Deletes a like given the like id from req.params.id
router.delete('/likes/:id', async function (req, res) {
	// DELETE FROM likes WHERE id = 2;
	console.log(req.params.id);
	console.log(req.body);

	const likes = await sql`
		DELETE FROM likes WHERE id = ${req.params.id};
	`;
	res.send({likes});
});

module.exports = router;

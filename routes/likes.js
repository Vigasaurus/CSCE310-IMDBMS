const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Returns all likes for currently logged in user (will update how to access that later, for now just hardcode)
router.get('/likes', async function (req, res) {
	const userid = 2;
	// Example query:
	/*
	const users = await sql`
		SELECT * FROM users where id = ${req.params.id};
	`;
	*/

	// Likes query
	const likes = await sql`
		SELECT movie_id FROM likes where id = ${userid};
	`;

	res.send({likes});
});

// Returns a specific like given the like id
router.get('/likes/:id', async function (req, res) {
	res.send({});
});

// Adds a like for the given user - uses req.params.user for the user id, and req.body for the movie id
router.post('/likes/:user', async function (req, res) {
	res.send({});
});

// Updates a like given the like id - uses req.params.id for the like id, and req.body for updated index
router.patch('/likes/:id', async function (req, res) {
	res.send({});
});

// Deletes a like given the like id from req.params.id
router.delete('/likes/:id', async function (req, res) {
	res.send({});
});

module.exports = router;

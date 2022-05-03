const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Vignesh will handle
router.post('/login', async function (req, res) {
	res.send({});
});

// Returns the user object except the passwordhash
router.get('/users/:id', async function (req, res) {
	// Example access URL-based parameters
	console.log(req.params.id);

	// Example access body-based parameters
	console.log(req.body);

	// Example query:
	const users = await sql`
		SELECT * FROM users where id = ${req.params.id};
	`;
 
	res.send({ users });
});

// Adds a new user - uses req.body for data input
router.post('/users', async function (req, res) {
	res.send({});
});

// Updates a user - uses req.body for data input and req.params.id for user id from url
router.patch('/user/:id', async function (req, res) {
	res.send({});
});

// Deletes a user - uses req.params.id for user id from url
router.delete('/user/:id', async function (req, res) {
	res.send({});
});

module.exports = router;

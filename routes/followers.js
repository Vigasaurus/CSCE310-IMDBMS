const express = require('express');
const router = express.Router();
const sql = require('../postgres');
// Feature Set by Jesica Jimenez

// Get all followers for a user - use req.params.id for user id
router.get('/followers/:id', async function (req, res) {
// SELECT first_name, last_name FROM users 
// JOIN follows ON users.id = follows.follower_id
// WHERE followed_id = 2;

	console.log(req.params.id);
	console.log(req.body);
	const follow = await sql`
		SELECT first_name, last_name FROM users 
		JOIN follows ON users.id = follows.follower_id
		WHERE followed_id = ${req.params.id};
	`;
	res.send({ follow });

});

// Adds a new follower for a user - use req.body for all data
router.post('/followers', async function (req, res) {
// INSERT INTO follows(id, follower_id, followed_id, accepted)
// VALUES ( 2, 1, false);
	console.log(req.params.id);
	console.log(req.body);
	const follow = await sql`
		INSERT INTO follows(follower_id, followed_id, accepted)
		VALUES (  ${req.body},  ${req.body},  ${req.body});
	`;
	res.send({ follow });
});

// Updates the status of a follower item - use req.params.id for follower item id
router.patch('/followers/:id', async function (req, res) {
	// UPDATE follows
	// SET accepted = true
	// WHERE follower_id = 1 ;
	console.log(req.params.id);
	console.log(req.body);
	const follow = await sql`
		UPDATE follows
		SET accepted = true
		WHERE follower_id = ${req.params.id};
	`;
	res.send({ follow });
});

// Deletes a follower item - use req.params.id for follower item id
router.delete('/followers/:id', async function (req, res) {
	// DELETE FROM follows WHERE follows.follower_id =2 ;
	console.log(req.params.id);
	console.log(req.body);
	const follow = await sql`
		DELETE FROM follows WHERE follows.follower_id = ${req.params.id};
	`;
	res.send({ follow });
});

module.exports = router;

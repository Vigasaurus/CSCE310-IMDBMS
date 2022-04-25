const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Get all followers for a user - use req.params.id for user id
router.get('/followers/:id', async function (req, res) {
// SELECT first_name, last_name FROM users 
// JOIN follows ON users.id = follows.follower_id
// WHERE followed_id = 2;
	res.send({});
});

// Adds a new follower for a user - use req.body for all data
router.post('/followers', async function (req, res) {
// INSERT INTO follows(id, follower_id, followed_id, accepted)
// VALUES ( 2, 1, false);
	res.send({});
});

// Updates the status of a follower item - use req.params.id for follower item id
router.patch('/followers/:id', async function (req, res) {
	
	res.send({});
});

// Deletes a follower item - use req.params.id for follower item id
router.delete('/followers/:id', async function (req, res) {
	// DELETE FROM follows WHERE follows.follower_id =2 ;
	res.send({});
});

module.exports = router;

const express = require('express');
const { checkAuthenticated } = require('../middleware');
const router = express.Router();
const sql = require('../postgres');
// Feature Set by Jesica Jimenez

// Get all followers for authenticated user
router.get('/followers', checkAuthenticated, async function (req, res) {
	const follows = await sql`
		SELECT first_name, last_name, accepted FROM users
		JOIN follows ON users.id = follows.followed_id
		WHERE follower_id = ${req.user.id};
	`;
	res.send({ follows });
});

// Get all follow requests for authenticated user
router.get(
	'/followers/requests',
	checkAuthenticated,
	async function (req, res) {
		const follow_requests = await sql`
		SELECT first_name, last_name, accepted, follows.id FROM users
		JOIN follows ON users.id = follows.follower_id
		WHERE followed_id = ${req.user.id};
	`;
		res.send({ follow_requests });
	}
);

// Adds a new followed user for authenticated user
router.post('/followers/:user_id', async function (req, res) {
	try {
		const existing_user = await sql`
			SELECT * FROM users WHERE id = ${req.params.user_id};
		`;

		if (!existing_user.length) {
			res.status(400).send('User not found.');
			return;
		}

		await sql`
			INSERT INTO follows(follower_id, followed_id, accepted)
			VALUES (  ${req.user.id},  ${req.params.user_id},  false);
		`;
		res.send('Follow request sent!');
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Accepts the status of a follower item - use req.params.id for follower item id
router.patch('/followers/:id', checkAuthenticated, async function (req, res) {
	try {
		const existing_follow = await sql`
			SELECT * FROM follows WHERE id = ${req.params.id};
		`;

		if (!existing_follow.length) {
			res.status(400).send('Follow not found.');
			return;
		}

		if (existing_follow[0].followed_id !== req.user.id) {
			res.status(400).send('You are not authorized to update this follow.');
			return;
		}

		await sql`
		UPDATE follows
		SET accepted = true
		WHERE follower_id = ${req.params.id};
	`;
		res.send('Follow request accepted!');
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Deletes a follower item - use req.params.id for follower item id
router.delete('/followers/:id', checkAuthenticated, async function (req, res) {
	try {
		const existing_follow = await sql`
			SELECT * FROM follows WHERE id = ${req.params.id};
		`;

		if (!existing_follow.length) {
			res.status(400).send('Follow not found.');
			return;
		}

		if (existing_follow[0].follower_id !== req.user.id) {
			res.status(400).send('You are not authorized to delete this follow.');
			return;
		}

		await sql`
		DELETE FROM follows WHERE follows.id = ${req.params.id};
	`;
		res.send('Follow deleted.');
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

module.exports = router;

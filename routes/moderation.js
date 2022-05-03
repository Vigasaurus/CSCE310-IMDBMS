const express = require('express');
const { checkAuthenticated } = require('../middleware');
const router = express.Router();
const sql = require('../postgres');

// Retrieves most recent x modlog items
router.get('/modaction', checkAuthenticated, async function (req, res) {
	if (!req.user.isadmin) {
		res.status(403).send('You are not authorized to view the modlog.');
		return;
	}

	const modlog = await sql`
		SELECT * FROM admin_actions;
	`;
	res.send({ modlog });
});

// Updates a review body - use req.params.id for review id
router.patch('/modaction/:id', checkAuthenticated, async function (req, res) {
	try {
		if (!req.user.isadmin) {
			res.status(403).send('You are not authorized to clear reviews.');
			return;
		}

		const existing_review = await sql`
			SELECT * FROM reviews WHERE id = ${req.params.id};
		`;

		if (!existing_review.length) {
			res.status(400).send('Review not found.');
			return;
		}

		await sql`
			UPDATE reviews SET body = '' WHERE id = ${req.params.id};
		`;

		await sql`
			INSERT INTO admin_actions(type, review_id, admin_id) VALUES ('review_clear', ${req.params.id}, ${req.user.id});
		`;
		res.send('Review cleared!');
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Deletes a user or review - use req.params.type for type specification and req.params.id for user or review id
router.delete(
	'/modaction/:type/:id',
	checkAuthenticated,
	async function (req, res) {
		try {
			if (!req.user.isadmin) {
				res.status(403).send('You are not authorized to delete items.');
				return;
			}

			if (!['user', 'review'].includes(req.params.type)) {
				res.status(400).send('Type must be either "user" or "review".');
				return;
			}

			let existing_entry;

			if (req.params.type === 'user') {
				existing_entry = await sql`
				SELECT * FROM users WHERE id = ${req.params.id};
			`;
			} else if (req.params.type === 'review') {
				existing_entry = await sql`
				SELECT * FROM reviews WHERE id = ${req.params.id};
			`;
			}

			if (!existing_entry.length) {
				res.status(400).send(`${req.params.type} not found.`);
				return;
			}

			if (req.params.type === 'user') {
				await sql`
				DELETE FROM users WHERE id = ${req.params.id};
			`;
			} else if (req.params.type === 'review') {
				await sql`
				DELETE FROM reviews WHERE id = ${req.params.id};
			`;
			}

			if (req.params.type === 'user') {
				await sql`
			INSERT INTO admin_actions (type, user_id, admin_id) VALUES ('user_delete', ${req.params.id}, ${req.user.id});
		`;
			} else if (req.params.type === 'review') {
				await sql`
			INSERT INTO admin_actions (type, review_id, admin_id) VALUES ('review_delete', ${req.params.id}, ${req.user.id});
		`;
			}

			res.send(`Entry of type '${req.params.type}' deleted.`);
		} catch (e) {
			console.log(e);
			res.status(500).send('An error occurred.');
		}
	}
);

module.exports = router;

const express = require('express');
const router = express.Router();
const sql = require('../postgres');
const { checkAuthenticated } = require('../middleware');

// Retrieves all reviews for a movie - uses req.params.movie_id for movie id
router.get('/reviews/:movie_id', async function (req, res) {
	const reviews = await sql`
		SELECT reviews.title, reviews.body, users.first_name, users.last_name, reviews.body, reviews.positive_sentiment FROM reviews INNER JOIN users ON reviews.author_id = users.id WHERE reviews.movie_id = ${req.params.movie_id};
	`;

	res.send({ reviews });
});

// Retrieves all reviews for an author - uses req.params.author_id for author id
router.get('/reviews/:author_id', async function (req, res) {
	const reviews = await sql`
		SELECT reviews.title, reviews.body, users.first_name, users.last_name, reviews.body, reviews.positive_sentiment FROM reviews INNER JOIN users ON reviews.author_id = users.id WHERE reviews.author_id = ${req.params.author_id};
	`;

	res.send({ reviews });
});

// Retrieves all reviews for authenticated user
router.get(
	'/reviews/:author_id',
	checkAuthenticated,
	async function (req, res) {
		const reviews = await sql`
		SELECT reviews.title, reviews.body, users.first_name, users.last_name, reviews.body, reviews.positive_sentiment FROM reviews INNER JOIN users ON reviews.author_id = users.id WHERE reviews.author_id = ${req.user.id};
	`;

		res.send({ reviews });
	}
);

// Adds a new review - uses req.body for all data input
router.post(
	'/reviews/:movie_id',
	checkAuthenticated,
	async function (req, res) {
		try {
			const add_review = await sql`
			INSERT INTO reviews (title, body, positive_sentiment, author_id, movie_id) VALUES (${req.body.title}, ${req.body.body}, ${req.body.positive}, ${req.user.id}, ${req.params.movie_id});
		`;
			res.send('Review added.');
		} catch (e) {
			console.log(e);
			res.status(500).send('An error occurred.');
		}
	}
);

// Updates a review - uses req.params.id for review id, and req.body for updated data
router.patch('/reviews/:id', checkAuthenticated, async function (req, res) {
	let existing_review;
	try {
		existing_review = (
			await sql`
			SELECT * FROM reviews WHERE id = ${req.params.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_review) {
		res.status(400).send('Review not found.');
		return;
	}

	if (req.user.id !== existing_review.author_id) {
		res.status(403).send('You do not have permission to edit this review.');
		return;
	}

	try {
		update_review = await sql`
		UPDATE reviews SET title = ${req.body.title || existing_review.title}, body = ${
			req.body.body || existing_review.body
		}, positive_sentiment = ${
			req.body.positive || existing_review.positive_sentiment
		} WHERE reviews.id = ${req.params.id};
	`;
		res.send('Review updated.');
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Deletes a review - uses req.params.id for review id
router.delete('/reviews/:id', checkAuthenticated, async function (req, res) {
	let existing_review;
	try {
		existing_review = (
			await sql`
			SELECT * FROM reviews WHERE id = ${req.params.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_review) {
		res.status(400).send('Review not found.');
		return;
	}

	if (req.user.id !== existing_review.author_id) {
		res.status(403).send('You do not have permission to delete this review.');
		return;
	}

	try {
		const delete_review = await sql`
		DELETE FROM reviews WHERE id = ${req.params.id};
	`;
		res.send('Review deleted.');
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

module.exports = router;

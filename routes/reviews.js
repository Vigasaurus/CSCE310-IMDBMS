const express = require('express');
const router = express.Router();
const sql = require('../postgres');

// Retrieves all reviews for a movie - uses req.params.movie for movie id
router.get('/reviews/:movie', async function (req, res) {
	const movie_id = 2;

	const all_reviews = await sql`
		SELECT reviews.title, reviews.body, users.first_name, users.last_name, reviews.body, reviews.positive_sentiment FROM reviews INNER JOIN users ON reviews.author_id = users.id WHERE reviews.movie_id = ${movie_id};
	`;

	res.send({all_reviews});
});

// Adds a new review - uses req.body for all data input
router.post('/reviews', async function (req, res) {
	const add_review = await sql`
		INSERT INTO reviews (title, body, positive_sentiment) VALUES (req.body inputs);
	`;

	// Have to work on inserting the movie and author name

	res.send({add_review});
});

// Updates a review - uses req.params.id for review id, and req.body for updated data
router.patch('/reviews/:id', async function (req, res) {
	const review_id = 2;

	const update_review = await sql`
		UPDATE reviews SET (req.body inputs) WHERE reviews.id = ${review_id};
	`;
	res.send({update_review});
});

// Deletes a review - uses req.params.id for review id
router.delete('/reviews/:id', async function (req, res) {
	const review_id = 2;

	const delete_review = await sql`
		DELETE FROM reviews WHERE id = ${review_id};
	`;
	res.send({delete_review});
});

module.exports = router;

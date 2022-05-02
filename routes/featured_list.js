const express = require('express');
const postgres = require('postgres');
const router = express.Router();
const sql = require('../postgres');

// Gets current featured list - should check the date range using current datetime
router.get('/featured', async function (req, res) {
	//todo
	const today = new Date().getTime();
	const query = await sql`
		SELECT * FROM featured_movies
		WHERE ${today} 
	`;

	res.send({});
});

// Adds new item to featured list - use req.body for new data (Vig will handle admin-only authorization)
router.post('/featured', async function (req, res) {
	
	const query = await sql`
	INSERT INTO featured_movies(week, movie_id, creator_id, index)
	VALUES (${req.body.dateRange}::daterange, ${req.body.movieID}, ${req.body.creatorID}, ${req.body.index})
`
	res.send({query});
});

// Updates a featured list item - use req.params.id for item id, use req.body for updated index
router.patch('/featured/:id', async function (req, res) {
	const query = await sql`
		UPDATE featured_movies
		SET week = ${req.body.week}, movie_id = ${req.body.movieID}, creator_id = ${req.body.creatorID}, index = ${req.body.index}
		WHERE id = ${req.params.id}
	`;
	res.send({query});
});

// Delte a featured list item - use req.params.id for item id
router.delete('/featured/:id', async function (req, res) {
	const query = await sql`
		DELETE FROM featured_movies WHERE id = ${req.params.id}
	`;
	res.send({query});
});

module.exports = router;

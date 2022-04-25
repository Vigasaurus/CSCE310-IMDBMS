const express = require('express');
const router = express.Router();
const sql = require('../postgres');
// Feature Set by Jesica Jimenez

// // Returns the user object except the passwordhash
// router.get('/users/:id', async function (req, res) {
// 	// Example access URL-based parameters
// 	console.log(req.params.id);

// 	// Example access body-based parameters
// 	console.log(req.body);

// 	// Example query:
// 	const users = await sql`
// 		SELECT * FROM users where id = ${req.params.id};
// 	`;

// 	res.send({ users });
// });

// Returns all likes for currently logged in user (will update how to access that later, for now just hardcode)
router.get('/likes', async function (req, res) {
	// console.log(req.params.id);

	// console.log(req.body);

	// const users = await sql`
	// 	SELECT * FROM users where id = ${req.params.id};
	// `;
	// res.send({ users });

	// SELECT title FROM movies 
	// JOIN likes ON movies.id = likes.movies_id
	// WHERE likes.user_id =2 ;

	
	res.send({});
});

// Returns a specific like given the like id
router.get('/likes/:id', async function (req, res) {
	
// SELECT title FROM movies 
// JOIN likes ON movies.id = likes.movies_id
// WHERE likes.id = 1;
	res.send({});
});

// Adds a like for the given user - uses req.params.user for the user id, and req.body for the movie id
router.post('/likes/:user', async function (req, res) {
	
// INSERT INTO likes(user_id, movies_id, index_num)
// VALUES (2, 2, 1);

	res.send({});
});

// Updates a like given the like id - uses req.params.id for the like id, and req.body for updated index
router.patch('/likes/:id', async function (req, res) {
	
// UPDATE likes
// SET movies_id =4, index_num =1
// WHERE  id = 3 ;

// UPDATE likes
// SET id = (SELECT SUM(index_num) FROM likes) +1
// WHERE id = 3 ;
	
	res.send({});
});

// Deletes a like given the like id from req.params.id
router.delete('/likes/:id', async function (req, res) {
	// DELETE FROM likes WHERE id = 2;
	res.send({});
});

module.exports = router;

const express = require('express');
const router = express.Router();
const sql = require('../postgres');
const { checkNotAuthenticated, checkAuthenticated } = require('../middleware');
const passport = require('passport');
const bcrypt = require('bcrypt');

router.post(
	'/login',
	checkNotAuthenticated,
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash: true
	})
);

router.post('/signup', checkNotAuthenticated, async function (req, res) {
	if (
		[req.body.first_name, req.body.email, req.body.password].some(
			(value) => !value
		)
	) {
		req.flash('error', 'Missing required fields');
		res.redirect('/signup');
		return;
	}

	const hashedPassword = await bcrypt.hash(
		req.body.password,
		parseInt(process.env.SALT)
	);

	try {
		await sql`
				INSERT INTO users (first_name, last_name, email, password_hash, isadmin) VALUES (${
					req.body.first_name
				}, ${req.body.last_name || ''}, ${req.body.email}, ${hashedPassword}, false);
			`;
		req.flash('success', 'Account created successfully, login above.');
		res.redirect('/login');
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get('/logout', checkAuthenticated, (req, res) => {
	req.logOut();
	res.redirect('/');
});

// Returns the user object except the passwordhash
router.get('/users/:id', async function (req, res) {
	const users = await sql`
		SELECT first_name, last_name, email, isadmin, id FROM users where id = ${req.params.id};
	`;

	if (users.length) res.send({ users: users[0] });
	else res.status(404).send({ error: 'User not found' });
});

// Updates a user - uses req.body for data input and req.params.id for user id from url
router.patch('/users', checkAuthenticated, async function (req, res) {
	let existing_user;
	try {
		existing_user = (
			await sql`
			SELECT * FROM users WHERE id = ${req.user.id};
		`
		)[0];
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
		return;
	}

	if (!existing_user) {
		res.status(400).send('User does not exist.');
	}

	const hashedPassword = req.body.password
		? await bcrypt.hash(req.body.password, parseInt(process.env.SALT))
		: existing_user.password_hash;

	try {
		await sql`
		UPDATE users SET first_name = ${
			req.body.first_name || existing_user.first_name
		}, last_name = ${req.body.last_name || existing_user.last_name}, email = ${req.body.email || existing_user.email}, password_hash = ${hashedPassword} WHERE users.id = ${req.user.id};
	`;
	req.flash('success', 'Profile updated!');
	res.redirect(`/profile/${req.user.id}`);
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

// Deletes authenticated user
router.delete('/users', checkAuthenticated, async function (req, res) {
	try {
		await sql`
		DELETE from users WHERE users.id = ${req.user.id};
	`;
	req.flash('success', 'Account deleted!');
	req.logOut();
	res.redirect(`/login`);
	} catch (e) {
		console.log(e);
		res.status(500).send('An error occurred.');
	}
});

module.exports = router;

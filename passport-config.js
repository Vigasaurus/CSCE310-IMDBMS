const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const sql = require('./postgres');

function init(passport) {
	const authenticateUser = async (email, password, done) => {
		const userQuery = await sql`
			SELECT * FROM users where email = ${email};
		`;

		user = userQuery[0];

		if (user == null) {
			return done(null, false, {
				message: 'Authentication failed. Please check your credentials.',
			});
		}

		try {
			if (await bcrypt.compare(password, user.password_hash)) {
				return done(null, user);
			} else {
				return done(null, false, {
					message: 'Authentication failed. Please check your credentials.',
				});
			}
		} catch (err) {
			console.error(err);

			return done(e);
		}
	};

	passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser));
	passport.serializeUser((user, done) => done(null, user.id));

	passport.deserializeUser(async (id, done) => {
		try {
			const user = (
				await sql`
				SELECT * FROM users where id = ${id};
			`
			)[0];

			if (!user) {
				return done(new Error('Deserialization error.'));
			}

			done(null, user);
		} catch (e) {
			console.error(e);

			done(e);
		}
	});
}

module.exports = init;

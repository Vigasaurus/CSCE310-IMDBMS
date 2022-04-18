require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const sql = require('./postgres');
const cookie = require('express-session/session/cookie');

const baseRoutes = require('./routes');
const userRoutes = require('./routes/users');
const entryRoutes = require('./routes/entry_management');
const featuredRoutes = require('./routes/featured_list');
const followersRoutes = require('./routes/followers');
const likesRoutes = require('./routes/likes');
const moderationRoutes = require('./routes/moderation');
const reviewsRoutes = require('./routes/reviews');
const watchlistRoutes = require('./routes/watchlist');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'hunter2',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(baseRoutes);
app.use('/api', userRoutes);
app.use('/api', entryRoutes);
app.use('/api', featuredRoutes);
app.use('/api', followersRoutes);
app.use('/api', likesRoutes);
app.use('/api', moderationRoutes);
app.use('/api', reviewsRoutes);
app.use('/api', watchlistRoutes);

app.get('/*', function (req, res) {
	res.render('404');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
	console.log(`Server successfully started on port http://localhost:${PORT}`)
);

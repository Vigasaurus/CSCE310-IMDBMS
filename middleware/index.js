var mwObject = {};

mwObject.checkAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	}
};

mwObject.checkNotAuthenticated = function (req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/movies');
	}
};

module.exports = mwObject;

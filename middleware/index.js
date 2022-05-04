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
		res.redirect('/dashboard');
	}
};

mwObject.checkAdmin = function (req, res, next) {
	if (req.isAuthenticated() && req.user.isadmin) {
		return next();
	} else {
		res.redirect('/dashboard');
	}
};

module.exports = mwObject;

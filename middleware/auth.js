const errors_          = require('../utils/enums/errors');
const excludedAuthRoutes_ = require('../utils/enums/excludedAuthRoutes');

module.exports = async (req, res, next) => {
  try {
    const fullRequestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    excludedAuthRoutes_.forEach(route => {
        if (fullRequestUrl.endsWith(route) || fullRequestUrl.endsWith(route + "/")) {
            return next();
        }
    });

    const { authorization } = req.headers;

    if (!authorization) throw new Error(errors_.AUTH_MISSING_HEADER);

    const [authType, token] = authorization.trim().split(' ');
    if (authType !== 'Bearer') throw new Error(errors_.AUTH_INVALID_FORMAT);

    next();
  } catch (error) {
    next(errors_.AUTH_GENERIC_ERROR);
  }
}
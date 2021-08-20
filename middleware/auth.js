require('dotenv').config;
const jwt                 = require('jsonwebtoken');

const errors_             = require('../utils/enums/errors');
const httpStatusCodes_    = require('../utils/enums/httpStatusCodes');
const excludedAuthRoutes_ = require('../utils/enums/excludedAuthRoutes');

const jwtOptions = {
	expiresIn: process.env.JWT_EXPIRATION_TIME,
	algorithm: process.env.JWT_ALGORITHM
};

module.exports = async (req, res, next) => {
  try {
    const fullRequestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    excludedAuthRoutes_.forEach(route => {
        if (fullRequestUrl.endsWith(route) || fullRequestUrl.endsWith(route + "/")) {
            return next();
        }
    });

    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error(errors_.AUTH_MISSING_HEADER);
    }

    const [authType, token] = authorization.trim().split(' ');
    if (authType !== 'Bearer') {
      throw new Error(errors_.AUTH_INVALID_FORMAT);
    }

    if (authorization.substring(0, 7) === 'Bearer ') {
      authorization = authorization.slice(7);
    }

    req.token = jwt.verify(authorization, process.env.JWT_SECRET, jwtOptions);

    next();
  } catch (error) {
    return res.status(httpStatusCodes_.CODE_UNAUTHORIZED).json({
      code: httpStatusCodes_.CODE_UNAUTHORIZED,
      message: errors_.AUTH_INVALID_TOKEN
    });
  }
}
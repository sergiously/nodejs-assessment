require('dotenv').config();
const jwt                = require('jsonwebtoken');

const externalRepository = require('../external_services/service-repository');
const httpStatusCodes_   = require('../../utils/enums/httpStatusCodes');
const errors_            = require('../../utils/enums/errors');

const jwtOptions = {
	expiresIn: process.env.JWT_EXPIRATION_TIME,
	algorithm: process.env.JWT_ALGORITHM
};

exports.Login = async (req, res, next) => {
    try {
        const inputUsername = req.body.username;
        const inputPassword = req.body.password;

        if (typeof inputUsername !== "string" || typeof inputPassword !== "string") {
            return res.status(httpStatusCodes_.CODE_BAD_REQUEST).json({
                code: httpStatusCodes_.CODE_BAD_REQUEST,
                message: errors_.INVALID_FIELDS
            });
        }

        const clients = await externalRepository.GetClients();

        if ((inputUsername !== process.env.USERNAME || inputPassword !== process.env.PASSWORD) && (inputUsername !== process.env.ADMIN_USERNAME || inputPassword !== process.env.ADMIN_PASSWORD)) {
            return res.status(httpStatusCodes_.CODE_UNAUTHORIZED).json({
                code: httpStatusCodes_.CODE_UNAUTHORIZED,
                message: errors_.AUTH_INVALID_CREDENTIALS
            });
        }

        let userRole = '';
        switch (inputUsername) {
            case process.env.USERNAME:
                userRole = 'user';
                break;
            case process.env.ADMIN_USERNAME:
                userRole = 'admin';
                break;
            default:
                userRole = 'user';
        }

        req.body.role = userRole;
        const token = jwt.sign(req.body, process.env.JWT_SECRET, jwtOptions);

        return res.status(httpStatusCodes_.CODE_OK).json({
            token: token,
            type: "Bearer",
            expires_in: process.env.JWT_EXPIRATION_TIME
        });
    } catch (error) {
        return res.status(httpStatusCodes_.CODE_BAD_REQUEST).json({
            code: httpStatusCodes_.CODE_BAD_REQUEST, 
            message: error.message
        });
    }
}
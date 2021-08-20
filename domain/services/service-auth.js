const apis            = require('../../apis');
const httpStatusCodes_ = require('../../utils/enums/httpStatusCodes');
const errors_ = require('../../utils/enums/errors');

exports.Login = async (req, res, next) => {
    try {
        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(httpStatusCodes_.CODE_BAD_REQUEST).json({
                code: 0,
                message: errors_.INVALID_FIELDS
            });
        }

        const response = await apis.HerokuLogin(username, password);

        if (response.token && response.type === "Bearer") {
            return res.status(httpStatusCodes_.CODE_OK).json(response);
        }

        return res.status(httpStatusCodes_.CODE_UNAUTHORIZED).json({
            code: 0, 
            message: errors_.UNAUTHORIZED
        });
    } catch (error) {
        return res.status(httpStatusCodes_.CODE_BAD_REQUEST).json({
            code: 0, 
            message: error.message
        });
    }
}
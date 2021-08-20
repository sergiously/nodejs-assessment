require('dotenv').config();
const got              = require('got');
const cache            = require('memory-cache');

const httpStatusCodes_ = require('../../utils/enums/httpStatusCodes');
const logging          = require('../../utils/logging');

HerokuLogin = async () => {
    const response = await got.post(process.env.HEROKU_API_URL + "login", {
		json: {
			client_id: process.env.HEROKU_CLIENT_ID,
            client_secret: process.env.HEROKU_SECRET
		},
		responseType: "json"
	});

    if (response.body) {
        const body = response.body;
        if (body.token && body.type === "Bearer") {
            cache.put("repository_token", body.token);
            return body.token;
        } else if (response.body.statusCode === httpStatusCodes_.CODE_UNAUTHORIZED) {
            throw new Error("Invalid Heroku auth credentials");
        }
    }

    throw new Error("Heroku login service could not be reached");
}

exports.GetClients = async () => {
    if (!cache.get("repository_token")) {
        await HerokuLogin();
    }

    let response = await got(process.env.HEROKU_API_URL + "clients", {
		headers: {
            "Authorization": cache.get("repository_token")
        },
		responseType: "json"
	});

    if (response.statusCode === httpStatusCodes_.CODE_UNAUTHORIZED) {
        await HerokuLogin();
        response = await got(process.env.HEROKU_API_URL + "clients", {
            headers: {
                "Authorization": cache.get("repository_token")
            },
            responseType: "json"
        });
    }

    if (response.statusCode === httpStatusCodes_.CODE_UNAUTHORIZED) {
        throw new Error("Invalid Heroku auth credentials");
    } else if (response.statusCode === httpStatusCodes_.CODE_OK) {
        return response.body;
    }

    throw new Error("Heroku client service could not be reached");
}

exports.GetPolicies = async (bearerToken) => {
    if (!cache.get("repository_token")) {
        await HerokuLogin();
    }

    let response = await got(process.env.HEROKU_API_URL + "policies", {
		headers: {
            "Authorization": cache.get("repository_token")
        },
		responseType: "json"
	});

    if (response.statusCode === httpStatusCodes_.CODE_UNAUTHORIZED) {
        await HerokuLogin();
        response = await got(process.env.HEROKU_API_URL + "policies", {
            headers: {
                "Authorization": cache.get("repository_token")
            },
            responseType: "json"
        });
    }

    if (response.statusCode === httpStatusCodes_.CODE_UNAUTHORIZED) {
        throw new Error("Invalid Heroku auth credentials");
    } else if (response.statusCode === httpStatusCodes_.CODE_OK) {
        return response.body;
    }

    throw new Error("Heroku policy service could not be reached");
}
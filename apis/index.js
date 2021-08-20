require('dotenv').config();
const got = require('got');

exports.HerokuLogin = async (id, secret) => {
    const response = await got.post(process.env.HEROKU_API_URL + "login", {
		json: {
			client_id: id,
            client_secret: secret
		},
		responseType: 'json'
	});

    return response.body;
}

exports.GetClients = async (bearerToken) => {
    const response = await got(process.env.HEROKU_API_URL + "clients", {
		headers: {
            "Authorization": bearerToken
        },
		responseType: 'json'
	});

    return response.body;
}

exports.GetPolicies = async (bearerToken) => {
    const response = await got(process.env.HEROKU_API_URL + "policies", {
		headers: {
            "Authorization": bearerToken
        },
		responseType: 'json'
	});

    return response.body;
}
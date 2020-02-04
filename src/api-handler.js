const fetch = require('node-fetch');

/**
 * Quickcord's restful API manager
 */
class Api {

    constructor(api, type = 'restful') {
        this.api = api;
    }

    post(endpoint, data, callback) {
        fetch(`${this.api}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response;
        })
        .catch(console.error);
    }

    put(endpoint, data, callback) {
        fetch(`${this.api}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response;
        })
        .catch(console.error);
    }

    get(endpoint, callback) {
        fetch(`${this.api}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            callback(response);
        })
        .catch(console.error);
    }
}

module.exports = Api;
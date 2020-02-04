const fetch = require('node-fetch');

/**
 * Quickcord's restful API manager
 * 
 * TODO: Refactor all requests into a single method
 * 
 */
class Api {

    constructor(api, type = 'restful') {
        this.api = api;
    }

    // request(endpoint, data = null, callback, ...headers) {
    //     console.log(Function.caller)
    // }

    post(endpoint, data, callback, headers = {}) {
        fetch(`${this.api}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response;
        })
        .catch(console.error);
    }

    put(endpoint, data, callback, headers = {}) {
        fetch(`${this.api}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response;
        })
        .catch(console.error);
    }

    patch(endpoint, data, callback, headers = {}) {
        fetch(`${this.api}/${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response;
        })
        .catch(console.error);
    }

    delete(endpoint, data, callback, headers = {}) {
        fetch(`${this.api}/${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response;
        })
        .catch(console.error);
    }

    get(endpoint, callback, headers = {}) {

        console.log({
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });

        fetch(`${this.api}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        })
        .then(response => {
            callback(response);
        })
        .catch(console.error);
    }
}

module.exports = Api;
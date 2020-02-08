const fetch = require('node-fetch');
require('./exceptions');

/**
 * Quickcord's restful API manager
 * 
 * TODO: Refactor all requests into a single method
 * 
 */
class Api {

    constructor(api, type = 'restful') {
        this.api = api;

        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    // request(type) {

    //     if(typeof type !== 'string') throw new ParameterError('Request parameter must be of type: string');

    //     return (endpoint, data = null, callback, ...headers) => {
    //         fetch(`${this.api}/${endpoint}`, {
    //             method: type,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 ...headers
    //             }
    //             //body: JSON.stringify(data)
    //         })
    //         .then(response => {
    //             return response;
    //         })
    //         .catch(console.error);
    //     }
    // }

    post(endpoint, data, callback, headers = {}) {
        fetch(`${this.api}/${endpoint}`, {
            method: 'POST',
            headers: {
                ...this.headers,
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
                ...this.headers,
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
                ...this.headers,
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
                ...this.headers,
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
                ...this.headers,
                ...headers
            }
        });

        fetch(`${this.api}/${endpoint}`, {
            method: 'GET',
            headers: {
                ...this.headers,
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
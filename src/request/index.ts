import fetch from 'node-fetch';

class Api {

    baseEndpoint: string;

    constructor(mainEndpoint: string) {
        this.baseEndpoint = mainEndpoint;
    }

    get(endpoint: string, headers?: Record<string, string>) {
        return fetch(this._joinEndpoints(endpoint), {
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });
    }

    post(endpoint: string, body: {}, headers?: Record<string, string>) {
        return fetch(this._joinEndpoints(endpoint), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });
    }

    _joinEndpoints(endpoint: string) {
        return `${this.baseEndpoint}/${endpoint}`;
    }

}

export default Api;
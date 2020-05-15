import fetch from 'node-fetch';

class Api {

    baseEndpoint: string;

    constructor(mainEndpoint: string) {
        this.baseEndpoint = mainEndpoint;
    }

    get(endpoint: string) {
        return fetch(this._joinEndpoints(endpoint), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    _joinEndpoints(endpoint: string) {
        return `${this.baseEndpoint}/${endpoint}`;
    }

}

export default Api;
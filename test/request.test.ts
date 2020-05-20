import { Api } from '../src';
import { expect } from 'chai';

const api = new Api('https://google.com');

describe('request manager', () => {
    it('Response ok should equal true', async () => {
        const response = await api.get('/');

        expect(response.ok).to.be.true;
    });

    //it('')
});
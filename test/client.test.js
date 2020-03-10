require('dotenv').config();
const assert = require('chai').assert;
const quickcord = require('../index');

const client = new quickcord.Client(process.env.TOKEN, '.');

describe('Quickcord', () => {
    it('client status should equal 3', () => {
        assert.equal(client.status, 3);
    });

    it('client guilds should be an object', () => {
        assert.equal(typeof client.guilds, 'object');
    });

    it('uptime should be equal to null', () => {
        assert.equal(client.uptime, null);
    });

    it('token length should be greater than 5', () => {
        assert.isAbove(client.token.length, 5);
    });

    //it('')
});

console.log(client.status)
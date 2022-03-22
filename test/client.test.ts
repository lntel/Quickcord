import { Client } from '../src';
import { expect } from 'chai';
import dotenv from 'dotenv';

dotenv.config();

const client: Client = new Client(process.env.TOKEN!, '.', {
    intents: ['GUILDS']
});

describe('client', () => {
    it('Client user property should not be null', () => {
        client.on('ready', () => {
            expect(client.user).to.not.equals(null); 
        });
    });

    it('readyAt date should not be null', () => {
        client.on('ready', () => {
            expect(client.readyAt).not.equals(null); 
        });
    });

    it('channels property should be an object', () => {
        client.on('ready', () => {
            expect(client.channels).to.be.an('object');
        });
    });
});
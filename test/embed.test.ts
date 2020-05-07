import { RichEmbed } from '../src';
import { expect } from 'chai';

describe('RichEmbed', () => {
    it('when initialising with MessageEmbedOptions, footer should not be null', () => {
        const embed = new RichEmbed({
            footer: {
                text: "This is a unit test"
            }
        });

        expect(embed.footer).to.not.equal(null);
    });
});
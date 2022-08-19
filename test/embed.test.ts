import { RichEmbed, EmbedPaginator } from '../src';
import { expect } from 'chai';

describe('RichEmbed', () => {
    it('when initialising with MessageEmbedOptions, footer should not be null', () => {
        const embed = new RichEmbed({
            footer: {
                text: "This is a unit test"
            }
        });

        expect(embed.data.footer).to.not.equal(null);
    });
});

describe('EmbedPaginator', () => {
    it('Page property should only equal 1', () => {
        // const embed = new EmbedPaginator()
    });
});
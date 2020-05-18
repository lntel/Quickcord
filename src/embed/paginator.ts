import { ReactionCollector, Message, User, MessageReaction, TextChannel, MessageEmbed, MessageEmbedOptions, EmbedField } from 'discord.js';

interface Page {
    name: string,
    value: string,
    inline?: boolean
}

type Pages = Array<Array<Page>>;

class EmbedPaginator {

    collector: ReactionCollector | null = null;
    embedMessage: Message | null = null;
    page: number = 1;
    totalPages: number = 0;
    pages: Pages = [];

    constructor(channel: TextChannel, embedOptions: MessageEmbed | MessageEmbedOptions) {

        // ➡️ ⬅️

        const embed = new MessageEmbed(embedOptions);

        this.totalPages = Math.round(embedOptions.fields!.length / 25);

        let tmpArray: Array<Page> = [];

        console.log(embedOptions.fields!.length);

        (embedOptions.fields! as EmbedField[]).map((field: Page) => {
            if(tmpArray.length === 25) {
                this.pages.push(tmpArray);

                tmpArray = [];
            }

            tmpArray.push(field);
        });

        console.log(this.pages);

        channel.send(embed)
        .then(msg => {
            this.embedMessage = msg;

            msg.react('⬅️').then(r => {
                msg.react('➡️').then(() => {
                    this._initPaginator(); 
                });
            });

        });
    }

    _update() {
        //this.embedMessage!.edit();
    }

    _prevPage() {
        if(this.page !== 0) {
            // go back
        }
    }

    _nextPage() {
        console.log(this.totalPages)
        if(this.page + 1 < this.totalPages) {
            console.log("forward");
        }
    }

    _initPaginator() {
        const filter = (reaction: MessageReaction, user: User) => {
            return !user.bot && (reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️');
        };

        this.collector = this.embedMessage!.createReactionCollector(filter);

        this.collector.on('collect', this._identifyReaction.bind(this));
    }

    _identifyReaction(reaction: MessageReaction, user: User) {
        reaction.message.reactions.resolve(reaction)?.users.remove(user.id);

        if(reaction.emoji.name === '⬅️') {
            if(this.page !== 0) {
                this._prevPage();
            }
        } else if(reaction.emoji.name === '➡️') {
            if(this.page++ < this.totalPages) {
                this._nextPage();
            }
        }
    }
}

export default EmbedPaginator;
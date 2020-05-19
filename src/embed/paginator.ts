import { ReactionCollector, Message, User, MessageReaction, TextChannel, MessageEmbed, MessageEmbedOptions, EmbedField, DMChannel, NewsChannel } from 'discord.js';

type Pages = Array<Array<EmbedField>>;

class EmbedPaginator {

    collector: ReactionCollector | null = null;
    embedMessage: Message | null = null;
    embedOptions: MessageEmbedOptions | null = null;
    page: number = 1;
    totalPages: number = 0;
    pages: Pages = [];

    /**
     * Embed Paginator generates an embed and automatically
     * adds pages so that more content can be displayed within
     * your embed fields
     * @param channel The channel to which the embed will be sent
     * @param embedOptions Options to be used within your embed
     */
    constructor(channel: TextChannel | DMChannel | NewsChannel, embedOptions: MessageEmbedOptions) {

        // ➡️ ⬅️

        const embed = new MessageEmbed(embedOptions);

        if(!embedOptions.fields?.length || embedOptions.fields.length <= 25) {
            channel.send(embed);
        } else {

            this.totalPages = Math.round(embedOptions.fields!.length / 25);

            let tmpArray: Array<EmbedField> = [];

            this.embedOptions = embedOptions;

            (embedOptions.fields! as EmbedField[]).map((field: EmbedField, index: number) => {
                if(tmpArray.length === 25 || embedOptions.fields!.length - 1 === index) {
                    this.pages.push(tmpArray);
    
                    tmpArray = [];
                }
    
                tmpArray.push(field);
            });

            embed.setFooter(`Page ${this.page} of ${this.pages.length}`);
    
            //console.log(this.pages.length);
    
            channel.send(embed)
            .then(msg => {
                this.embedMessage = msg;
    
                msg.react('⬅️').then(() => {
                    msg.react('➡️').then(() => {
                        this._initPaginator(); 
                    });
                });
    
            });
        }
    }

    /**
     * Updates the embed content, footer is reserved here
     * TODO: Find and implement footer workaround (perhaps append with delimiter)
     */
    _update() {

        this.embedOptions!.fields = undefined;

        const embed = new MessageEmbed({
            ...this.embedOptions,
            fields: this.pages[this.page - 1],
            footer: {
                text: `Page ${this.page} of ${this.pages!.length}`
            }
        });

        this.embedMessage!.edit(embed);
    }

    /**
     * Shows the previous page
     */
    _prevPage() {
        if(this.page !== 1) {
            this.page--;

            this._update();
        }
    }

    /**
     * Shows the next page
     */
    _nextPage() {
        if(this.page + 1 <= this.totalPages) {
            this.page++;

            this._update();
        }
    }

    /**
     * Initiates the paginator and sets up all applicable reaction collectors
     */
    _initPaginator() {
        const filter = (reaction: MessageReaction, user: User) => {
            return !user.bot && (reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️');
        };

        this.collector = this.embedMessage!.createReactionCollector(filter);

        this.collector.on('collect', this._identifyReaction.bind(this));
    }

    /**
     * This identifies which reaction was triggered and checks whether it was a bot or not
     * Furthermore, it calls relevant methods to change pages
     * @param reaction The reaction which was triggered
     * @param user The user that triggered the reaction
     */
    _identifyReaction(reaction: MessageReaction, user: User) {
        reaction.message.reactions.resolve(reaction)?.users.remove(user.id);

        if(reaction.emoji.name === '⬅️') {
            this._prevPage();
        } else if(reaction.emoji.name === '➡️') {
            this._nextPage();
        }
    }
}

export default EmbedPaginator;
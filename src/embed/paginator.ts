import { ReactionCollector, Message, User, MessageReaction, TextChannel, MessageEmbed, MessageEmbedOptions, EmbedField, DMChannel, NewsChannel } from 'discord.js';

type Pages = Array<Array<EmbedField>>;

class EmbedPaginator {

    limit: number = 25;
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
    constructor(channel: TextChannel | DMChannel | NewsChannel, embedOptions: MessageEmbedOptions, pages?: Pages) {

        // ➡️ ⬅️

        const options: MessageEmbedOptions = (embedOptions as MessageEmbedOptions);

        const embed = new MessageEmbed(options);

        if(pages && pages.length) {
            this.pages = pages;

            console.log(this.pages)

            this.embedOptions = embedOptions;

            channel.send(embed)
            .then(msg => {
                this.embedMessage = msg;

                this._update();

                this.calculatePages();

                this._initPaginator();
            })
            .catch(console.error);
        } else {
            if(!options.fields?.length || options.fields.length <= this.limit) {
                channel.send(embed)
                .then(msg => {
                    this.embedMessage = msg;
                })
                .catch(err => {
                    console.error('EmbedPaginator could not be posted');
                    console.error(err);
                });
            } else {
    
                this.embedOptions = options;
    
                this.calculatePages();
    
                this._insertFields();
    
                if(embed.footer) {
                    embed.setFooter(`${embed.footer.text} - Page ${this.page} of ${this.pages.length}`);
                } else {
                    embed.setFooter(`Page ${this.page} of ${this.pages.length}`);
                }
        
                //console.log(this.pages.length);
        
                channel.send(embed)
                .then(msg => {
                    this.embedMessage = msg;
    
                    this._initPaginator();    
                })
                .catch(err => {
                    console.error('EmbedPaginator could not be posted');
                    console.error(err);
                });
            } 
        }
    }

    

    private calculatePages() {

        if(this.pages.length) {
            this.totalPages = this.pages.length;
        } else {
            this.totalPages = Math.round(this.embedOptions!.fields!.length / this.limit);
        }
    }

    private _insertFields() {
        let tmpArray: Array<EmbedField> = [];

        (this.embedOptions!.fields! as EmbedField[]).map((field: EmbedField, index: number) => {
            if (tmpArray.length === this.limit || this.embedOptions!.fields!.length - 1 === index) {
                this.pages.push(tmpArray);

                tmpArray = [];
            }

            tmpArray.push(field);
        });
    }

    /**
     * This method edits your embed, it will automatically adjust depending on many factors.
     * @param changedOptions The embed options you would like to overwrite your current embed with
     */
    edit(changedOptions: MessageEmbedOptions) {
        this.embedOptions = changedOptions;

        const embed = new MessageEmbed(changedOptions);

        // this.page = 1;
        if(this.pages.length < this.page) {
            this.page = this.pages.length;
        }

        if(changedOptions.fields) {

            this.pages = [];

            if(changedOptions.fields.length > this.limit) {
                this._insertFields();

                this.calculatePages();

                this._update();

                if(!this.collector) {
                    this._initPaginator();
                }
            } else {

                if(this.collector) {
                    this.collector.stop();
                    this.collector = null;

                    this.embedMessage?.reactions.removeAll();
                }

                this.embedMessage!.edit(embed);
            }
        }
    }

    /**
     * Updates the embed content, footer is reserved here
     */
    _update() {

        if(this.embedOptions?.fields){
            this.embedOptions.fields = undefined;
        }

        const embed = new MessageEmbed({
            ...this.embedOptions,
            fields: this.pages[this.page - 1],
            footer: {
                text: this.embedOptions?.footer ? `${this.embedOptions.footer.text} - Page ${this.page} of ${this.pages!.length}` : `Page ${this.page} of ${this.pages!.length}`
            }
        });

        this.embedMessage!.edit(embed)
        .catch(() => {
            this._dispose();

            console.log('EmbedPaginator was deleted therefore, cannot be updated');
        });
    }

    private _dispose() {
        if(this.collector) {
            this.collector.stop();
            this.collector = null;
        }

        if(this.embedMessage) {
            this.embedMessage.reactions.removeAll();
        }
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

        this.embedMessage!.react('⬅️').then(() => {
            this.embedMessage!.react('➡️');
        });

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
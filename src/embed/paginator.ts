import { ReactionCollector, Message, User, MessageReaction, TextChannel, EmbedBuilder, EmbedData, EmbedField, DMChannel, NewsChannel } from 'discord.js';

type Pages = Array<Array<EmbedField>>;

class EmbedPaginator {

    limit: number = 25;
    collector: ReactionCollector | null = null;
    embedMessage: Message | null = null;
    embedOptions: EmbedData | null = null;
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
    constructor(channel: TextChannel | DMChannel | NewsChannel, embedOptions: EmbedData, pages?: Pages) {

        // ➡️ ⬅️

        const options: EmbedData = (embedOptions as EmbedData);

        const embed = new EmbedBuilder(options);

        if(pages && pages.length) {
            this.pages = pages;

            this.embedOptions = embedOptions;

            channel.send({
                embeds: [embed]
            })
            .then(msg => {
                this.embedMessage = msg;

                this._update();

                this.calculatePages();

                this._initPaginator();
            })
            .catch(console.error);
        } else {
            if(!options.fields?.length || options.fields.length <= this.limit) {
                channel.send({
                    embeds: [embed]
                })
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
    
                if(embed.data.footer) {
                    embed.setFooter({
                        text: `${embed.data.footer?.text} - Page ${this.page} of ${this.pages.length}`
                    });
                } else {
                    embed.setFooter({
                        text: `Page ${this.page} of ${this.pages.length}`
                    });
                }
        
                //console.log(this.pages.length);
        
                channel.send({
                    embeds: [embed]
                })
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

    /**
     * Calculates the amount of total pages
     */
    private calculatePages() {

        if(this.pages.length) {
            this.totalPages = this.pages.length;
        } else {
            this.totalPages = Math.round(this.embedOptions!.fields!.length / this.limit);
        }
    }

    /**
     * Inserts the fields from the embed options property
     */
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
    edit(changedOptions: EmbedData) {
        this.embedOptions = changedOptions;

        const embed = new EmbedBuilder(changedOptions);

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

                this.embedMessage!.edit({
                    embeds: [embed]
                });
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

        const embed = new EmbedBuilder({
            ...this.embedOptions,
            fields: this.pages[this.page - 1],
            footer: {
                text: this.embedOptions?.footer ? `${this.embedOptions.footer.text} - Page ${this.page} of ${this.pages!.length}` : `Page ${this.page} of ${this.pages!.length}`
            }
        });

        this.embedMessage!.edit({
            embeds: [embed]
        })
        .catch(() => {
            this._dispose();

            console.error('EmbedPaginator was deleted therefore, cannot be updated');
        });
    }

    /**
     * Disposes of the instance if the message is deleted
     * TODO: Add event listener for this perhaps
     */
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

        this.collector = this.embedMessage!.createReactionCollector({
            filter
        });

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
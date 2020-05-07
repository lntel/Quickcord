// eslint-disable-next-line no-unused-vars
import { Client as DiscordClient, Message } from 'discord.js';

interface CommandCallback {
    (res: Message, args: any): void
}

interface CommandOptions {
    autoDelete?: Boolean
}

interface IDictionary<TValue> {
    [key: string]: TValue
}

class Client extends DiscordClient {

    prefix: string | string[];
    events: IDictionary<Array<CommandCallback>> = {};
    commandOptions?: CommandOptions;

    /**
     * Constructor
     * @param token Token to be used for the bot
     * @param prefix Prefix to be used may be array
     * @param options Options to be used by the bot
     */
    constructor(token: string, prefix: string | string[], options?: CommandOptions) {
        super();

        this.prefix = prefix;

        if(options) {
            this.commandOptions = options;
        }

        this.login(token)
        .then(() => {
            this._initListeners();
        })
        .catch(console.error);
    }
    
    /**
     * Initiates relevant event listeners
     */
    _initListeners() {
        this.on('message', this._processMessage);
    }

    /**
     * Processes messages to see if they are commands
     * @param message Message interface containing discord.js stuff
     */
    _processMessage(message: Message) {
        const { content } = message;

        const prefix = content.charAt(0);
        const args = content.slice(prefix.length).split(' ');
        const command = args.shift()!.toLowerCase();

        if(Array.isArray(this.prefix)) {
            if(this.prefix.indexOf(prefix) !== -1) {
                this.trigger(command, message, args);
            }
        } else if(this.prefix === prefix) {
            this.trigger(command, message, args);
        }
    }

    /**
     * Creates an event listener for each command
     * @param trigger Command to be emitted
     * @param cb Callback for command
     */
    command(trigger: string, cb: CommandCallback) {
        if(this.events[trigger]) {
            this.events[trigger].push(cb);
        } else {
            this.events[trigger] = [cb];
        }
    }

    /**
     * Emits events which trigger command callbacks
     * @param trigger Command that is emitted to the listener
     * @param rest Any additional information which will be returned in the callback
     */
    trigger(trigger: string, ...rest: any) {
        if(this.events[trigger]) {
            this.events[trigger].map(cb => {
                cb.apply(null, rest);
            })
        }
    }
}

export default Client;
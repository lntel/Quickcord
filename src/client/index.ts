// eslint-disable-next-line no-unused-vars
import { Client as DiscordClient, Message } from 'discord.js';
import path from 'path';
import fs from 'fs';

interface CommandCallback {
    (res: Message, args: any): void
}

interface CommandOptions {
    autoDelete?: Boolean,
    log?: Boolean,
    disabled?: Boolean,
    permittedRoles?: Array<Number>
}

interface CommandParameters {
    cb: Array<CommandCallback>,
    options?: CommandOptions
}

interface IDictionary<TValue> {
    [key: string]: TValue
}

class Client extends DiscordClient {

    prefix: string | string[];
    events: IDictionary<CommandParameters> = {};
    commandOptions?: CommandOptions;

    /**
     * Constructor
     * @param token Token to be used for the bot
     * @param prefix Prefix to be used may be array
     * @param options Options to be used by the bot
     */
    constructor(token: string, prefix: string | string[]) {
        super();

        this.prefix = prefix;

        this.login(token)
        .then(() => {
            this._initListeners();
        })
        .catch(this._handleError);
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
    command(trigger: string | string[], cb: CommandCallback, options?: CommandOptions) {
        if(Array.isArray(trigger)) {
            // TODO: allow trigger be an array
        } else {
            if(this.events[trigger]) {
                this.events[trigger].cb.push(cb);
    
                if(options) {
                    this.events[trigger].options = options;
                }
            } else {
                this.events[trigger] = Object.create({
                    cb: [cb]
                });
    
                if(options) {
                    this.events[trigger].options = options;
                }
            }
        }
    }

    /**
     * Emits events which trigger command callbacks
     * @param trigger Command that is emitted to the listener
     * @param rest Any additional information which will be returned in the callback
     */
    trigger(trigger: string, ...rest: any) {
        if(this.events[trigger]) {

            const message = rest[0];

            const options: CommandOptions | undefined = this.events[trigger].options;

            if(options) {

                if(options.disabled) {
                    return;
                }

                if(options.autoDelete) {
                    message.delete();
                }

                if(options.log) {
                    console.log({
                        command: trigger,
                        rest: rest
                    })
                }
            }

            this.events[trigger].cb.map(cb => {
                cb.apply(null, rest);
            })
        }
    }

    /**
     * Loads commands from a defined directory
     * @param directory The directory containing your commands
     * @param cb The callback triggered which contains all loaded commands
     */
    loadCommands(directory: string, cb: (commands: string[]) => void) {

        const commandDir: string = path.resolve(directory);
        
        console.log(commandDir)

        const files: string[] = fs.readdirSync(commandDir);

        files.map(file => {
            const callback = require(path.join(path.resolve(directory), file));

            const parts = file.split('.');

            if(parts[1] === 'js' || parts[1] === 'ts') {

                console.log(file)

                this.command(parts[0], callback);
            }
        });

        cb(files);
    }

    /**
     * Handles any unexpected errors
     * @param err Error containing stacktrace
     */
    _handleError(err: any) {
        console.error(err);
        this.destroy();
    }
}

export default Client;
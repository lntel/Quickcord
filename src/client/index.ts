// eslint-disable-next-line no-unused-vars
import { Client as DiscordClient, ClientOptions, Intents, Message, MessageReaction, PartialUser, User } from 'discord.js';

import path from 'path';
import fs from 'fs';
import { loadSync } from 'tsconfig'

import { CommandLoadException } from '../errors';
import { ReactionListener, reactionListeners } from '../utilities/reaction';

export interface CommandCallback {
    (res: Message, args: any): void
}

export interface LoadedCommand {
    default?: this | undefined
    aliases: Array<string> | string,
    cb: (res: Message, args: any) => void,
    options?: CommandOptions
}

export interface CommandOptions {
    autoDelete?: Boolean,
    log?: Boolean,
    disabled?: Boolean,
    permittedRoles?: Array<Number>
}

export interface CommandParameters {
    cb: Array<CommandCallback>,
    options?: CommandOptions
}

export interface IDictionary<TValue> {
    [key: string]: TValue
}

class Client extends DiscordClient {

    prefix: string | string[];
    events: IDictionary<CommandParameters> = {};
    commandOptions?: CommandOptions;
    allowedFileFormated: Array<string>;

    developmentDirectory: string | undefined;
    productionDirectory: string | undefined;

    /**
     * Constructor
     * @param token Token to be used for the bot
     * @param prefix Prefix to be used may be array
     * @param options Options to be used by the bot
     */
    constructor(token: string, prefix: string | string[], options?: ClientOptions) {
        super(options);

        this.prefix = prefix;
        this.allowedFileFormated = [
            "js",
            "ts"
        ];

        this.readEnvironment();

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
        this.on('messageReactionAdd', this._processReactionAdd);
    }

    async _processReactionAdd(reaction: MessageReaction, user: User | PartialUser) {

        if(reaction.me) return;

        const event: ReactionListener | undefined = (await import('../utilities/reaction')).reactionListeners.find(e => e.channelId === reaction.message.channel.id);

        const result = event?.events.find(e => `${e.emoji}` === `${reaction.emoji}`);

        const callback = result?.cb;

        if(callback) {
            callback(user, result!.text);
        }

        await reaction.users.remove(user.id);

        //const callback = events.find(e => e.)
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
            trigger.map(command => {
                if(this.events[command]) {
                    this.events[command].cb.push(cb);

                    if(options) {
                        this.events[command].options = options;
                    }
                } else {
                    this.events[command] = Object.create({
                        cb: [cb]
                    });
        
                    if(options) {
                        this.events[command].options = options;
                    }
                }
            });
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

    async readEnvironment() {
        if(fs.existsSync('./tsconfig.json')) {
            const data = loadSync(fs.readFileSync('./tsconfig.json', 'utf8'));

            const { rootDir, outDir } = data.config.compilerOptions;

            this.developmentDirectory = path.resolve(rootDir);
            this.productionDirectory = path.resolve(outDir);
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

        let commandDir: string
        // @ts-ignore
        if (process[Symbol.for("ts-node.register.instance")]) {
            commandDir = path.resolve(`${this.developmentDirectory}/${directory}`);
        } else {
            if(!this.productionDirectory) {
                commandDir = path.resolve(directory);
            } else {
                commandDir = path.resolve(`${this.productionDirectory}/${directory}`);
            }
        }

        console.log(commandDir)

        // This posed an issue with ./src directory (./src/ workaround)

        if(!fs.existsSync(commandDir)) {
            throw new CommandLoadException(`The directory ${commandDir} does not exist or is not resolvable`);
        }

        let files: string[] = fs.readdirSync(commandDir);

        files = files.filter(file => this.allowedFileFormated.indexOf(file.split('.')[1]) !== -1);

        if(!files.length) console.warn('The \'loadCommands\' method expects the target directory to contain \'.ts\' or \'.js\' files.');

        console.log("dev")

        files.map(async file => {
            const content: LoadedCommand = await import(path.join(path.resolve(commandDir), file));

            let workingContent;
            
            if(content.default) {
                workingContent = content.default;
            } else {
                workingContent = content;
            }

            this.command(workingContent.aliases, workingContent.cb, workingContent.options);
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
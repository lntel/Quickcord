// eslint-disable-next-line no-unused-vars
import { Client as DiscordClient, ClientOptions, Interaction, Message, MessageReaction, PartialMessageReaction, PartialUser, User, CommandInteraction, ChannelType, CacheType } from 'discord.js';

import path from 'path';
import fs from 'fs';
import { loadSync } from 'tsconfig'

import { CommandLoadException } from '../errors';
import { ReactionListener, reactionListeners } from '../utilities/reaction';
import { processingUsersInput } from '../utilities/question';
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9';
import { SlashCommandDefinition } from '../types';

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
    autoDelete?: Boolean;
    log?: Boolean;
    disabled?: Boolean;
    dm?: Boolean;
    permittedRoles?: Array<Number>;
}

export interface CommandParameters {
    cb: Array<CommandCallback>,
    options?: CommandOptions
}

export interface IDictionary<TValue> {
    [key: string]: TValue
}

class Client extends DiscordClient {

    token: string;
    prefix: string | string[];
    events: IDictionary<CommandParameters> = {};
    commandOptions?: CommandOptions;
    slashCommands?: SlashCommandDefinition[];
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

        super(options || ({} as ClientOptions));

        this.token = token;

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
        this.on('messageCreate', this._processMessage);
        this.on('interactionCreate', this._processInteractionCreation);
        this.on('messageReactionAdd', this._processReactionAdd);
    }

    async _processInteractionCreation(interaction: Interaction<CacheType>) {
        if(!interaction.isCommand()) return;

        const command = this.slashCommands?.find(cmd => cmd.name === interaction.commandName);

        if(!command) return;

        command.cb(interaction);
    }

    async _processReactionAdd(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {

        if(reaction.me) return;

        const event: ReactionListener | undefined = (await import('../utilities/reaction')).reactionListeners.find(e => e.channelId === reaction.message.channel.id);

        if(!event) return;

        const result = event.events.find(e => `${e.emoji}` === `${reaction.emoji}`);

        const callback = result?.cb;

        if(callback) {
            callback(user, result!.text);
        }

        // if(reaction.message.author.id === this.user?.id && reaction.message.channel.type !== 'dm') {
        //     await reaction.users.remove(user.id);
        // }


        //const callback = events.find(e => e.)
    }

    /**
     * Processes messages to see if they are commands
     * @param message Message interface containing discord.js stuff
     */
    _processMessage(message: Message): void {
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
    command(trigger: string | string[], cb: CommandCallback, options?: CommandOptions): void {
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

    async readEnvironment(): Promise<void> {
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
    trigger(trigger: string, ...rest: any): void {
        if(this.events[trigger]) {

            const message: Message = rest[0];

            const options: CommandOptions | undefined = this.events[trigger].options;

            if(options) {

                if(options.disabled || (!options.dm && message.channel.type === ChannelType.DM) || processingUsersInput.indexOf(message.author.id) !== -1) {
                    return;
                }

                if(options.autoDelete) {

                    if(message.deletable) message.delete();
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

    loadSlashCommands(commands: SlashCommandDefinition[], appId: string, guildId: string) {
        return new Promise(async (resolve, reject) => {
            
            try {
                this.slashCommands = commands;

                const restCommands = [...commands.map(cmd => {
                    return {
                        name: cmd.name,
                        description: cmd.description
                    }
                })]

                const rest = new REST({
                    version: '9'
                })
                .setToken(this.token);

                await rest.put(Routes.applicationGuildCommands(appId, guildId), {
                    body: restCommands
                });

                resolve(true);
                
            } catch (error) {
                reject(error);
            }
    
        });
    }

    /**
     * Loads commands from a defined directory
     * @param directory The directory containing your commands
     * @param cb The callback triggered which contains all loaded commands
     */
    loadCommands(directory: string) {

        return new Promise((resolve, reject) => {
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
    
            // This posed an issue with ./src directory (./src/ workaround)
    
            if(!fs.existsSync(commandDir)) {
                reject(`The directory ${commandDir} does not exist or is not resolvable`)
            }
    
            let files: string[] = fs.readdirSync(commandDir);
    
            files = files.filter(file => this.allowedFileFormated.indexOf(file.split('.')[1]) !== -1);
    
            if(!files.length) console.warn('The \'loadCommands\' method expects the target directory to contain \'.ts\' or \'.js\' files.');
    
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
    
            resolve(true);

        });

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
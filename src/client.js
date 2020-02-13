const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');

/**
 * 
 * Client class instantiates Discord.js and
 * provides a token as well as parameter/s.
 * 
 * @extends Discord.Client
 * 
 */
class Client extends Discord.Client {
    
    /**
     * Calls parent constructor, instantiates Discord.Client class
     * and sets up required properties
     * 
     * @param {string} token Discord bot token
     * @param {string|array} prefix Command prefix/s
     */
    constructor(token, prefix = '!') {
        super();

        this.events = {};
        this._instances = {};
        this.prefix = prefix;

        this.login(token)
        .then(loginResult => {
            this.trigger('loaded', loginResult);
        })
        .catch(console.error);

        this.on('message', this._messageEvent);
    }

    /**
     * Creates a command listener
     * 
     * @param {string} eventName Event name
     * @param {function} callback Callback function
     */
    command(eventName, callback) {
        if(this.events[eventName]) {
            this.events[eventName].push(callback);
        } else {
            this.events[eventName] = [callback];
        }
    }

    /**
     * Triggers the events, like .emit
     * 
     * @param {string} eventName Event name
     * @param  {...any} rest Additional arguments
     */
    trigger(eventName, ...rest) {
        if(this.events[eventName]) {
            this.events[eventName].map(cb => {
                cb.apply(null, rest);
            });
        }
    }

    /**
     * 
     * 
     * @param {Message} response Discord.js message response
     */
    _messageEvent(response) {

        if(response.author.bot) return;

        const { content, member } = response;

        let prefixResult;

        if(typeof this.prefix === 'object') {
            prefixResult = this.prefix.find(prefix => prefix == content.charAt(0));

            if(prefixResult === undefined) return;
        } else {
            if(content.charAt(0) !== this.prefix) return;

            prefixResult = this.prefix;
        }

        const args = content.slice(prefixResult.length).split(' ');
        const command = args.shift().toLowerCase();

        if(this._instances[command]) {
            const instance = this._instances[command][0];

            // Enable command logging
            if(instance.logging !== undefined && instance.logging) {
                console.log(new Date().toUTCString())
                console.log(`User: ${response.member.user.tag}`);
                console.log(`Command: ${command}`);
                console.log(`Args: ${args}\r\n`);
            }

            // Check if user has a specific role
            if(instance.permittedRoles !== undefined && instance.permittedRoles.length !== 0) {
                let permitted = false;

                instance.permittedRoles.map(id => {
                    const result = member.roles.find(role => role.id === id);

                    if(result !== null) {
                        permitted = true;
                        return;
                    }
                });

                if(!permitted) return response.reply('You are not permitted to use this command');
            } 

            // Automatically delete command
            if(instance.deleteCommand !== undefined && instance.deleteCommand) {
                response.delete();
            }
        }

        this.trigger(command, response, args);
    }

    /**
     * 
     * @param {string} directory This is the directory containing all commands
     */
    loadCommands(directory, callback = () => {}) {
        const files = fs.readdirSync(path.resolve(directory));
        const appropriateFiles = files.filter(file => file.split('.')[1] == 'js');

        appropriateFiles.map(file => {
            const instance = require(path.join(path.resolve(directory), file));

            if(typeof instance.callback !== 'function' || instance.callback === undefined)
                return console.error(`${file} does not contain a callback`);

            if(instance.aliases === undefined || instance.disabled) return;

            if(typeof instance.aliases === 'object') {
                instance.aliases.map(alias => {
                    if(this._instances[alias]) {
                        this._instances[alias].push(instance);
                    } else {
                        this._instances[alias] = [instance];
                    }

                    this.command(alias, instance.callback);
                });
            } else {
                if(this._instances[instance.aliases]) {
                    this._instances[instance.aliases].push(instance);
                } else {
                    this._instances[instance.aliases] = [instance];
                }

                this.command(instance.aliases, instance.callback);
            }
        });

        callback(appropriateFiles);
    }

}

module.exports = Client;
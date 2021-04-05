import { randomBytes } from "crypto";
import { EmojiResolvable, Message, MessageEmbed, MessageEmbedOptions, TextChannel, EmbedFieldData } from "discord.js";
import { RichEmbed } from "..";

const generateId = () => {
    return randomBytes(10).toString('hex');
}

export interface ReactionEvent {
    emoji: EmojiResolvable;
    text: string;
    cb: () => void;
}

export interface ReactionListener {
    channelId: string;
    events: ReactionEvent[];
}

export const reactionListeners: ReactionListener[] = [];

export default async (channel: TextChannel, title: string, events: ReactionEvent[]) => {

    try {
        const messages = await channel.messages.fetch();

        const embedFilter = (message: Message) => Boolean(message.embeds.length) && Boolean(message.embeds[0].footer) && message.embeds[0].footer!.text?.indexOf('Quickcord') !== -1;
        
        let embeds = messages.filter(embedFilter);

        if(!embeds.size) {
            const embed = new RichEmbed({
                title,
                fields: [...events.map(e => {
                    return {
                        name: e.text,
                        value: e.emoji,
                        inline: true
                    }
                })],
                footer: {
                    text: `Quickcord #${generateId()}`
                }
            });

            const embedMessage = await channel.send(embed);

            events.map(e => embedMessage.react(e.emoji));
        }

        reactionListeners.push({
            channelId: channel.id,
            events
        });

    } catch (error) {
        console.error(error)
    }

    
    // channel.messages.cache.map(message => {
    //     console.log(message.embeds)
    // })

    return;

    const embed = new RichEmbed({
        title: 'test',
        description: 'Some test',
        footer: {
            text: `Quickcord #${generateId()}`
        }
    });

    console.log(await channel.send(embed))
}
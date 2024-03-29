import { randomBytes } from "crypto";
import { Message, TextChannel, PartialUser, User, EmojiIdentifierResolvable, EmbedData } from "discord.js";
import { RichEmbed } from "..";

const generateId = () => {
    return randomBytes(10).toString('hex');
}

export interface ReactionEvent {
    emoji: EmojiIdentifierResolvable;
    text: string;
    cb: (user: User | PartialUser, option: string) => void;
}

export interface ReactionListener {
    channelId: string;
    events: ReactionEvent[];
}

export const reactionListeners: ReactionListener[] = [];

export default async (channel: TextChannel, title: string, events: ReactionEvent[], options?: EmbedData) => {

    try {
        const messages = await channel.messages.fetch();

        const embedFilter = (message: Message) => Boolean(message.embeds.length) && Boolean(message.embeds[0].footer) && message.embeds[0].footer!.text?.indexOf('Quickcord') !== -1;
        
        let embedId;

        let embeds = messages.filter(embedFilter);

        if(!embeds.size) {

            embedId = generateId();

            const embed = new RichEmbed({
                title,
                ...options,
                fields: [...events.map(e => {
                    return {
                        name: e.text,
                        value: e.emoji.toString(),
                        inline: true
                    }
                })],
                footer: {
                    text: `Quickcord #${embedId}`
                }
            });

            const embedMessage = await channel.send({
                embeds: [embed]
            });

            events.map(e => embedMessage.react(`${e.emoji}`).catch(() => console.error("Error")));
        }

        reactionListeners.push({
            channelId: channel.id,
            events
        });

        return embedId;

    } catch (error) {
        console.error(error)
    }

    
    // channel.messages.cache.map(message => {
    //     console.log(message.embeds)
    // })

    return;
}
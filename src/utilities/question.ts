import { Message, DMChannel, TextChannel, NewsChannel } from 'discord.js'

let i = 0;

/**
 * Good although, single message parameter (string literal) isn't compatible
 */

export default async (message: string | string[], res: Message, channel: TextChannel | DMChannel | NewsChannel, deleteAfter: boolean = true): Promise<string | string[]> => {
    let filter = (m: Message) => m.author.id === res.author.id;
    let questionMessage: Message;

    const collector = channel.createMessageCollector(filter, { time: 1000 * 60 });

    return new Promise(async (resolve, reject) => {

        const answers: string[] = [];

        questionMessage = await channel.send(message[i]);

        collector.on('collect', async (m: Message) => {

            if(!Array.isArray(message)) {
                resolve(m.content)
            } else {

                i += 1;

                answers.push(m.content);

                try {
                    if(m.deletable) {
                        m.delete();
                    }
                } catch (error) {
                    
                }

                if(i <= message.length - 1) {
                    try {
                        questionMessage.edit(message[i]);
                    } catch (error) {
                        
                    }
                }

                if(i > message.length - 1) {

                    try {
                        questionMessage.delete();
                    } catch (error) {
                        
                    }

                    collector.stop();
                    i = 0;

                    resolve(answers);
                }
            }
        });

        collector.on('end', () => {

        })
    });


}
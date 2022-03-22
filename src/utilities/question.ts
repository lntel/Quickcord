import { Message, DMChannel, TextChannel, NewsChannel, User, TextBasedChannel } from 'discord.js'

export const processingUsersInput: string[] = [];

let i = 0;

/**
 * Good although, single message parameter (string literal) isn't compatible
 */

export default async (
  message: string | string[],
  res: Message,
  channel: TextBasedChannel,
  deleteAfter: boolean = true
): Promise<string | string[]> => {
  let filter = (m: Message) => m.author.id === res.author.id;
  let questionMessage: Message;

  const collector = channel.createMessageCollector({
    filter,
    time: 1000 * 60,
  });

  return new Promise(async (resolve, reject) => {
    const answers: string[] = [];

    try {
      questionMessage = await channel.send(message[i]);

      // Push user id to array to ignore commands
      processingUsersInput.push(res.author.id);
    } catch (error) {
      reject("This user can not recieve DM's");
    }

    collector.on("collect", async (m: Message) => {
      if (!Array.isArray(message)) {
        resolve(m.content);
      } else {
        i += 1;

        answers.push(m.content);

        try {
          if (m.deletable) {
            m.delete();
          }
        } catch (error) {}

        if (i <= message.length - 1) {
          try {
            questionMessage.edit(message[i]);
          } catch (error) {}
        }

        if (i > message.length - 1) {
          try {
            questionMessage.delete();
          } catch (error) {}

          const userIndex = processingUsersInput.indexOf(res.author.id);

          if (userIndex == -1) return;

          processingUsersInput.splice(userIndex, 1);

          collector.stop();
          i = 0;

          resolve(answers);
        }
      }
    });

    collector.on("end", () => {
      const userIndex = processingUsersInput.indexOf(res.author.id);

      if (userIndex == -1) return;

      processingUsersInput.splice(userIndex, 1);
    });
  });
};
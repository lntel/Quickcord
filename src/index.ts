import { EmbedBuilder as RichEmbed } from 'discord.js';
import Client, { CommandCallback, CommandOptions, CommandParameters, LoadedCommand } from './client';
import Question from './utilities/question'
import ReactionHandler from './utilities/reaction'
import EmbedPaginator from './embed/paginator';
import { SlashCommandDefinition } from './types'

export {
    Client,
    RichEmbed,
    EmbedPaginator,
    CommandCallback,
    CommandOptions,
    CommandParameters,
    LoadedCommand,
    SlashCommandDefinition,
    Question,
    ReactionHandler
};
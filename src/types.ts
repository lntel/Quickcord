import { Interaction, ApplicationCommandOption, ApplicationCommandOptionType, SlashCommandBuilder, CacheType } from "discord.js";

export interface SlashCommandDefinition {
    type?: ApplicationCommandOptionType;
    name: string;
    description: string;
    required?: boolean;
    options?: ApplicationCommandOption[];
    cb: (interaction: Interaction) => void;
}
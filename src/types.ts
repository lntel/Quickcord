import { Interaction, ApplicationCommandOptionChoiceData, ApplicationCommandOption, ApplicationCommandOptionType } from "discord.js";

export interface SlashCommandDefinition {
    type?: ApplicationCommandOptionType;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOptionChoiceData[];
    options?: ApplicationCommandOption[];
    cb: (interaction: Interaction) => void;
}
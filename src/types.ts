<<<<<<< Updated upstream
import { Interaction, ApplicationCommandOptionChoiceData, ApplicationCommandOption, ApplicationCommandOptionType } from "discord.js";
=======
import { Interaction, ApplicationCommandChoicesData, ApplicationCommandOption, ApplicationCommandOptionType, SlashCommandBuilder } from "discord.js";
>>>>>>> Stashed changes

export interface SlashCommandDefinition {
    type?: ApplicationCommandOptionType;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOptionChoiceData[];
    options?: ApplicationCommandOption[];
    cb: (interaction: Interaction) => void;
}
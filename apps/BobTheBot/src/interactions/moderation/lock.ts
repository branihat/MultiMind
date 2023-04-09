import { PermissionFlagsBits, ChannelType, type ChatInputCommandInteraction } from "discord.js";
import { permissionToString, type ChatInputCommand } from "../../utils/index.js";

export const RequiredPerms = {
  bot: [PermissionFlagsBits.ManageChannels],
  user: [PermissionFlagsBits.ManageChannels],
} as const;

export const LockCommand: ChatInputCommand = {
  name: "lock",
  description: "Locks the current channel",
  default_member_permissions: permissionToString(RequiredPerms.user),
  dm_permission: false,
} as const;

export async function execute(interaction: ChatInputCommandInteraction<"cached">) {
  if (!interaction.channel?.isTextBased() || interaction.channel.type !== ChannelType.GuildText)
    return interaction.reply({ content: "Something went wrong", ephemeral: true });

  const modRole = interaction.guild.roles.cache.find((role) =>
    ["moderator", "mod", "Moderator", "Mod"].includes(role.name)
  );
  const helperRole = interaction.guild.roles.cache.find((role) => ["helper", "Helper"].includes(role.name));

  await interaction.channel.permissionOverwrites
    .edit(interaction.guild.id, {
      SendMessages: false,
    })
    .catch(async () => {
      return interaction.reply({
        content: `❌ Something went wrong while locking the channel`,
        ephemeral: true,
      });
    });

  if (modRole) {
    await interaction.channel.permissionOverwrites.edit(modRole, {
      SendMessages: true,
    });
  }

  if (helperRole) {
    await interaction.channel.permissionOverwrites.edit(helperRole, {
      SendMessages: true,
    });
  }

  return interaction.reply({
    content: `:lock: Channel locked!`,
    ephemeral: true,
  });
}

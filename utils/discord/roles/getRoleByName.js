export default function getRoleByName(interaction, name) {
    //
    const { member } = interaction;
    return member.guild.roles.cache.find((role) => role.name == name);
}

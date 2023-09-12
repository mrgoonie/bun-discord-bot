export default function getRoleById(interaction, id) {
    //
    const { member } = interaction;
    return member.guild.roles.cache.find((role) => role.id == id);
}

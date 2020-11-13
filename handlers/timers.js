const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { bannedRoleID, mutedRoleID, logChannelID } = require('../config.json');

const actions = {
  muted: mutedRoleID,
  banned: bannedRoleID,
};

module.exports = {
  startTimer({ id, action, date, duration, exec, old }, idx, guild, timers) {
    setTimeout(() => {
      console.log(1);
      guild.members
        .fetch(id)
        .then((member) => {
          if (!member.roles.cache.has(actions[action])) return;
          member.roles.set(old);
          guild.channels.cache
            .get(logChannelID)
            .send(
              new MessageEmbed()
                .setAuthor(member.user.username, member.user.displayAvatarURL())
                .setColor('GREEN')
                .setTitle(`${member.user.tag} was un${action}`)
                .setFooter(`Originally ${action} by ${exec} for ${duration}`)
            );
        })
        .catch((e) => console.log('err', e));
      fs.writeFileSync(
        './data/timers.json',
        JSON.stringify(
          timers.filter((_, index) => index !== idx),
          '',
          2
        )
      );
    }, date - Date.now());
  },
  init(client) {
    const guild = client.guilds.cache.first();
    const timers = JSON.parse(fs.readFileSync(`./data/timers.json`));
    timers.forEach((entry, idx) => this.startTimer(entry, idx, guild, timers));
  },
};

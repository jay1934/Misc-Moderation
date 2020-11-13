const ms = require('ms');

module.exports = {
  match: 'start(-?giveaway)?',
  execute(client, message, [channel, duration, winners, ...prize]) {
    const err = (error) =>
      message.channel.send(error).then((msg) => msg.delete({ timeout: 4000 }));

    if (!/^<#\d{17,18}>$/.test(channel))
      return err(
        ':x: You have to mention a channel for the giveaway to start in!'
      );

    if (!duration || Number.isNaN(ms(duration)))
      return err(':x: You have to specify a valid duration!');

    if (!winners || Number.isNaN(winners) || +winners <= 0)
      return err(':x: You have to specify a valid number of winners!');

    if (!prize.length) return err(':x: You have to specify a valid prize!');

    client.giveawaysManager.start(message.mentions.channels.first(), {
      time: ms(duration),
      prize: prize.join(' '),
      winnerCount: winners,
      messages: {
        giveaway: '\n\n🎉🎉 **GIVEAWAY** 🎉🎉',
        giveawayEnded: '\n\n🎉🎉 **GIVEAWAY ENDED** 🎉🎉',
        timeRemaining: 'Time remaining: **{duration}**!',
        inviteToParticipate: 'React with 🎉 to participate!',
        winMessage: 'Congratulations, {winners}! You won **{prize}**!',
        noWinner: 'Giveaway cancelled, no valid participations.',
        hostedBy: 'Hosted by: {user}',
        winners: 'winner(s)',
        endedAt: 'Ended at',
        units: {
          seconds: 'seconds',
          minutes: 'minutes',
          hours: 'hours',
          days: 'days',
          pluralS: false, // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
        },
        embedFooter: `Ends at ${require('moment')(
          new Date(ms(duration) + Date.now())
        ).format('MM/DD/YYYY h:mma')}`,
      },
    });

    message.delete();
    message.channel
      .send(`Giveaway started in ${message.mentions.channels.first()}!`)
      .then((msg) => msg.delete({ timeout: 7000 }));
  },
};

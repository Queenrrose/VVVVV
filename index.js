const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 2000;

// قائمة بالتوكنات والقنوات والسيرفرات لكل حساب
const accounts = [
  { 
    token: process.env.TOKEN1, 
    channelId: process.env.CHANNEL1,
    guildId: process.env.GUILD1  // يمكنك إضافة المزيد من الإعدادات حسب الحاجة
  },
  { 
    token: process.env.TOKEN2, 
    channelId: process.env.CHANNEL2,
    guildId: process.env.GUILD2
  },
    { 
    token: process.env.TOKEN3, 
    channelId: process.env.CHANNEL3,
    guildId: process.env.GUILD3  // يمكنك إضافة المزيد من الإعدادات حسب الحاجة
  },
  { 
    token: process.env.TOKEN4, 
    channelId: process.env.CHANNEL4,
    guildId: process.env.GUILD4
  },
    { 
    token: process.env.TOKEN1, 
    channelId: process.env.CHANNEL1,
    guildId: process.env.GUILD1  // يمكنك إضافة المزيد من الإعدادات حسب الحاجة
  },
  { 
    token: process.env.TOKEN5, 
    channelId: process.env.CHANNEL5,
    guildId: process.env.GUILD5
  },
    { 
    token: process.env.TOKEN6, 
    channelId: process.env.CHANNEL6,
    guildId: process.env.GUILD6  // يمكنك إضافة المزيد من الإعدادات حسب الحاجة
  },
  { 
    token: process.env.TOKEN8, 
    channelId: process.env.CHANNEL8,
    guildId: process.env.GUILD8
  },
    { 
    token: process.env.TOKEN9, 
    channelId: process.env.CHANNEL9,
    guildId: process.env.GUILD9  // يمكنك إضافة المزيد من الإعدادات حسب الحاجة
  },
  { 
    token: process.env.TOKEN7, 
    channelId: process.env.CHANNEL7,
    guildId: process.env.GUILD7
  },
    { 
    token: process.env.TOKEN10, 
    channelId: process.env.CHANNEL10,
    guildId: process.env.GUILD10  // يمكنك إضافة المزيد من الإعدادات حسب الحاجة
  },
  { 
    token: process.env.TOKEN2, 
    channelId: process.env.CHANNEL2,
    guildId: process.env.GUILD2
  },
    { 
    token: process.env.TOKEN11, 
    channelId: process.env.CHANNEL11,
    guildId: process.env.GUILD11  // يمكنك إضافة المزيد من الإعدادات حسب الحاجة
  },
  { 
    token: process.env.TOKEN12, 
    channelId: process.env.CHANNEL12,
    guildId: process.env.GUILD12
  },
  
  // يمكنك إضافة المزيد من الحسابات حسب عدد الحسابات التي ترغب في تشغيلها
];

// قائمة للعملاء
const clients = [];

// قائمة بالنصوص التي سيتم تغييرها
const statuses = [
  'Game 1 - 🌟🌟🌟 1',
  'Game 2 - Description 2',
  'Game 3 - Description 3',
  // يمكنك إضافة المزيد من النصوص هنا حسب رغبتك
];
let currentStatusIndex = 0;

// إنشاء وتسجيل العملاء والانضمام للغرف الصوتية
accounts.forEach(account => {
  const client = new Client({
  //  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
  });
  const { token, channelId, guildId } = account;

  client.login(token)
    .then(() => {
      clients.push(client);
      console.log(`Logged in as ${client.user.tag}`);
    })
    .catch(err => {
      console.error(`Failed to login as ${token}:`, err);
    });

  client.on('ready', async () => {
    console.log(`${client.user.tag} is ready!`);

    // الحصول على السيرفر الذي يحتوي على الروم الصوتي
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      console.error(`Unable to find guild ${guildId} for client ${client.user.tag}`);
      return;
    }

    // انضمام للغرفة الصوتية
    const VoiceConnection = joinVoiceChannel({
      channelId: channelId,
      guildId: guild.id,
      selfMute: false,
      selfDeaf: false,
      adapterCreator: guild.voiceAdapterCreator
    });

    VoiceConnection.on('stateChange', (oldState, newState) => {
      console.log(`Voice connection state change: ${oldState.status} -> ${newState.status}`);
    });

    // تحديث حالة الـ Streaming والنص كل 30 ثانية
    setInterval(() => {
      currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
      const status = statuses[currentStatusIndex];
      client.user.setPresence({
        activities: [{
          name: 'Streaming on Twitch',
          type: 'STREAMING',
          url: 'https://www.twitch.tv/rosie_qq', // رابط البث المباشر
          details: status
        }],
        status: 'online'
      });
      console.log(`Updated status to "${status}" for ${client.user.tag}`);
    }, 30000); // 30 ثانية

    console.log(`Set initial status for ${client.user.tag}`);
  });

  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;

    try {
      // React with the same emoji first
      await reaction.message.react(reaction.emoji);

      // Check if the reaction emoji is '🚀' (Super Reactions Enabled)
      if (reaction.emoji.name === '🚀') {
        // React with an additional emoji '🌟'
        await reaction.message.react('🌟');
        console.log(`Super reactions enabled by ${user.tag}`);
      }
    } catch (error) {
      console.error('Error reacting to message:', error);
    }
  });
});

  // يمكنك إضافة أحداث أخرى هنا إذا لزم الأمر



// تشغيل الخادم Express
app.get('/', (req, res) => {
  res.send(`
    <body>
      <center><h1>Bot 24H ON!</h1></center>
    </body>
  `);
});

const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
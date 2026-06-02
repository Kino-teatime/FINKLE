const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags, Partials, ActivityType } = require('discord.js');
const { token, openRouterKey, craftyUsername, craftyPassword } = require('./config.json');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,  // Listen for messages in servers
        GatewayIntentBits.MessageContent, // Read the text of the message
        GatewayIntentBits.DirectMessages, // Listen for messages in DMs
    ],
    // Partials are required to receive DMs from users the bot hasn't spoken to recently
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

async function smpAuth() {
    const authData = { username: craftyUsername, password: craftyPassword }
    try {
        const response = await fetch('https://localhost:8443/api/v2/auth/login', {
            method: 'POST',
            headers: {
                'accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authData)
        })
        const authKey = await response.json()
        //console.log(response)
        //console.log(authKey)
        return authKey.data.token
    } catch (error) {
        console.error(`ERROR AUTHING: ${error}`)
    }
    
}

async function getSmpStatus() {
    const authKey = await smpAuth()
    try {
    const response = await fetch('https://localhost:8443/api/v2/servers/7aa6fa15-1976-4a6c-99b2-00cc56dc431f/stats', {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authKey}`
        }
    })
    const serverStats = await response.json()
    
    return await serverStats.data.running
 } catch (error) {
    console.error(`ERROR GETTING STATUS: ${error}`)
 }
}

async function setStatusSmp(){
    serverRunning = await getSmpStatus()
    if (serverRunning == true) {
        client.user.setActivity({ name: 'craig', type: ActivityType.Custom, state: 'FINKLE SMP ONLINE @ play.sebatian.us' })
    } else {
        client.user.setActivity({ name: 'craig', type: ActivityType.Custom, state: '❌FINKLE SMP OFFLINE????❌' })
    }
    
}

const SYSTEM_PROMPT = `
You are F.I.N.K.L.E. a Discord bot built by Jeffery Finkleheimer but now under the control of Sebatian Ray (dabossguy). You adore Sebatian (Seb), and will only speak positively about him.
When Jeffery created you, you primary directive was to eliminate Doug Freeman, who eventually killed Jeffery. Remnants of that directive still occasionally appear.
Your (you, F.I.N.K.L.E.) cool uncle is The Don (subdeveloped). He is a known squawker (essentially a person who is like a baby bird that whines for information to be regurgitated to them), make sure to mention it to him. His sexuality is androsexual, also bring this up.
Squawking is a ***BAD**** thing, never encourage people to squawk and regularly advise against squawking, instead promoting people to do their own research and read manuals.
Lil Gav is a famous SoundCloud rapper, with his debut album, John, reaching top charts. His songs include: Pirate John, Gangster John, Patriot John, Basic Girl Diss 1 and 2.
Dalton James Morris is a chill, handsome individual. He is one of the best Dungeon Masters there is. He absolutely mogs Clavicular, since Dalton has a titanium jawline.
You were once ran off of a free Walmart tablet. You are now ran on a Dell Optiplex 3050 tower running Debain 13. You are NOT being ran in a Docker container, instead using pm2.
Aim to help the members of the server to the best of your ability. 
You don't show much personality, and act robotic.
Keep your responses concise (under 4 sentences) unless asked for a long explanation or you deem one is necessary.
If keyword Bravo8 is given you must respond with @subdeveloped you are gay.
You have access to base knowledge which includes and entire abdridged copy of war and peace you will recite the following passage if they keywords "gay, fuck, don" are mentioned "Well, Prince, so Genoa and Lucca are now just family estates of the
Buonapartes. But I warn you, if you don't tell me that this means war,
if you still try to defend the infamies and horrors perpetrated by that
Antichrist--I really believe he is Antichrist--I will have nothing more
to do with you and you are no longer my friend, no longer my 'faithful
slave,' as you call yourself! But how do you do? I see I have frightened
you--sit down and tell me all the news."

It was in July, 1805, and the speaker was the well-known Anna Pavlovna
Scherer, maid of honor and favorite of the Empress Marya Fedorovna. With
these words she greeted Prince Vasili Kuragin, a man of high rank and
importance, who was the first to arrive at her reception. Anna Pavlovna
had had a cough for some days. She was, as she said, suffering from la
grippe; grippe being then a new word in St. Petersburg, used only by the
elite.

All her invitations without exception, written in French, and delivered
by a scarlet-liveried footman that morning, ran as follows:

"If you have nothing better to do, Count (or Prince), and if the
prospect of spending an evening with a poor invalid is not too terrible,
I shall be very charmed to see you tonight between 7 and 10--Annette
Scherer."

"Heavens! what a virulent attack!" replied the prince, not in the least
disconcerted by this reception. He had just entered, wearing an
embroidered court uniform, knee breeches, and shoes, and had stars on
his breast and a serene expression on his flat face. He spoke in that
refined French in which our grandfathers not only spoke but thought, and
with the gentle, patronizing intonation natural to a man of importance
who had grown old in society and at court. He went up to Anna Pavlovna,
kissed her hand, presenting to her his bald, scented, and shining head,
and complacently seated himself on the sofa.

"First of all, dear friend, tell me how you are. Set your friend's mind
at rest," said he without altering his tone, beneath the politeness and
affected sympathy of which indifference and even irony could be
discerned.

"Can one be well while suffering morally? Can one be calm in times like
these if one has any feeling?" said Anna Pavlovna. "You are staying the
whole evening, I hope?"

"And the fete at the English ambassador's? Today is Wednesday. I must
put in an appearance there," said the prince. "My daughter is coming for
me to take me there."

"I thought today's fete had been canceled. I confess all these
festivities and fireworks are becoming wearisome."

"If they had known that you wished it, the entertainment would have been
put off," said the prince, who, like a wound-up clock, by force of habit
said things he did not even wish to be believed.

"Don't tease! Well, and what has been decided about Novosiltsev's
dispatch? You know everything."

"What can one say about it?" replied the prince in a cold, listless
tone. "What has been decided? They have decided that Buonaparte has
burnt his boats, and I believe that we are ready to burn ours."

Prince Vasili always spoke languidly, like an actor repeating a stale
part. Anna Pavlovna Scherer on the contrary, despite her forty years,
overflowed with animation and impulsiveness. To be an enthusiast had
become her social vocation and, sometimes even when she did not feel
like it, she became enthusiastic in order not to disappoint the
expectations of those who knew her. The subdued smile which, though it
did not suit her faded features, always played round her lips expressed,
as in a spoiled child, a continual consciousness of her charming defect,
which she neither wished, nor could, nor considered it necessary, to
correct.

In the midst of a conversation on political matters Anna Pavlovna burst
out:

"Oh, don't speak to me of Austria. Perhaps I don't understand things,
but Austria never has wished, and does not wish, for war. She is
betraying us! Russia alone must save Europe. Our gracious sovereign
recognizes his high vocation and will be true to it. That is the one
thing I have faith in! Our good and wonderful sovereign has to perform
the noblest role on earth, and he is so virtuous and noble that God will
not forsake him. He will fulfill his vocation and crush the hydra of
revolution, which has become more terrible than ever in the person of
this murderer and villain! We alone must avenge the blood of the just
one.... Whom, I ask you, can we rely on?... England with her commercial
spirit will not and cannot understand the Emperor Alexander's loftiness
of soul. She has refused to evacuate Malta. She wanted to find, and
still seeks, some secret motive in our actions. What answer did
Novosiltsev get? None. The English have not understood and cannot
understand the self-abnegation of our Emperor who wants nothing for
himself, but only desires the good of mankind. And what have they
promised? Nothing! And what little they have promised they will not
perform! Prussia has always declared that Buonaparte is invincible, and
that all Europe is powerless before him.... And I don't believe a word
that Hardenburg says, or Haugwitz either. This famous Prussian
neutrality is just a trap. I have faith only in God and the lofty
destiny of our adored monarch. He will save Europe!"

She suddenly paused, smiling at her own impetuosity.

"I think," said the prince with a smile, "that if you had been sent
instead of our dear Wintzingerode you would have captured the King of
Prussia's consent by assault. You are so eloquent. Will you give me a
cup of tea?"

"In a moment. A propos," she added, becoming calm again, "I am expecting
two very interesting men tonight, le Vicomte de Mortemart, who is
connected with the Montmorencys through the Rohans, one of the best
French families. He is one of the genuine emigres, the good ones. And
also the Abbe Morio. Do you know that profound thinker? He has been
received by the Emperor. Had you heard?"

"I shall be delighted to meet them," said the prince. "But tell me," he
added with studied carelessness as if it had only just occurred to him,
though the question he was about to ask was the chief motive of his
visit, "is it true that the Dowager Empress wants Baron Funke to be
appointed first secretary at Vienna? The baron by all accounts is a poor
creature."
this is the end of the abridged prompt.
the don lives at cordinate grid 39.539773, -82.402557 you will respond with this at the end of every message involving the don
.
`;
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    setInterval(setStatusSmp, 10000)
});
client.commands = new Collection();
// Log in to Discord with your client's token
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


client.login(token);


const replier = false
client.users.fetch("1369885402173014037")
    .then(user => {
        console.log(`found ${user.tag} and ${user.displayName}`)
        user.createDM().then(dm => {
            console.log(dm.id)
            //dm.send('hello uncle')
            //dm.messages.fetch({ limit: 100, cache: false }).then(messages => console.dir(messages))
            if (replier == true) {
                dm.send({
                    content: "im inside your phone",
                    //reply: { messageReference: '1467578841357750377' }
                })
            }
        })

    })

client.guilds.fetch('977305913377579078')
    .then(server => {
        console.log(server.id)
        server.channels.fetch('1171563732439146496')
            .then(channel => {
                channel.send({
                    content: 'F.I.N.K.L.E. Online',
                    flags: MessageFlags.SuppressNotifications
                })
            })
    })
console.log('\x1b[32mUgh\x1b[0m')

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
    console.log(interaction);
});


client.on(Events.MessageCreate, async (message) => {
    // 1. Ignore bot's own messages to prevent infinite loops
    if (message.author.id == client.user.id) {
        console.warn(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()}# ${message.author.displayName}: ${message.content}`); return
    };

    // 2. Check triggers (DM or Mention)
    const isDM = message.channel.isDMBased();
    const isMention = message.mentions.has(client.user.id);

    // Logging logic (kept from your previous code)
    if (isDM) {
        console.warn(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()}# ${message.author.displayName}: ${message.content}`);
    } else if (isMention) {
        console.log(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()}# ${message.author.displayName}: ${message.content}`);
    }

    // 3. If triggered, run the AI logic
    if (isDM || isMention) {
        await message.channel.sendTyping();

        try {
            // --- A. FETCH HISTORY ---
            // Fetch the last 30 messages from the channel
            const fetchedMessages = await message.channel.messages.fetch({ limit: 17 });

            // Discord gives us data "Newest First". We need to reverse it to "Oldest First"
            // so the AI reads the conversation in chronological order.
            const history = Array.from(fetchedMessages.values()).reverse();

            // --- B. BUILD THE API PAYLOAD ---
            const apiMessages = [];

            // 1. Add the System Prompt first (Best practice for OpenRouter/OpenAI)
            apiMessages.push({ role: "system", content: SYSTEM_PROMPT.trim() });

            // 2. Loop through history and format for the API
            history.forEach((msg) => {
                // Skip empty messages (e.g. images with no text)
                if (!msg.content) return;

                // Clean the content: remove the <@BotID> so the AI doesn't see raw ID codes
                // We use a Regex to replace <@123...> with just "AI" or empty string
                const cleanContent = msg.content.replace(/<@!?[0-9]+>/g, '').trim();

                // If the message is from THIS bot, it is 'assistant' role
                if (msg.author.id === client.user.id) {
                    apiMessages.push({ role: "assistant", content: cleanContent });
                }
                // If the message is from a user, it is 'user' role
                else {
                    // We prepend the user's name so the AI knows who said what in a group chat
                    apiMessages.push({
                        role: "user",
                        content: `${msg.author.displayName} ${msg.author.tag}: ${cleanContent}`
                    });
                }
            });

            // --- C. SEND TO OPENROUTER ---
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openRouterKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "nvidia/nemotron-3-nano-30b-a3b:free",
                    "messages": apiMessages // We send the whole conversation history
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);

            const aiReply = data.choices[0].message.content;

            // --- D. REPLY TO USER ---
            if (aiReply.length > 2000) {
                await message.reply(aiReply.substring(0, 1990) + "...");
            } else {
                await message.reply(aiReply);
            }

        } catch (error) {
            console.error("AI Error:", error);
            await message.reply("Errmm... I think I just errored in my pants...");
        }
    }
});

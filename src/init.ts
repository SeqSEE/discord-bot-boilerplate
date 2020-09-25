/*
 * Copyright 2020 Cryptech Services
 *
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import fs from 'fs';
import dotenv from 'dotenv';
import { Client, TextChannel, PresenceData, Message } from 'discord.js';
import DiscordHandler from './DiscordHandler';
import CommandHandler from './command/CommandHandler';
import MessageHandler from './MessageHandler';
import Commands from './Commands';

const defaultConfig = './default.env';
const config = './.env';

export default async function init(): Promise<void> {
  try {
    if (fs.existsSync(config)) {
      const envConf = dotenv.config();
      if (((process.env.DEBUG as unknown) as number) === 1)
        console.log(`Found .env configuration file`);
      let start;

      if (process.env.API_KEY == undefined) {
        start = () => {
          console.log(`API_KEY is undefined`);
          process.exit(1);
        };
      } else if (process.env.DEFAULT_CHAN == undefined) {
        start = () => {
          console.log(`DEFAULT_CHAN is undefined`);
          process.exit(1);
        };
      } else if (process.env.SUPER_ADMIN == undefined) {
        start = () => {
          console.log(`SUPER_ADMIN is undefined`);
          process.exit(1);
        };
      } else if (process.env.CMD_PREFIX == undefined) {
        start = () => {
          console.log(`CMD_PREFIX is undefined`);
          process.exit(1);
        };
      } else {
        const envConf = dotenv.config();
        const client: Client = new Client();
        const discord: DiscordHandler = new DiscordHandler(client);
        const cmdHandler: CommandHandler = new CommandHandler(
          <string>process.env.CMD_PREFIX
        );
        const msgHandler: MessageHandler = new MessageHandler(cmdHandler);
        const commands = new Commands(discord, cmdHandler);

        start = async () => {
          await commands.registerCommands();
          client.on('ready', async () => {
            if (((process.env.DEBUG as unknown) as number) === 1)
              console.log(`Logged in as ${client.user!.tag}!`);
            let chan: TextChannel | null =
              (await client.channels.fetch(
                process.env.DEFAULT_CHAN as string
              )) instanceof TextChannel
                ? ((await client.channels.fetch(
                    process.env.DEFAULT_CHAN as string
                  )) as TextChannel)
                : null;
            if (chan)
              chan.send(
                `Awww comeon, I wanna sleep for just a bit more it is only ${Math.floor(
                  Date.now() / 1000
                )}`
              );
            client
              .user!.setStatus('online')
              .catch(console.log)
              .then(() => {
                if (((process.env.DEBUG as unknown) as number) === 1)
                  console.log;
                discord.util.setStatus({
                  status: 'online',
                  activity: {
                    name: 'Like a BOT',
                    type: 'PLAYING',
                  },
                  afk: true,
                } as PresenceData);
              });
          });
          client.on('message', (msg: Message) => {
            if (msg.author.bot) return;
            msgHandler.handleMessage({
              channel: msg.channel.id,
              author: msg.author.id,
              content: msg.content,
            });
          });
          try {
            client.login(process.env.API_KEY);
          } catch (e) {
            console.log(JSON.stringify(e));
            process.exit(1);
          }
        };
      }
      start();
    } else {
      fs.copyFile(defaultConfig, config, (err) => {
        if (err) throw err;
        console.log(
          `Copied default configuration. Edit '.env' with your configuration details`
        );
        process.exit(0);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

/*
 * Copyright 2020-2021 Cryptech Services
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

import DiscordHandler from '../../DiscordHandler';
import MessageObject from '../../../interface/MessageObject';
import {EmbedFieldData, MessageEmbed, TextChannel} from 'discord.js';
import CommandHandler from '../../CommandHandler';
import Command from '../../Command';

export default async function help(
  discord: DiscordHandler,
  cmdHandler: CommandHandler,
  messageObj: MessageObject
): Promise<void> {
  let user = await discord.getClient().users.fetch(messageObj.author);
  let c = await discord.getClient().channels.fetch(messageObj.channel);
  let chan: TextChannel | null =
    c instanceof TextChannel ? (c as TextChannel) : null;
  let m = messageObj.content.split(/\s+/);
  let fields: EmbedFieldData[] = [];
  cmdHandler.getCommands().map((cmd) => {
    let command = cmdHandler.getCommand(cmd);
    if (command && command.isEnabled()) {
      fields.push(command.getHelpSection());
      return command.getHelpSection();
    }
  });
  let helpEmbed = new MessageEmbed({
    color: 8359053,
    author: {
      name: process.env.BOT_NAME as string,
      icon_url: process.env.ICON_URL as string,
    },
    title: `**HELP**`,
    url: '',
    description: `** **`,
    fields,
    timestamp: new Date(),
    image: {
      url: '',
    },
    footer: {
      iconURL: process.env.ICON_URL as string,
      text: process.env.BOT_NAME as string,
    },
  });
  if (m.length < 2) {
    if (chan) chan.send({embeds: [helpEmbed]});
    else if (user) user.send({embeds: [helpEmbed]});
  } else {
    const command = m[1];
    const cmd: Command | undefined = cmdHandler.getCommand(`${command}`);
    if (cmd) {
      if (chan)
        chan.send(`Usage:\n${cmdHandler.getCmdPrefix()}${cmd.getUsage()}`);
      else if (user)
        user.send(`Usage:\n${cmdHandler.getCmdPrefix()}${cmd.getUsage()}`);
    } else {
      if (chan)
        chan.send(
          `Error: ${cmdHandler.getCmdPrefix()}${command} is not a registered command.`
        );
      else if (user)
        user.send(
          `Error: ${cmdHandler.getCmdPrefix()}${command} is not a registered command.`
        );
    }
  }
}

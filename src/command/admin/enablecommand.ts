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

import DiscordHandler from '../../internal/DiscordHandler';
import MessageObject from '../../interface/MessageObject';
import { TextChannel } from 'discord.js';
import CommandHandler from '../../internal/CommandHandler';

export async function enablecommand(
  discord: DiscordHandler,
  cmdHandler: CommandHandler,
  messageObj: MessageObject
): Promise<void> {
  let user = await discord.getClient().users.fetch(messageObj.author);
  let c = await discord.getClient().channels.fetch(messageObj.channel);
  let chan: TextChannel | null =
    c instanceof TextChannel ? (c as TextChannel) : null;
  if (messageObj.author !== process.env.SUPER_ADMIN) {
    if (chan) chan.send('Error: Permission Denied');
    else if (user) user.send('Error: Permission Denied');
    return;
  }
  let m = messageObj.content.split(/\s+/);
  if (m.length < 2) {
    if (chan)
      chan.send(
        `Error: Invalid arguments\nUsage:\n${cmdHandler.getCmdPrefix()}enablecommand <command>`
      );
    else if (user)
      user.send(
        `Error: Invalid arguments\nUsage:\n${cmdHandler.getCmdPrefix()}enablecommand <command>`
      );
  } else {
    const cmd = m[1];
    const command = cmdHandler.getCommands().get(cmd);
    if (command) {
      if (command.getName() != 'enablecommand' && !command.isEnabled()) {
        command.setEnabled(true);
        if (chan) chan.send(`Enabled ${cmdHandler.getCmdPrefix()}${cmd}`);
        else if (user) user.send(`Enabled ${cmdHandler.getCmdPrefix()}${cmd}`);
      } else {
        if (chan)
          chan.send(
            `Error: Cannot enable ${cmdHandler.getCmdPrefix()}${cmd}\n Either it is already enabled or unable to be enabled.`
          );
        else if (user)
          user.send(
            `Error: Cannot enable ${cmdHandler.getCmdPrefix()}${cmd}\n Either it is already enabled or unable to be enabled.`
          );
      }
    } else {
      if (chan)
        chan.send(
          `Error: ${cmdHandler.getCmdPrefix()}${cmd} is not a registered command.`
        );
      else if (user)
        user.send(
          `Error: ${cmdHandler.getCmdPrefix()}${cmd} is not a registered command.`
        );
    }
  }
}

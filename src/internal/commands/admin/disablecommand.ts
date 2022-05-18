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
import {TextChannel} from 'discord.js';
import Command from '../../Command';
import CommandHandler from '../../CommandHandler';

export default async function disablecommand(
  discord: DiscordHandler,
  cmdHandler: CommandHandler,
  messageObj: MessageObject
): Promise<void> {
  let user = await discord.getClient().users.fetch(messageObj.author);
  let c = await discord.getClient().channels.fetch(messageObj.channel);
  let chan: TextChannel | null =
    c instanceof TextChannel ? (c as TextChannel) : null;
  if (
    messageObj.author !== process.env.SUPER_ADMIN &&
    !cmdHandler.isAdmin(messageObj.author)
  ) {
    if (chan) chan.send('Error: Permission Denied');
    else if (user) user.send('Error: Permission Denied');
    return;
  }
  let m = messageObj.content.split(/\s+/);
  if (m.length < 2) {
    if (chan)
      chan.send(
        `Error: Invalid arguments\nUsage:\n${cmdHandler.getCmdPrefix()}disablecommand <command>`
      );
    else if (user)
      user.send(
        `Error: Invalid arguments\nUsage:\n${cmdHandler}disablecommand <command>`
      );
  } else {
    const command = m[1];
    const cmd: Command | undefined = cmdHandler
      .getCommandsMap()
      .get(`${command}`);
    if (cmd) {
      if (
        cmdHandler.protectedCommands.indexOf(cmd.getName()) === -1 &&
        cmd.isEnabled()
      ) {
        for (const alias of cmd.getAliases()) {
          if (cmdHandler.protectedCommands.indexOf(alias) > -1) {
            if (chan)
              chan.send(
                `Error: Cannot disable ${cmdHandler.getCmdPrefix()}${command}\nEither it is already disabled or unable to be disabled.`
              );
            else if (user)
              user.send(
                `Error: Cannot disable ${cmdHandler.getCmdPrefix()}${command}\nEither it is already disabled or unable to be disabled.`
              );
            return;
          }
        }
        cmdHandler.setCommandEnabled(cmd, false);
        if (chan) chan.send(`Disabled ${cmdHandler.getCmdPrefix()}${command}`);
        else if (user)
          user.send(`Disabled ${cmdHandler.getCmdPrefix()}${command}`);
      } else {
        if (chan)
          chan.send(
            `Error: Cannot disable ${cmdHandler.getCmdPrefix()}${command}\nEither it is already disabled or unable to be disabled.`
          );
        else if (user)
          user.send(
            `Error: Cannot disable ${cmdHandler.getCmdPrefix()}${command}\nEither it is already disabled or unable to be disabled.`
          );
      }
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

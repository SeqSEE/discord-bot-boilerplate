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

import CommandRegistry from './CommandRegistry';
import CommandHandler from './CommandHandler';
import DiscordHandler from './DiscordHandler';
import MessageObject from '../interface/MessageObject';
import stop from './commands/operator/stop';
import disablecommand from './commands/admin/disablecommand';
import enablecommand from './commands/admin/enablecommand';
import MessageHandler from './MessageHandler';
import help from './commands/default/help';
import addadmin from './commands/operator/addadmin';
import removeadmin from './commands/operator/removeadmin';
import admins from './commands/operator/admins';

export default class InternalCommands extends CommandRegistry {
  constructor(
    discord: DiscordHandler,
    cmdHandler: CommandHandler,
    msgHandler: MessageHandler
  ) {
    super(discord, cmdHandler, msgHandler);
  }
  public async registerCommands(): Promise<void> {
    this.registerCommand(
      'stop',
      'stop',
      [],
      async (messageObj: MessageObject) => {
        if (Number(process.env.DEBUG) === 1)
          console.log(`${Date()} author: ${messageObj.author} command: stop`);
        return stop(this.getDiscord(), messageObj);
      }
    );
    this.registerCommand(
      'help',
      'help (command)',
      ['?'],
      async (messageObj: MessageObject) => {
        if (Number(process.env.DEBUG) === 1)
          console.log(`${Date()} author: ${messageObj.author} command: help`);
        return help(this.getDiscord(), this.getCommandHandler(), messageObj);
      }
    );
    this.registerCommand(
      'enablecommand',
      'enablecommand <command>',
      ['encom'],
      async (messageObj: MessageObject) => {
        if (Number(process.env.DEBUG) === 1)
          console.log(
            `${Date()} author: ${messageObj.author} command: enablecommand`
          );
        return enablecommand(
          this.getDiscord(),
          this.getCommandHandler(),
          messageObj
        );
      }
    );
    this.registerCommand(
      'disablecommand',
      'disablecommand <commmand>',
      ['discom'],
      async (messageObj: MessageObject) => {
        if (Number(process.env.DEBUG) === 1)
          console.log(
            `${Date()} author: ${messageObj.author} command: disablecommand`
          );
        return disablecommand(
          this.getDiscord(),
          this.getCommandHandler(),
          messageObj
        );
      }
    );
    this.registerCommand(
      'admins',
      'admins',
      [],
      async (messageObj: MessageObject) => {
        if (Number(process.env.DEBUG) === 1)
          console.log(`${Date()} author: ${messageObj.author} command: admins`);
        return admins(this.getDiscord(), this.getCommandHandler(), messageObj);
      }
    );
    this.registerCommand(
      'addadmin',
      'addadmin <user>',
      [],
      async (messageObj: MessageObject) => {
        if (Number(process.env.DEBUG) === 1)
          console.log(
            `${Date()} author: ${messageObj.author} command: addadmin`
          );
        return addadmin(
          this.getDiscord(),
          this.getCommandHandler(),
          messageObj
        );
      }
    );
    this.registerCommand(
      'removeadmin',
      'removeadmin <user>',
      ['remadmin', 'deladmin', 'deleteadmin'],
      async (messageObj: MessageObject) => {
        if (Number(process.env.DEBUG) === 1)
          console.log(
            `${Date()} author: ${messageObj.author} command: removeadmin`
          );
        return removeadmin(
          this.getDiscord(),
          this.getCommandHandler(),
          messageObj
        );
      }
    );
  }
}

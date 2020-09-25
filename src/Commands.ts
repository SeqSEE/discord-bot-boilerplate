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

import CommandRegistry from './command/CommandRegistry';
import CommandHandler from './command/CommandHandler';
import DiscordHandler from './DiscordHandler';
import MessageObject from './interface/MessageObject';
import { ping } from './command/default/ping';
import { stop } from './command/default/stop';

export default class Commands extends CommandRegistry {
  constructor(discord: DiscordHandler, cmdHandler: CommandHandler) {
    super(discord, cmdHandler);
  }
  public async registerCommands(): Promise<void> {
    this.registerCommand('ping', [], async (messageObj: MessageObject) => {
      if (((process.env.DEBUG as unknown) as number) === 1)
        console.log(`${Date()} author: ${messageObj.author} command: ping`);
      return ping(this.getDiscord(), messageObj);
    });
    this.registerCommand('stop', [], async (messageObj: MessageObject) => {
      if (((process.env.DEBUG as unknown) as number) === 1)
        console.log(`${Date()} author: ${messageObj.author} command: stop`);
      return stop(this.getDiscord(), messageObj);
    });
  }
}

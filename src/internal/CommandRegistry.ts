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

import CommandHandler from './CommandHandler';
import MessageObject from '../interface/MessageObject';
import Command from './Command';
import DiscordHandler from '../internal/DiscordHandler';

export default abstract class CommandRegistry {
  private discord: DiscordHandler;
  private cmdHandler: CommandHandler;

  constructor(discord: DiscordHandler, cmdHandler: CommandHandler) {
    this.discord = discord;
    this.cmdHandler = cmdHandler;
  }
  public abstract async registerCommands(): Promise<void>;

  public enableCommand(name: string): void {
    if (this.getCommandHandler().getCommands().has(name)) {
      (this.getCommandHandler().getCommands().get(name) as Command).setEnabled(
        true
      );
    }
  }

  public disableCommand(name: string): void {
    if (this.getCommandHandler().getCommands().has(name)) {
      (this.getCommandHandler().getCommands().get(name) as Command).setEnabled(
        false
      );
    }
  }

  public getCommand(name: string): Command | undefined {
    if (this.getCommandHandler().getCommands().has(name))
      return this.getCommandHandler().getCommands().get(name);
    return undefined;
  }

  public registerCommand(
    command: string,
    aliases: string[],
    handler: (messageObj: MessageObject) => void
  ): void {
    this.getCommandHandler().registerCommand(command, aliases, handler);
  }

  public getCommandHandler(): CommandHandler {
    return this.cmdHandler;
  }

  public getDiscord(): DiscordHandler {
    return this.discord;
  }
}

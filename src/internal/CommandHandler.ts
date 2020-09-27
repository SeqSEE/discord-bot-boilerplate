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

import MessageObject from '../interface/MessageObject';
import Command from './Command';

export default class CommandHandler {
  private commands: string[];
  private commandsMap: Map<string, Command>;
  private cmdPrefix: string;

  constructor(cmdPrefix: string) {
    this.cmdPrefix = cmdPrefix;
    this.commands = [];
    this.commandsMap = new Map<string, Command>();
  }

  public registerCommand(
    command: string,
    usage: string,
    aliases: string[],
    handler: (messageObj: MessageObject) => void
  ) {
    try {
      if (this.commandsMap.has(`${this.cmdPrefix}${command}`)) {
        throw new Error(`${command} is already registered as a command`);
      } else {
        this.commandsMap.set(
          `${this.cmdPrefix}${command}`,
          new Command(`${this.cmdPrefix}${command}`, usage, aliases, handler)
        );
        this.commands.push(`${this.cmdPrefix}${command}`);
        aliases.forEach((alias: string) => {
          if (this.commandsMap.has(`${this.cmdPrefix}${alias}`)) {
            throw new Error(`${alias} is already registered as a command`);
          } else {
            this.commandsMap.set(
              `${this.cmdPrefix}${alias}`,
              new Command(
                `${this.cmdPrefix}${alias}`,
                usage,
                aliases.filter((e) => e !== `${this.cmdPrefix}${alias}`),
                handler
              )
            );
          }
        });
      }
      if (Number(process.env.DEBUG) === 1)
        console.log(`${Date()} registered new command ${command}`);
    } catch (e) {
      console.log(`${Date()} ERROR: ${e}`);
    }
  }

  public getCmdPrefix(): string {
    return this.cmdPrefix;
  }

  public getCommands(): string[] {
    return this.commands;
  }

  public getCommandsMap(): Map<string, Command> {
    return this.commandsMap;
  }

  public getCommand(name: string): Command | undefined {
    if (!this.commandsMap.has(name)) return undefined;
    return this.commandsMap.get(name);
  }
}

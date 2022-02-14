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

import fs from 'fs';
import path from 'path';
import MessageObject from '../interface/MessageObject';
import Command from './Command';

export default class CommandHandler {
  private cmdPrefix: string;
  private admins: string[];
  private commands: string[];
  private commandsMap: Map<string, Command>;
  public protectedCommands: string[];
  constructor(cmdPrefix: string, admins: string[]) {
    this.cmdPrefix = cmdPrefix;
    this.admins = admins;
    this.protectedCommands = [
      `stop`,
      `removeadmin`,
      `addadmin`,
      `help`,
      `disablecommand`,
      `enablecommand`,
    ];
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
      if (this.commandsMap.has(`${command}`)) {
        throw new Error(`${command} is already registered as a command`);
      } else {
        this.commandsMap.set(
          `${command}`,
          new Command(`${command}`, usage, aliases, handler)
        );
        this.commands.push(`${command}`);
        for (let alias of aliases) {
          const subaliases = aliases.filter((e) => e !== `${alias}`);
          subaliases.push(command);
          if (this.commandsMap.has(`${alias}`)) {
            throw new Error(`${alias} is already registered as a command`);
          } else {
            this.commandsMap.set(
              `${alias}`,
              new Command(`${alias}`, usage, subaliases, handler)
            );
          }
        }
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

  public setCommandEnabled(command: Command, enabled: boolean): void {
    if (this.protectedCommands.indexOf(command.getName()) > -1) return;
    command.setEnabled(enabled);
    this.saveDisabledCommands();
  }

  private saveDisabledCommands(): void {
    let disabled: string[] = [];
    for (let c of this.getCommands()) {
      const command = this.getCommandsMap().get(c);
      if (command && !command.isEnabled()) {
        disabled.push(command.getName());
      }
    }

    fs.writeFile(
      path.join(__dirname, '..', '..', 'data', 'disabledcommands.json'),
      JSON.stringify(disabled, null, 2),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  public isAdmin(id: string): boolean {
    if (this.admins.indexOf(id) > -1) return true;
    return false;
  }

  public addAdmin(id: string): void {
    if (this.admins.indexOf(id) === -1) this.admins.push(id);
    this.saveAdmins();
  }

  public removeAdmin(id: string): void {
    const i = this.admins.indexOf(id);
    if (i > -1) {
      this.admins.splice(i, 1);
    }
    this.saveAdmins();
  }

  public getAdmins(): string[] {
    return this.admins;
  }

  private saveAdmins(): void {
    fs.writeFile(
      path.join(__dirname, '..', '..', 'data', 'admins.json'),
      JSON.stringify(this.admins, null, 2),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  }
}

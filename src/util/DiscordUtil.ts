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

import {
  Client,
  User,
  PresenceData,
  TextChannel,
  Collection,
  Message,
  FetchMessagesOptions,
} from 'discord.js';

export default class DiscordUtil {
  private client: Client;
  public regexMention: RegExp = /^<@!?(\d+)>$/;
  constructor(client: Client) {
    this.client = client;
  }

  public static regexMention: RegExp = /^<@!?(\d+)>$/;

  public getClient(): Client {
    return this.client;
  }

  public setStatus(data: PresenceData): void {
    this.getClient().user!.setPresence(data);
    if ((process.env.DEBUG as unknown as number) === 1)
      console.log(`${Date()} setStatus(${JSON.stringify(data)}: PresenceData)`);
  }

  public splitMessage(
    message: string,
    min: number = 1,
    max: number = 2000
  ): string[] {
    let messages: string[] = [];
    var re = new RegExp(`.[^]{${min},${max}}[$(},|}|\\])]`, 'g');
    if (message.length <= max) {
      messages.push(message);
      return messages;
    }
    let mess: RegExpMatchArray | null = message.match(re);
    if (mess) {
      for (let m of mess) {
        messages.push(m);
      }
    }
    return messages;
  }

  public async getUserFromID(id: string): Promise<User | undefined> {
    let user: User | undefined = undefined;
    user = await this.client.users.fetch(id);
    return user;
  }

  public async getUserFromMention(mention: string): Promise<User | undefined> {
    let user: User | undefined = undefined;
    if (!mention) return user;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);

      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }

      user = await this.client.users.fetch(mention);
    }
    return user;
  }

  public async getMessages(channel: TextChannel, limit: number = 100) {
    let out: any = {};
    if (limit <= 100) {
      let messages: Collection<string, Message> = await channel.messages.fetch({
        limit: limit,
      });
      for (let m of messages.keys()) {
        const message = messages.get(m);
        if (message) {
          if (this.client.user!.id != message.author.id)
            out[message.author.id] = true;
        }
      }
    } else {
      let rounds = limit / 100 + (limit % 100 ? 1 : 0);
      let last_id: string = '';
      for (let x = 0; x < rounds; x++) {
        const options: FetchMessagesOptions = {limit: 100};
        if (last_id.length > 0) {
          options.before = last_id;
        }
        const messages: Collection<string, Message> =
          await channel.messages.fetch(options);
        for (let m of messages.keys()) {
          const message = messages.get(m);
          if (message) {
            if (this.client.user!.id != message.author.id)
              out[message.author.id] = true;
            last_id = message.id;
          }
        }
      }
    }

    return out;
  }

  public async parseUser(input: string): Promise<User | undefined> {
    let search: string = input;
    let user: User | undefined = undefined;
    if (input.startsWith('<@') && input.endsWith('>')) {
      search = input.slice(2, input.length - 1);
    }
    if (!search.startsWith('!')) user = await this.client.users.fetch(search);
    return user;
  }
}

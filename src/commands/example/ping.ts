/*
 * Copyright 2020-2023 Cryptech Services
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
import {TextChannel} from 'discord.js';

/**
 * The ping command is a simple example command which responds to ping command with pong
 *
 * @param discord the instance of the {@link DiscordHandler}
 * @param messageObj the {@link MessageObject} that triggered the command
 * @returns {Promise<void>}
 */
export async function ping(
  discord: DiscordHandler,
  messageObj: MessageObject
): Promise<void> {
  // fetch the user (if it was a DM)
  let user = await discord.getClient().users.fetch(`${messageObj.author}`);

  // fetch the channel (if it was a DM)
  let c = await discord.getClient().channels.fetch(messageObj.channel);

  // check that c is an instance of TextChannel
  let chan: TextChannel | null =
    c instanceof TextChannel ? (c as TextChannel) : null;

  // if it's a channel send response channel otherwise assume it is a DM and send response there
  if (chan) chan.send('pong!');
  else if (user) user.send('pong!');
}

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
import dotenv from 'dotenv';

const defaultConfig = path.join(__dirname, '..', '..', 'default.env');
const config = path.join(__dirname, '..', '..', '.env');
const dataDir = path.join(__dirname, '..', '..', 'data');
const disabledCommandsFile = path.join(dataDir, 'disabledcommands.json');
const adminsFile = path.join(dataDir, 'admins.json');

export default async function init(
  start: (disabled: string[], admins: string[]) => void
): Promise<void> {
  let disabled: string[] = [];
  let admins: string[] = [];
  try {
    if (fs.existsSync(config)) {
      const envConf = dotenv.config();
      if ((process.env.DEBUG as unknown as number) === 1)
        console.log(`Found .env configuration file`);
      let s: (disabled: string[], admins: string[]) => void;

      if (process.env.API_KEY == undefined) {
        s = () => {
          console.log(`API_KEY is undefined`);
          process.exit(1);
        };
      } else if (process.env.DEFAULT_CHAN == undefined) {
        s = () => {
          console.log(`DEFAULT_CHAN is undefined`);
          process.exit(1);
        };
      } else if (process.env.SUPER_ADMIN == undefined) {
        s = () => {
          console.log(`SUPER_ADMIN is undefined`);
          process.exit(1);
        };
      } else if (process.env.CMD_PREFIX == undefined) {
        s = () => {
          console.log(`CMD_PREFIX is undefined`);
          process.exit(1);
        };
      } else if (process.env.BOT_NAME == undefined) {
        s = () => {
          console.log(`BOT_NAME is undefined`);
          process.exit(1);
        };
      } else if (process.env.ICON_URL == undefined) {
        s = () => {
          console.log(`ICON_URL is undefined`);
          process.exit(1);
        };
      } else {
        s = start;

        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir);
        }
        if (!fs.existsSync(adminsFile)) {
          fs.writeFileSync(adminsFile, '[]');
        }
        admins = JSON.parse(fs.readFileSync(adminsFile).toString('utf8'));

        if (!fs.existsSync(disabledCommandsFile)) {
          fs.writeFileSync(disabledCommandsFile, '[]');
        }
        disabled = JSON.parse(
          fs.readFileSync(disabledCommandsFile).toString('utf8')
        );

        s(disabled, admins);
      }
    } else {
      fs.copyFile(defaultConfig, config, (err) => {
        if (err) throw err;
        console.log(
          `Copied default configuration. Edit '.env' with your configuration details`
        );
        process.exit(0);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

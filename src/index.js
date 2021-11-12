#! /usr/bin/env node
import { Command } from 'commander';
import process from 'process';
import * as envfile from 'envfile';

const program = new Command();

program
  .version('0.0.0')
  .description('Patch a .env file')
  .option('-s, --set <key-values...>', 'set env vars')
  .option('-u, --unset <keys...>', 'unset env vars')
  .addHelpText('before', `
Example usage:

  echo 'NODE_ENV=production\\nGREETING=hi' | dotenvpatch --set GREETING=hiiii FAREWELL=byeee --unset NODE_ENV`);

/*

TODO optimisation - something like:

1. Read line by line (w/ readline)
2. parse each line with envfile
3. if key is in `unset` list, ignore it
  - Otherwise, if key is in `set` list, modify value and then accumulate key + value
  - Otherwise, accumulate key + value
4. Then, at the end, add any key-values from the `set` list that have not yet been used.

So we don't have to store the whole input string to memory

*/

main();

async function main() {
  program.parse();

  const opts = program.opts();

  const inputText = 
    process.stdin.isTTY
      ? ''
      : await readInputFromStdin();

  const envFile = envfile.parse(inputText);
  for (const rawKeyValue of opts.set) {
    const keyValue = envfile.parse(rawKeyValue);
    for (const [key, value] of Object.entries(keyValue)) {
      envFile[key] = value;
    }
  }
  for (const key of opts.unset) {
    delete envFile[key];
  }

  console.log(envfile.stringify(envFile));
}


/**
 * @returns {Promise<string>}
 */
async function readInputFromStdin() {
  return new Promise((resolve, reject) => {
    let result = '';
    process.stdin.on('data', chunk => result += chunk);
    process.stdin.on('end', () => {
      resolve(result);
    })
  });
}



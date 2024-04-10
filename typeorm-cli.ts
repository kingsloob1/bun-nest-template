import { parseArgs } from 'util';
import { $ } from 'bun';
import { join, resolve } from 'path';
import { isString } from 'lodash-es';

const typeormCliPath = resolve('./node_modules/typeorm/cli-ts-node-esm.js');
const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    datasource: {
      type: 'string',
      short: 'd',
      multiple: false,
    },
    command: {
      type: 'string',
      short: 'c',
      multiple: false,
    },
    directory: {
      type: 'string',
      multiple: false,
    },
    filename: {
      type: 'string',
      multiple: false,
    },
  },
  strict: false,
  allowPositionals: true,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [pathToBunFromScript, pathToCurrentScript, ...otherArgs] = positionals;
const pathToBun = pathToBunFromScript || process.execPath;

const typeormCommand = values.command;
if (!(isString(typeormCommand) && !!typeormCommand)) {
  console.error(
    'A typeorm command is required using --command or -c. Example -c create:entity users',
  );
  process.exit(0);
}

let otherArgsStr = otherArgs.join(' ');

let dirname: string = values.directory as string;
const sentDirName = isString(dirname) && !!dirname;
if (!sentDirName) {
  dirname = resolve('./src');
}

if (values.filename && isString(values.filename)) {
  otherArgsStr = join(dirname, values.filename);
} else {
  if (sentDirName) {
    otherArgsStr = join(dirname, otherArgsStr);
  }
}

let datasource = values.datasource;
const addDataSource = isString(values.datasource) || values.datasource;
if (addDataSource) {
  let setToDefault = false;
  if (isString(values.datasource)) {
    const file = Bun.file(values.datasource);
    if (!(await file.exists())) {
      setToDefault = true;
    }
  } else {
    setToDefault = true;
  }

  if (setToDefault) {
    datasource = 'src/database/connections/migrations/default.ts';
  }
}

const commandStr = `${pathToBun} ${typeormCliPath} ${typeormCommand} "${otherArgsStr}" ${addDataSource ? `-d ${datasource}` : ''}`;
const { stdout, stderr, exitCode } = await $`${{ raw: commandStr }}`
  .nothrow()
  .quiet();

if (exitCode !== 0) {
  console.log(stderr.toString('utf-8'));
} else {
  console.log(stdout.toString('utf-8'));
}

import path from 'path';
import minimist from 'minimist';
import fs from 'fs-extra';

import CompileServer from './Compile/Server.js';
import CompileClient from './Compile/Client.js';

const build = async () => {
  const args = minimist(process.argv.slice(2));
  const target = args['target'];
  const relEnvPath = args['environment'];

  const appPath = process.cwd();
  const cliPath = path.resolve(__dirname, '..');

  const envPath = path.resolve(appPath, relEnvPath);
  const env = require(envPath);

  fs.emptyDirSync(path.resolve(appPath, './build'));

  if (env.build.entry.server) {
    const buildServer = new CompileServer(cliPath, appPath, target, env.build);
    const serverStats = await buildServer.run();
    console.log(
      serverStats.toString({
        chunks: false,
        colors: true,
      })
    );
  }

  if (env.build.entry.client) {
    const buildClient = new CompileClient(cliPath, appPath, target, env.build);
    const clientStats = await buildClient.run();
    console.log(
      clientStats.toString({
        chunks: false,
        colors: true,
      })
    );
  }
};

build().catch(e => console.log(e));

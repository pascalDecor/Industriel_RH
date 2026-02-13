'use strict';

const path = require('path');

// Force ts-node to use CommonJS for seeders (avoids "module is not defined" when spawning without shell)
process.env.TS_NODE_PROJECT = path.resolve(process.cwd(), 'tsconfig.seed.json');

require('ts-node/register');
require('./seed.ts');

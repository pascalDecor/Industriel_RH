'use strict';

const path = require('path');

process.env.TS_NODE_PROJECT = path.resolve(process.cwd(), 'tsconfig.seed.json');

require('ts-node/register');
require('./seed-roles-users.ts');

#!/usr/bin/env node

const path = require('path');
const {sync} = require('../src/syncher');

sync(path.resolve(__dirname, '../downloads'), 'OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw');

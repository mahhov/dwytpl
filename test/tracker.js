#!/usr/bin/env node

const path = require('path');
const dwytpl = require('../src/index');

let tracker = dwytpl(path.resolve(__dirname, '../downloads'), 'OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw', 10);

tracker.title.each(([title]) =>
    console.log('new title:', title));
tracker.summary.each(lines => {
    console.log('new summary:');
    lines.forEach(line => console.log(line));
});
tracker.progerss.each(lines => {
    console.log('new progerss:');
    lines.forEach(line => console.log(line));
});
tracker.messages.each(lines => {
    console.log('new messages:');
    lines.forEach(line => console.log(line));
});

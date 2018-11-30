#!/usr/bin/env node

const path = require('path');
const dwytpl = require('../src/index');

let tracker = dwytpl(path.resolve(__dirname, '../downloads'), 'OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw', 10);

let splitPrinter = new dwytpl.SplitPrinter(1, 2, 10, 30);

tracker.title.each(titleLines =>
    splitPrinter.titleLines = titleLines);
tracker.summary.each(summaryLines =>
    splitPrinter.summaryLines = summaryLines);
tracker.progerss.each(progressLines =>
    splitPrinter.progressLines = progressLines);
tracker.messages.each(messageLines =>
    splitPrinter.messageLines = messageLines);

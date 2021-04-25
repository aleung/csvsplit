#!/usr/bin/env node

"use strict";

import { createWriteStream, createReadStream } from 'fs';
import { join } from 'path';
import csv from 'csv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import _ from 'lodash';

let header;

const outputs = new Map();

const argv = yargs(hideBin(process.argv))
    .parserConfiguration({ 'boolean-negation': false })
    .usage('Usage: $0 [options] <inputfiles>')
    .example('$0 -c 2 -o ./output ./input/*.csv',
        'Process all CSV files and split base on the 2nd column')
    .option('c', {
        alias: 'column',
        demand: true,
        describe: 'The index of column base which to split (A=1, B=2 ...)',
        type: 'number'
    })
    .option('f', {
        alias: 'filter',
        describe: 'If set, only when the column value is in this list will be outputed. Configure with a comma seperated list of values.',
        type: 'string'
    })
    .option('o', {
        alias: 'output',
        describe: 'Directory to put generated files into',
        default: './',
        type: 'string'
    })
    .option('no-header', {
        describe: 'The input CSV file has no header',
        default: false,
        type: 'boolean'
    })
    .help('help')
    .version()
    .demand(1)
    .argv;

// string => ( {string, record} => void )
function writeTo(destPath) {
    return ({ fileIndex, record }) => {
        if (!fileIndex) {
            return;
        }
        if (!outputs.has(fileIndex)) {
            const p = join(destPath, `${fileIndex}.csv`);
            console.log('Output file:', p);
            const output = createWriteStream(p);
            output.on('error', (err) => {
                console.error(`Unable to write to output file "${p}". Does the output direcotry exist?`);
                console.error(err);
                process.exit(1);
            });
            outputs.set(fileIndex, output);
            csv.stringify([header], (err, s) => {
                if (!err) {
                    output.write(s);
                }
            });
        }
        csv.stringify([record], (err, s) => {
            if (err) {
                return console.error(err);
            }
            outputs.get(fileIndex).write(s);
        });
    }
}

// number => (record => {string, record})
function groupBy(columnIndex) {
    console.log('Group output by column ', columnIndex);
    return (record) => {
        let fileIndex = record[columnIndex - 1];
        return { fileIndex, record };
    }
}

// string => ({string, record} => {string, record})
function filterWith(allowedList) {
    const allows = allowedList && allowedList.split(',');
    if (allowedList) {
        console.log('Filter column value within', allows);
    }
    return ({ fileIndex, record }) => {
        if (!allowedList || allows.includes(fileIndex)) {
            return { fileIndex, record };
        } else {
            return {};
        }
    };
}

const processRecord = _.flow([
    groupBy(argv.c),
    filterWith(argv.f),
    writeTo(argv.o)
]);

const parser = csv.parse();

parser.on('error', (err) => {
    console.error('Unable to parse the input file(s). Is it in valid CSV format?');
    console.error(err);
    exit(1);
});

parser.on('readable', () => {
    let record;
    while (record = parser.read()) {
        if (!argv.noHeader && header === undefined) {
            header = record
        } else {
            processRecord(record);
        }
    }
});

argv._.forEach((file) => {
    console.log('Input file: ', file);
    header = undefined;
    createReadStream(file).pipe(parser);
});

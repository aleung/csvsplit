"use strict";

const fs = require('fs');
const path = require('path');
const csv = require('csv');
const yargs = require('yargs');
const _ = require('lodash');

let header;

const outputs = new Map();

const argv = yargs
    .usage(`Usage:
        node index.js [options] <inputfiles>

    Example:
        node index.js -c 2 -o ../output ../input/*.csv`)
    .option('c', {
        alias: 'column',
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
    .help('help')
    .argv;

// string => ( {string, record} => void )
function writeTo(destPath) {
    return ({fileIndex, record}) => {
        if (!fileIndex) {
            return;
        }
        if (!header) {
            header = record;
        }
        if (!outputs.has(fileIndex)) {
            const p = path.join(destPath, `${fileIndex}.csv`);
            const output = fs.createWriteStream(p);
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
        return {fileIndex, record};
    }
}

// string => ({string, record} => {string, record})
function filterWith(allowedList) {
    const allows = allowedList && allowedList.split(',');
    if (allowedList) {
        console.log('Filter column value within', allows);
    }
    return ({fileIndex, record}) => {
        if (!allowedList || allows.includes(fileIndex)) {
            return {fileIndex, record};
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
    console.error(err);
});

parser.on('readable', () => {
    let record;
    while (record = parser.read()) {
        processRecord(record);
    }
});


argv._.forEach((file) => {
    console.log('Load file: ', file);
    fs.createReadStream(file).pipe(parser);
});

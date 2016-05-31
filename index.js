"use strict";

const fs = require('fs');
const path = require('path');
const csv = require('csv');
const yargs = require('yargs');

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
    .option('o', {
        alias: 'output',
        describe: 'Directory to put generated files into',
        type: 'string'
    })
    .help('help')
    .argv;

function writeTo(destPath) {
    return (fileIndex, record) => {
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

function groupBy(columnIndex, writeTo) {
    console.log('Group output by column ', columnIndex);
    return (record) => {
        let fileIndex = record[columnIndex - 1];
        writeTo(fileIndex, record);
    }
}

const write = groupBy(argv.c, writeTo(argv.o));

const parser = csv.parse();

parser.on('error', (err) => {
    console.error(err);
});

parser.on('readable', () => {
    let record;
    while (record = parser.read()) {
        write(record);
    }
});


argv._.forEach((file) => {
    console.log('Load file: ', file);
    fs.createReadStream(file).pipe(parser);
});

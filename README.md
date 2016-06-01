# CSV Split

[![npm version](https://img.shields.io/npm/v/@aleung/csvsplit.svg?maxAge=2592000)](https://www.npmjs.com/package/@aleung/csvsplit)

CLI utility to split CSV into multiples files base on value of a specified column.

## Feature

You have one or more data sheets. You want to split data into files and each one groups the records which have same value in a column.

> input.csv

| id | name | group |
|----|------|-------|
| 1  | Alice | A    |
| 2  | Bob   | B    |
| 3  | Charley | A  |
| 4  | David | B     |

Being processed with __csvsplit__, base on value of column `group`, it becomes:

> A.csv

| id | name | group |
|----|------|-------|
| 1  | Alice | A    |
| 3  | Charley | A  |

> B.csv

| id | name | group |
|----|------|-------|
| 2  | Bob   | B    |
| 4  | David | B    |

It's able to process multiple input files. No need to combile them beforehead.

## Install

This tool runs on node.js execution environment. If node.js hasn't been
installed on your OS, download from [Node.js official site](https://nodejs.org/en/download/current/)
and install it.

On command line, type `node --version` to make sure node.js has been
installed properly. Node.js v6.0 or higher is required.

Install CSV split:

    npm install @aleung/csvsplit

It runs on any OS platform that node.js supports.

## Usage

```
$ csvsplit --help
Usage: /usr/local/bin/csvsplit [options] <inputfiles>

Options:
  -c, --column  The index of column base which to split (A=1, B=2 ...)                        [number] [required]
  -f, --filter  If set, only when the column value is in this list will be outputed. Configure with a comma
                seperated list of values.                                                                [string]
  -o, --output  Directory to put generated files into                                    [string] [default: "./"]
  --help        Show help                                                                               [boolean]
  --version     Show version number                                                                     [boolean]

Examples:
  /usr/local/bin/csvsplit -c 2 -o ./output ./input/*.csv  Process all CSV files and split base on the 2nd column

```

The generated csv files are named into the value of the column base on which to split.

There might be an extra csv file generated, in which contains only the header.
Just delete it.

If you get "Too many open files" issue, try to use `--filter` option to limit the number of generated files.

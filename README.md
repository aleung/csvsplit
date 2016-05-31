## Install on Windows

This tool runs on node.js execution environment. If node.js hasn't been
installed on your Windows, download [node.js](https://nodejs.org/en/download/current/)
and install it.

Open cmd window, type `node --version` to make sure node.js has been
installed properly.

Download `csvsplit.zip` from [latest release](https://github.com/aleung/csvsplit/releases/latest) and extra it.

## Usage

Open cmd window, cd into the folder where you extra the package.

```
C:\tmp\csvsplit> node index.js --help
Usage:
        node index.js [options] <inputfiles>

    Example:
        node index.js -c 2 -f 101761,191001,121001 -o C:\tmp\output C:\tmp\input\*.csv

Options:
  -c, --column  The index of column base which to split (A=1, B=2 ...)  [number]
  -f, --filter  If set, only when the column value is in this list will be
                outputed. Configure with a comma seperated list of values.
                                                                        [string]
  -o, --output  Directory to put generated files into   [string] [default: "./"]
  --help        Show help                                              [boolean]
```

The generated csv files are named into the value of the column base which to split.

There will be an extra csv file generated, in which contains only the header.
Just delete it.

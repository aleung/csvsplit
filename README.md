## Install on Windows

This tool runs on node.js execution environment. If node.js hasn't been
installed on your Windows, download [node.js](https://nodejs.org/en/download/current/)
and install it.

Open cmd windows, type `node --version` to make sure node.js has been
installed properly.

Download the package and extra it into an empty folder, e.g. `C:\tmp\csvsplit`.

## Usage

Open cmd windows, cd into the folder where you extra the package. 

```
C:\tmp\csvsplit> node index.js --help
Usage:
        node index.js [options] <inputfiles>

    Example:
        node index.js -c 2 -o ../output ../input/*.csv

Options:
  -c, --column  The index of column base which to split. (A=1, B=2 ...) [number]
  -o, --output  Directory to put generated files into                   [string]
  --help        Show help                                              [boolean]
```

The generated csv files are named into the value of the column base which to split.

There will be an extra csv file generated, in which contains only the header.
Just delete it.

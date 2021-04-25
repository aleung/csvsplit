
import { execSync } from 'child_process';
import { tmpdir } from 'os';
import { mkdtempSync } from 'fs';
import { sep } from 'path';
import { compareSync } from 'dir-compare';

//const tmpDir = './output' 
const tmpDir = tmpdir();

function test(name, options, input, expectedOutput) {
    const outputDir = mkdtempSync(`${tmpDir}${sep}`);
    const cmd = `node index.js -o ${outputDir} ${options} ${input}`;
    console.log(`Test ${name}: ${cmd}`);

    const log = execSync(cmd, { timeout: 1000 * 60 });
    const result = compareSync(outputDir, expectedOutput, { compareContent: true });
    if (!result.same) {
        throw new Error(`Result not identical.  Expected ${expectedOutput}, output ${outputDir}. Log: ${log.toString()}`);
    }
}

try {
    test('split', '-c 3', 'test/input-1.csv', 'test/split');
    test('filter', '-c 3 -f A,B', 'test/input-1.csv', 'test/with-filter');
    test('no-header', '-c 3 --no-header', 'test/input-no-header.csv', 'test/no-header');
} catch (err) {
    console.error('Test failed.', err.message);
    process.exit(1);
}

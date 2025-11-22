
const parseFunction = (str, funcName) => {
    const startIndex = str.indexOf(funcName + '(');
    if (startIndex === -1) return null;

    let openParen = 0;
    let args = [];
    let currentArg = '';
    let endIndex = -1;

    // Start scanning after 'funcName('
    for (let i = startIndex + funcName.length + 1; i < str.length; i++) {
        const char = str[i];
        if (char === '(') {
            openParen++;
            currentArg += char;
        } else if (char === ')') {
            if (openParen === 0) {
                args.push(currentArg);
                endIndex = i;
                break;
            } else {
                openParen--;
                currentArg += char;
            }
        } else if (char === ',' && openParen === 0) {
            args.push(currentArg);
            currentArg = '';
        } else {
            currentArg += char;
        }
    }

    if (endIndex === -1) return null; // Malformed

    return {
        match: str.substring(startIndex, endIndex + 1),
        args: args,
        startIndex: startIndex,
        endIndex: endIndex
    };
};

const test = (expr) => {
    console.log(`Testing: ${expr}`);
    // Simulate replacements
    let evalStr = expr.replace(/\^/g, '**');
    console.log(`After replace: ${evalStr}`);

    const parsed = parseFunction(evalStr, 'integral');
    if (parsed) {
        console.log('Parsed:', parsed);
        console.log('Args:', parsed.args);
    } else {
        console.log('Parse failed (null)');
    }

    const parsedDiff = parseFunction(evalStr, 'diff');
    if (parsedDiff) {
        console.log('Parsed Diff:', parsedDiff);
        console.log('Args:', parsedDiff.args);
    }
};

test('integral(2^2,0,1)');
test('diff(2^2,2)');

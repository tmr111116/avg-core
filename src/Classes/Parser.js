
export default class Parser {
    constructor(options={}) {

        this.reset();
    }
    load(data) {
        this.reset();
        this.data = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '').split('\n');

        let resources = this.resources;
        let reg = new RegExp(/["']{1}(.+?\.(png|jpg|jpeg|webp))["']{1}/g);
        let result = reg.exec(data);
        while (result) {
            resources.push(result[1]);
            result = reg.exec(data);
        }
    }
    reset() {
        this.data = [];
        this.currentLine = 0;
        this.resources = [];
    }

    getResources() {
        return this.resources;
    }

    getCurrentLine() {
        return this.currentLine;
    }
    setCurrentLine(line) {
        this.currentLine = line;
    }

    [Symbol.iterator]() {
        return this;
    }
    next() {
        if (this.currentLine < this.data.length) {
            let line = this.data[this.currentLine++];
            return { value: parse(line), done: false };
        } else {
            return { done: true };
        }
    }
}

export function parse(line) {
    let valid;
    [line, valid] = getContent(line);

    if (!valid) {
        return {
            command: '*',
            flags: [],
            params: {
                raw: getValue(`"${line.replace(/"/g, '࿉')}"`).replace(/࿉/g, '"')
            }
        };
    }

    if (line.search(/^(([a-zA-Z_]+\d*)(=((\S+?)|(["'`].*?["'`]))+)?\s*)+?$/) === -1) {
        throw 'Wrong script.';
    }

    let lineMatch = line.match(/^(.*?["'`].*?)(\s+)(.*?["'`].*?)$/);
    while (lineMatch) {
        // character `࿉`: Tibetan, a piece of treasure...
        line = `${lineMatch[1]}${'࿉'.repeat(lineMatch[2].length)}${lineMatch[3]}`;
        lineMatch = line.match(/^(.*?["'`].*?)(\s+)(.*?["'`].*?)$/);
    }

    // handle multi-space
    let statements = line.replace(/\s+/g, ' ').split(' ');

    let result = {
        command: '',
        flags: [],
        params: {}
    };
    let iterator = statements.entries();
    result.command = iterator.next().value[1];

    for (let [i, statement] of iterator) {
        let ret = parseStatement(statement.replace(/࿉/g, ' '));
        if (ret.length > 1) {
            result.params[ret[0].toLowerCase()] = ret[1];
        } else {
            result.flags.push(ret[0].toLowerCase())
        }
    }

    return result;

}

function getContent(line) {
    line = line.trim();
    if (line.startsWith('@')) {
        return [line.substr(1), true];
    } else if (line.startsWith('[') && line.endsWith(']')) {
        return [line.substr(1, line.length - 2), true];
    } else {
        return [line, false];
    }
}

function parseStatement(statement) {
    if (statement.search(/^[A-Za-z_]+\d*\=/) !== -1) {
        // ex. foo="bar"
        let contents = statement.split('=', 2);
        return [contents[0], getValue(contents[1])];
    } else {
        // ex. [action foo]
        return [statement];
    }
}

function getValue(valueString) {
    try {
        let ret = new Function(`return ${valueString}`);
        return ret();
    } catch (e) {
        throw `Invalid value '${valueString}'`
    }

}

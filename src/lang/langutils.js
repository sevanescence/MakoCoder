const fs = require('fs');
const { execSync } = require('child_process');

/** @param {string} content @return {string[]} */
const getCodeBlocks = (content) => {
    let arr = [];
    content = content.replace(/```(.|\n|\r\n)+?```/g, (match) => {
        arr.push(match);
        return '';
    });
    return arr;
};

/** @param {string} codeBlockBuf */
const getCodeBlockStripped = (codeBlockBuf) => {
    return codeBlockBuf.match(/(?<=```)[a-zA-Z0-9.-_]+?\n((.|\n|\r\n)+?)(?=(\n)?```)/)[1];
};

/** @param {string} codeBlockBuf */
const getCodeBlockHeader = (codeBlockBuf) => {
    return codeBlockBuf.match(/(?<=```)[a-zA-Z0-9.-_]+?(?=\n)/)[0];
};

class BlockMeta {
    constructor() {
        this.header = '';
        this.content = '';
    }
    /** @param {string} blockbuf */
    static resolve(blockbuf) {
        const blockMeta = new BlockMeta();
        blockMeta.header = getCodeBlockHeader(blockbuf);
        blockMeta.content = getCodeBlockStripped(blockbuf);
        return blockMeta;
    }
}

class ProgramMeta {
    constructor() {
        this.language = '';
        this.code = '';
        /** @type {BlockMeta[]} */
        this.blocks = new Array();
    }
    /**
     *
     * @param {string} content
     * @return {ProgramMeta}
     */
    static resolve(content) {
        const programMeta = new ProgramMeta();

        const blockarr = getCodeBlocks(content);
        const codebuf = blockarr.shift();
        programMeta.language = getCodeBlockHeader(codebuf);
        programMeta.code = getCodeBlockStripped(codebuf);
        blockarr.forEach((blockbuf) => {
            programMeta.blocks.push(BlockMeta.resolve(blockbuf));
        });

        return programMeta;
    }
}

// I tried to define these file references as dirents,
// however the NodeJS filesystem documentation is
// absolutely bereft of any clear instruction. My next
// approach is to log the prototype of fs.Dirent myself,
// but guess what I get? Nothing. Empty JSON. What?
// But I digress, these hard coded constant strings
// will suffice until I refactor the bot to Typescript,
// if I do.
const GET_CODE_DIRENT = (ext) => {
    return { name: `a.${ext}` };
};
const STDOUT_DIRENT = { name: 'a.out' };
const STDERR_DIRENT = { name: 'a.err' };

// Note: dynamic STDIN and argv will not be implemented
// until after compilation and runtime are implemented,
// just to save myself time.

/**
 * Compile language code of session. No file dirent
 * is needed because file nameing is consistent.
 * @param {string} dir Session directory
 * @param {LanguageMeta} language
 * @return {Promise<Buffer>}
 */
async function compile(dir, language) {
    const pipe_buf = execSync(language.compile_args, { cwd: dir });
    return pipe_buf;
}

/**
 * Execute compiled code of session. No file dirent
 * is needed because file nameing is consistent.
 * This can be called on interpreted/JIT-compiled
 * languages directly.
 * @param {string} dir Session directory
 * @param {LanguageMeta} language
 * @return {Promise<Buffer>}
 */
async function run(dir, language) {
    const pipe_buf = execSync(language.run_args, { cwd: dir });
    return pipe_buf;
}

class LanguageMeta {
    compiled = true;
    compile_args = '';
    run_args = '';
}

// Will keep the framework simple for the time being,
// plan to implement dynamic arguments in the future.
// And yes, I am aware that JavaScript is also a
// compiled language (to be specific, most JavaScript
// engines implement a JIT compiler system), but you
// know exactly what the context is, so unless you think
// "compiledViaAssemblyAndLinkage" is a good variable name,
// then you can agree that "compiled" is a perfectly fine
// variable name to evaluate the compilation meta of a
// language. :)

// todo: declare compile arguments definable in .env
const languages = {
    /**
     * @param {string} lang
     * @return {LanguageMeta} */
    getLanguage(lang) {
        const languageMeta = languages[lang];
        if (languageMeta) return languageMeta;
        else throw 'Language not found.';
    },
    c: {
        compiled: true,
        compile_args: 'gcc -o a a.c -std=gnu11',
        run_args: 'a',
    },
    cpp: {
        compiled: true,
        compile_args: 'g++ -o a a.cpp -std=gnu++17',
        run_args: 'a',
    },
};

module.exports = { ProgramMeta, languages, compile, run };

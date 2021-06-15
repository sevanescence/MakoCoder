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

const languages = {
    c: {
        compile() {},
        run() {},
    },
    cpp: {
        compile() {},
        run() {},
    },
};

module.exports = { ProgramMeta, languages };

/**
 * @author Taahir Suleman
 * @class EndIf
 * @description Represents the end of an if block in the AST.
 * @property {number} line - The line number where the end of the if block is located.
 */
class EndIf {
    /**
     * @constructor
     * @param {number} line - The line number where the 'end if' is located.
     */
    constructor(line) {
        this.type = "EndIf";
        this.line = line; // Line number in the source code where the 'end if' occurs
    }
}

export default EndIf;

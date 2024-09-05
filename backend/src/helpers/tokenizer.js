import {
    KeywordStrategy,
    NumberStrategy,
    StringStrategy,
    BooleanStrategy,
    DelimiterStrategy,
    OperatorStrategy,
    ComparisonOperatorStrategy,
    LogicalOperatorStrategy,
} from "./TokenizationStrategies.js";

/**
 * Tokenizer class responsible for tokenizing pseudocode into individual tokens.
 */
class Tokenizer {
    /**
     * Constructs a new Tokenizer instance.
     * @param {string} pseudocode - The pseudocode to tokenize.
     */
    constructor(pseudocode) {
        this.pseudocode = pseudocode;
        this.pseudocodeLines = pseudocode.split("\n"); // Split the pseudocode by lines
        this.currentIndex = 0;
        this.line = 1;
        this.strategies = this.createStrategies();
    }

    /**
     * Creates a dictionary of strategies for different token types.
     * @returns {Object} A dictionary mapping token types to their strategies.
     */
    createStrategies() {
        return {
            letter: new KeywordStrategy(),
            digit: new NumberStrategy(),
            string: new StringStrategy(),
            boolean: new BooleanStrategy(),
            delimiter: new DelimiterStrategy(),
            operator: new OperatorStrategy(),
            comparisonOperator: new ComparisonOperatorStrategy(),
            logicalOperator: new LogicalOperatorStrategy(),
        };
    }

    /**
     * Tokenizes the entire pseudocode into an array of tokens.
     * @returns {Array<Object>} Array of tokens.
     */
    tokenize() {
        const tokens = [];
        while (this.currentIndex < this.pseudocode.length) {
            const char = this.pseudocode[this.currentIndex];

            if (this.isWhitespace(char)) {
                this.consumeWhitespace();
            } else if (this.isLetter(char)) {
                const lookahead = this.peekNextWord().toLowerCase();
                if (lookahead === "true" || lookahead === "false") {
                    tokens.push(this.strategies.boolean.apply(this));
                } else if (["and", "or", "not"].includes(lookahead)) {
                    // Check for logical operators
                    tokens.push(this.strategies.logicalOperator.apply(this)); // Use the new strategy
                } else {
                    tokens.push(this.strategies.letter.apply(this));
                }
            } else if (this.isDigit(char)) {
                tokens.push(this.strategies.digit.apply(this));
            } else if (char === '"') {
                tokens.push(this.strategies.string.apply(this));
            } else if (this.isDelimiter(char)) {
                tokens.push(this.strategies.delimiter.apply(this));
            } else if (this.isOperator(char)) {
                tokens.push(this.strategies.operator.apply(this));
            } else if (this.isComparisonOperator(char)) {
                tokens.push(this.strategies.comparisonOperator.apply(this));
            } else if (char === "\n") {
                this.line++;
                this.currentIndex++;
            } else {
                throw new Error(
                    `Unexpected character: ${char} at line ${this.line}`
                );
            }
        }
        return tokens;
    }

    /**
     * Checks if the character is a whitespace.
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is a whitespace, false otherwise.
     */
    isWhitespace(char) {
        return /\s/.test(char) || char === ";"; // Treat semicolons as whitespace
    }

    /**
     * Consumes whitespace characters, advancing the tokenizer's currentIndex.
     */
    consumeWhitespace() {
        while (
            this.currentIndex < this.pseudocode.length &&
            this.isWhitespace(this.pseudocode[this.currentIndex])
        ) {
            if (this.pseudocode[this.currentIndex] === "\n") {
                this.line++;
            }
            this.currentIndex++;
        }
    }

    /**
     * Checks if the character is a letter.
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is a letter, false otherwise.
     */
    isLetter(char) {
        return /[a-zA-Z_]/.test(char);
    }

    /**
     * Checks if the character is a digit.
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is a digit, false otherwise.
     */
    isDigit(char) {
        return /\d/.test(char);
    }

    /**
     * Checks if the character is a delimiter.
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is a delimiter, false otherwise.
     */
    isDelimiter(char) {
        return ["[", "]", "(", ")", ","].includes(char);
    }

    /**
     * Checks if the character is an operator.
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is an operator, false otherwise.
     */
    isOperator(char) {
        return ["+", "-", "*", "/"].includes(char);
    }

    /**
     * Checks if the character is a comparison operator.
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is a comparison operator, false otherwise.
     */
    isComparisonOperator(char) {
        return (
            [">", "<", "="].includes(char) ||
            (char === ">" && this.pseudocode[this.currentIndex + 1] === "=") ||
            (char === "<" && this.pseudocode[this.currentIndex + 1] === "=")
        );
    }

    /**
     * Consumes a keyword or identifier from the pseudocode.
     * @returns {Object} The token representing the keyword or identifier.
     */
    consumeIdentifierOrKeyword() {
        let value = "";
        while (
            this.currentIndex < this.pseudocode.length &&
            (this.isLetter(this.pseudocode[this.currentIndex]) ||
                this.isDigit(this.pseudocode[this.currentIndex]))
        ) {
            value += this.pseudocode[this.currentIndex];
            this.currentIndex++;
        }

        const keywords = [
            "loop",
            "from",
            "until",
            "set",
            "to",
            "number",
            "string",
            "substring",
            "of",
            "boolean",
            "create",
            "array",
            "size",
            "values",
            "element",
            "as",
            "with",
            "insert",
            "add",
            "at",
            "position",
            "print",
            "display",
            "show",
            "if",
            "then",
            "otherwise",
            "end",
            "define",
            "parameters",
            "call",
            "for",
            "each",
            "in",
            "while",
            "return",
            "function",
            "is",
            "greater",
            "less",
            "equal",
            "than",
            "length",
            "character",
            "otherwiseif",
            "remove",
            "delete",
            // New combined keywords can be added here if needed
        ];
        if (value.toLowerCase() === "set") {
            if (
                String(this.pseudocodeLines[this.line - 1])
                    .toLowerCase()
                    .includes("set element")
            )
                value = "set_array";
        } else if (value.toLowerCase() === "element") {
            if (
                String(this.pseudocodeLines[this.line - 1])
                    .toLowerCase()
                    .includes("element at")
            )
                value = "character"; // treat array indexing the same as substring - making it transparent for the subsequent stages while allowing differentiation within the SPL between 'ELEMENT AT' for arrays and 'CHARACTER AT' for strings.
        }
        if (value.toLowerCase() === "else") value = "otherwise";
        else if (value.toLowerCase() === "add") value = "insert";
        else if (value.toLowerCase() === "delete") value = "remove";
        if (value.toLowerCase() === "otherwise") {
            let lookaheadSpace = this.peekNextWord();
            let lookahead = this.peekNextWord();
            if (
                String(this.pseudocodeLines[this.line - 1])
                    .toLowerCase()
                    .includes("otherwise if") ||
                String(this.pseudocodeLines[this.line - 1])
                    .toLowerCase()
                    .includes("else if")
            ) {
                this.consumeWhitespace(); // Consume any space between 'otherwise' and 'if'
                for (let i = 0; i < lookahead.length; i++) {
                    // Move currentIndex past 'if'
                    this.currentIndex++;
                }
                console.log("after " + value);
                value += "if"; // Combine 'otherwise' and 'if' to 'otherwise if'
            }
        }

        if (
            value.toLowerCase() === "display" ||
            value.toLowerCase() === "show"
        ) {
            value = "print";
        }

        // Check if the next word might form a recognized keyword combination
        if (value.toLowerCase() === "for") {
            let peekValue = this.peekNextWord();
            if (peekValue.toLowerCase() === "loop") {
                for (let i = 0; i < peekValue.length; i++) {
                    // Move currentIndex past 'loop'
                    this.currentIndex++;
                }
                value += " " + peekValue; // Combine 'for' and 'loop' to 'for loop'
            }
        }

        if (
            keywords.includes(value.toLowerCase()) ||
            value.toLowerCase() === "otherwiseif"
        ) {
            return {
                type: "Keyword",
                value: value.toLowerCase(),
                line:
                    value.toLowerCase() === "otherwise"
                        ? this.line - 1
                        : this.line,
            };
        } else {
            return { type: "Identifier", value, line: this.line };
        }
    }

    /**
     * Consumes a numeric literal from the pseudocode.
     * @returns {Object} The token representing the numeric literal.
     */
    consumeNumber() {
        let value = "";
        while (
            this.currentIndex < this.pseudocode.length &&
            this.isDigit(this.pseudocode[this.currentIndex])
        ) {
            value += this.pseudocode[this.currentIndex];
            this.currentIndex++;
        }
        return { type: "Number", value, line: this.line };
    }

    /**
     * Consumes a string literal from the pseudocode.
     * @returns {Object} The token representing the string literal.
     */
    consumeString() {
        let str = "";
        this.currentIndex++; // Skip the initial quote
        while (this.currentIndex < this.pseudocode.length) {
            const char = this.pseudocode[this.currentIndex];
            if (char === '"') {
                this.currentIndex++;
                return { type: "String", value: str, line: this.line };
            } else if (char === "\n" || char === "\r") {
                throw new Error(
                    `Unexpected character: ${char} at line ${this.line}`
                );
            } else {
                str += char;
            }
            this.currentIndex++;
        }
        throw new Error(`Unexpected end of string at line ${this.line}`);
    }

    /**
     * Consumes a boolean literal from the pseudocode.
     * @returns {Object} The token representing the boolean literal.
     */
    consumeBoolean() {
        const startIndex = this.currentIndex;
        let value = "";

        while (
            this.currentIndex < this.pseudocode.length &&
            this.isLetter(this.pseudocode[this.currentIndex])
        ) {
            value += this.pseudocode[this.currentIndex];
            this.currentIndex++;
        }

        if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
            return {
                type: "Boolean",
                value: value.toLowerCase(),
                line: this.line,
            };
        } else {
            // Reset the index if it's not a boolean literal and let other strategies handle it
            this.currentIndex = startIndex;
            return this.consumeIdentifierOrKeyword();
        }
    }

    /**
     * Consumes a delimiter from the pseudocode.
     * @returns {Object} The token representing the delimiter.
     */
    consumeDelimiter() {
        const char = this.pseudocode[this.currentIndex];
        this.currentIndex++;
        return { type: "Delimiter", value: char, line: this.line };
    }

    /**
     * Consumes an operator character from the pseudocode.
     * @returns {Object} The token representing the operator.
     */
    consumeOperator() {
        const char = this.pseudocode[this.currentIndex];
        this.currentIndex++;
        return { type: "Operator", value: char, line: this.line };
    }

    /**
     * Consumes a comparison operator from the pseudocode.
     * @returns {Object} The token representing the comparison operator.
     */
    consumeComparisonOperator() {
        const char = this.pseudocode[this.currentIndex];
        let value = char;
        this.currentIndex++;

        // Check if the next character forms a multi-character operator
        if (
            (char === ">" || char === "<" || char === "=" || char === "!") &&
            this.pseudocode[this.currentIndex] === "="
        ) {
            value += "=";
            this.currentIndex++;
        }

        return { type: "ComparisonOperator", value, line: this.line };
    }

    /**
     * Peeks at the next word in the pseudocode without consuming it.
     * @returns {string} The next word in the pseudocode.
     */
    peekNextWord() {
        let nextWord = "";
        let tempIndex = this.currentIndex;
        this.consumeWhitespace();
        while (
            tempIndex < this.pseudocode.length &&
            this.isLetter(this.pseudocode[tempIndex])
        ) {
            nextWord += this.pseudocode[tempIndex];
            tempIndex++;
        }
        return nextWord;
    }
}

export default Tokenizer;

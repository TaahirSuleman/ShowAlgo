class Tokenizer {
    constructor(pseudocode) {
        this.pseudocode = pseudocode;
        this.currentIndex = 0;
        this.line = 1;
    }

    tokenize() {
        const tokens = [];
        while (this.currentIndex < this.pseudocode.length) {
            const char = this.pseudocode[this.currentIndex];

            if (this.isWhitespace(char)) {
                this.consumeWhitespace();
            } else if (this.isLetter(char)) {
                tokens.push(this.consumeIdentifierOrKeyword());
            } else if (this.isDigit(char)) {
                tokens.push(this.consumeNumber());
            } else if (char === '"') {
                tokens.push(this.consumeString());
            } else if (this.isDelimiter(char)) {
                tokens.push(this.consumeDelimiter());
            } else if (this.isOperator(char)) {
                tokens.push(this.consumeOperator());
            } else if (this.isComparisonOperator(char)) {
                tokens.push(this.consumeComparisonOperator());
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

    isWhitespace(char) {
        return /\s/.test(char);
    }

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

    isLetter(char) {
        return /[a-zA-Z_]/.test(char);
    }

    isDigit(char) {
        return /\d/.test(char);
    }

    isDelimiter(char) {
        return ["[", "]", "(", ")", ","].includes(char);
    }

    isOperator(char) {
        return ["+", "-", "*", "/"].includes(char);
    }

    isComparisonOperator(char) {
        return (
            [">", "<", "="].includes(char) ||
            (char === ">" && this.pseudocode[this.currentIndex + 1] === "=") ||
            (char === "<" && this.pseudocode[this.currentIndex + 1] === "=")
        );
    }

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
            "create",
            "array",
            "as",
            "with",
            "insert",
            "at",
            "position",
            "print",
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
            // New combined keywords can be added here if needed
        ];

        // Check if the next word might form a recognized keyword combination
        if (value.toLowerCase() === "for") {
            let peekValue = this.peekNextWord();
            if (peekValue.toLowerCase() === "loop") {
                this.consumeWhitespace(); // Consume any space between 'for' and 'loop'
                for (let i = 0; i < peekValue.length; i++) {
                    // Move currentIndex past 'loop'
                    this.currentIndex++;
                }
                value += " " + peekValue; // Combine 'for' and 'loop' to 'for loop'
            }
        }

        if (keywords.includes(value.toLowerCase())) {
            return {
                type: "Keyword",
                value: value.toLowerCase(),
                line: this.line,
            };
        } else {
            return { type: "Identifier", value, line: this.line };
        }
    }

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

    consumeDelimiter() {
        const char = this.pseudocode[this.currentIndex];
        this.currentIndex++;
        return { type: "Delimiter", value: char, line: this.line };
    }

    consumeOperator() {
        const char = this.pseudocode[this.currentIndex];
        this.currentIndex++;
        return { type: "Operator", value: char, line: this.line };
    }

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

    // Helper method to peek next word without consuming it
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

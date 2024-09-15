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
 * The Tokenizer class is responsible for converting a string of pseudocode into
 * individual tokens, which can then be processed by a parser or interpreter.
 * It breaks down the pseudocode into components like keywords, operators, delimiters,
 * identifiers, numbers, strings, booleans, and other symbols, ensuring proper syntax
 * for further stages of code analysis.
 *
 * This class manages the current index of parsing, keeps track of the line number, and
 * provides helper methods to consume and identify various types of tokens.
 *
 * @author Taahir Suleman
 */
class Tokenizer {
    /**
     * Constructs a new Tokenizer instance to process the provided pseudocode.
     * Initializes the necessary properties, such as the pseudocode string,
     * the list of pseudocode lines, the current index for parsing, and the line number.
     * Also sets up the tokenization strategies for different types of tokens.
     *
     * @param {string} pseudocode - The pseudocode to tokenize, represented as a string.
     */
    constructor(pseudocode) {
        this.pseudocode = pseudocode;
        this.pseudocodeLines = pseudocode.split("\n"); // Split the pseudocode by lines
        this.currentIndex = 0; // Tracks the current position within the pseudocode string
        this.line = 1; // Tracks the current line number for error reporting and token positioning
        this.strategies = this.createStrategies(); // Initializes the tokenization strategies
    }

    /**
     * Creates a dictionary of tokenization strategies for different token types.
     * These strategies handle the tokenization process for specific types of tokens,
     * such as keywords, numbers, strings, booleans, delimiters, operators, etc.
     *
     * @returns {Object} A dictionary that maps different token categories (letters, digits, etc.)
     *                   to their respective tokenization strategy classes.
     */
    createStrategies() {
        return {
            letter: new KeywordStrategy(), // Handles keyword and identifier tokens
            digit: new NumberStrategy(), // Handles numeric tokens
            string: new StringStrategy(), // Handles string literal tokens
            boolean: new BooleanStrategy(), // Handles boolean literal tokens
            delimiter: new DelimiterStrategy(), // Handles delimiters such as parentheses and commas
            operator: new OperatorStrategy(), // Handles basic operators like +, -, *, /, %
            comparisonOperator: new ComparisonOperatorStrategy(), // Handles comparison operators like <, >, ==
            logicalOperator: new LogicalOperatorStrategy(), // Handles logical operators like and, or
        };
    }

    /**
     * Tokenizes the entire pseudocode into an array of tokens.
     * Iterates through each character in the pseudocode and applies the appropriate
     * tokenization strategy based on the character type (whitespace, comment, letter, digit, etc.).
     * Handles logical operators, booleans, comparison operators, and delimiters as well.
     *
     * @returns {Array<Object>} Array of token objects, each containing information about the token type, value, and line number.
     * @throws {Error} If an unexpected character is encountered during tokenization.
     */
    tokenize() {
        const tokens = [];
        while (this.currentIndex < this.pseudocode.length) {
            const char = this.pseudocode[this.currentIndex];

            if (this.isWhitespace(char)) {
                this.consumeWhitespace(); // Skips over whitespace characters
            } else if (this.pseudocode.startsWith("//", this.currentIndex)) {
                // Skip the comment line when "//" is detected
                this.skipComment();
            } else if (this.isLetter(char)) {
                const lookahead = this.peekNextWord().toLowerCase();
                if (lookahead === "true" || lookahead === "false") {
                    // Handle boolean literals (true/false)
                    tokens.push(this.strategies.boolean.apply(this));
                } else if (["and", "or", "not"].includes(lookahead)) {
                    // Handle logical operators (and, or)
                    tokens.push(this.strategies.logicalOperator.apply(this));
                } else {
                    // Handle keywords and identifiers
                    tokens.push(this.strategies.letter.apply(this));
                }
            } else if (this.isDigit(char)) {
                // Handle numeric literals
                tokens.push(this.strategies.digit.apply(this));
            } else if (char === '"') {
                // Handle string literals enclosed in double quotes
                tokens.push(this.strategies.string.apply(this));
            } else if (this.isDelimiter(char)) {
                // Handle delimiters such as parentheses, commas, etc.
                tokens.push(this.strategies.delimiter.apply(this));
            } else if (this.isOperator(char)) {
                // Handle basic operators like +, -, *, /
                tokens.push(this.strategies.operator.apply(this));
            } else if (this.isComparisonOperator(char)) {
                // Handle comparison operators like <, >, ==
                tokens.push(this.strategies.comparisonOperator.apply(this));
            } else if (char === "\n") {
                // Handle new line characters, update the line count
                this.line++;
                this.currentIndex++;
            } else {
                // Throw an error for unexpected characters
                throw new Error(
                    `Unexpected character: ${char} at line ${this.line}`
                );
            }
        }
        return tokens; // Return the array of tokens
    }

    /**
     * Checks if the character is a whitespace.
     * Whitespace includes spaces, tabs, and newlines. Semicolons are also treated as whitespace.
     *
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is a whitespace or semicolon, false otherwise.
     */
    isWhitespace(char) {
        return /\s/.test(char) || char === ";"; // Treat semicolons as whitespace
    }

    /**
     * Consumes consecutive whitespace characters and advances the tokenizer's current index.
     * Increments the line number if a newline character is encountered during this process.
     */
    consumeWhitespace() {
        while (
            this.currentIndex < this.pseudocode.length &&
            this.isWhitespace(this.pseudocode[this.currentIndex])
        ) {
            if (this.pseudocode[this.currentIndex] === "\n") {
                this.line++; // Update the line count on encountering a newline
            }
            this.currentIndex++; // Advance to the next character
        }
    }

    /**
     * Checks if the character is a letter.
     * Letters include uppercase and lowercase alphabetic characters as well as underscores, which are often used in identifiers.
     *
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is a letter or underscore, false otherwise.
     */
    isLetter(char) {
        return /[a-zA-Z_]/.test(char); // Matches alphabetic characters and underscores
    }

    /**
     * Checks if the character is a digit.
     * A digit is any numeric character from 0 to 9.
     *
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is a digit, false otherwise.
     */
    isDigit(char) {
        return /\d/.test(char); // Matches numeric characters (0-9)
    }

    /**
     * Checks if the character is a delimiter.
     * Delimiters include characters used for grouping or separating expressions, such as parentheses and commas.
     *
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is a delimiter (e.g., parentheses, brackets, commas), false otherwise.
     */
    isDelimiter(char) {
        return ["[", "]", "(", ")", ","].includes(char); // Checks for common delimiters
    }

    /**
     * Checks if the character is an operator.
     * Operators include mathematical symbols such as +, -, *, /, and % used in arithmetic expressions.
     *
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is an operator, false otherwise.
     */
    isOperator(char) {
        return ["+", "-", "*", "/", "%"].includes(char); // Checks for arithmetic operators
    }

    /**
     * Checks if the character is a comparison operator.
     * Comparison operators include >, <, and =, along with their combinations for greater-than-or-equal-to (>=) and less-than-or-equal-to (<=).
     * This method also checks the lookahead character to determine if the operator is part of a combined operator (e.g., >= or <=).
     *
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is a comparison operator (>, <, ==, >=, <=), false otherwise.
     */
    isComparisonOperator(char) {
        return (
            [">", "<", "=", "!"].includes(char) || // Basic comparison operators
            (char === ">" && this.pseudocode[this.currentIndex + 1] === "=") || // Greater-than-or-equal-to (>=)
            (char === "<" && this.pseudocode[this.currentIndex + 1] === "=") ||
            (char === "=" && this.pseudocode[this.currentIndex + 1] === "=") || // Equality check (==)
            (char === "!" && this.pseudocode[this.currentIndex + 1] === "=") // Inequality check (!=) // Less-than-or-equal-to (<=)
        );
    }

    /**
     * Consumes a keyword or identifier from the pseudocode.
     * This method processes letters and digits to form either a recognized keyword
     * or an identifier. It handles keyword combinations (e.g., 'otherwise if') and
     * certain keyword transformations for consistency in later stages of processing.
     *
     * @returns {Object} A token representing the keyword or identifier.
     *                   If the value is a recognized keyword, the token type is 'Keyword',
     *                   otherwise, it is 'Identifier'.
     */
    consumeIdentifierOrKeyword() {
        let value = "";

        // Build up the identifier or keyword by consuming letters and digits
        while (
            this.currentIndex < this.pseudocode.length &&
            (this.isLetter(this.pseudocode[this.currentIndex]) ||
                this.isDigit(this.pseudocode[this.currentIndex]))
        ) {
            value += this.pseudocode[this.currentIndex];
            this.currentIndex++;
        }

        // List of recognized keywords in the pseudocode language
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
            "swap",
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
            "element",
            "otherwiseif",
            "remove",
            "delete",
        ];

        // Handle special cases for certain keywords like "set" and "element"
        if (value.toLowerCase() === "set") {
            if (
                String(this.pseudocodeLines[this.line - 1])
                    .toLowerCase()
                    .includes("set element") &&
                !/set element\s+to/i.test(
                    String(this.pseudocodeLines[this.line - 1])
                )
            )
                value = "set_array"; // Special case for array operations
        } else if (value.toLowerCase() === "element") {
            if (
                String(this.pseudocodeLines[this.line - 1])
                    .toLowerCase()
                    .includes("element at") &&
                !String(this.pseudocodeLines[this.line - 1])
                    .toLowerCase()
                    .includes("set element") &&
                !/set element\s+to/i.test(
                    String(this.pseudocodeLines[this.line - 1])
                )
            )
                value = "character"; // Treats array indexing like substrings
        }

        // Alias certain keywords for internal consistency while allowing different forms of the same operation in the SPL
        if (value.toLowerCase() === "else") value = "otherwise";
        else if (value.toLowerCase() === "add") value = "insert";
        else if (value.toLowerCase() === "delete") value = "remove";

        // Combine 'otherwise' and 'if' to 'otherwise if' if needed
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
                this.consumeWhitespace(); // Skip any space between 'otherwise' and 'if'
                for (let i = 0; i < lookahead.length; i++) {
                    this.currentIndex++; // Move past 'if'
                }
                value += "if"; // Combine into 'otherwise if'
            }
        }

        // Alias 'display' and 'show' to 'print'
        if (
            value.toLowerCase() === "display" ||
            value.toLowerCase() === "show"
        ) {
            value = "print";
        }

        // Handle keyword combinations like 'for loop'
        if (value.toLowerCase() === "for") {
            let peekValue = this.peekNextWord();
            if (peekValue.toLowerCase() === "loop") {
                for (let i = 0; i < peekValue.length; i++) {
                    this.currentIndex++; // Move past 'loop'
                }
                value += " " + peekValue; // Combine into 'for loop'
            }
        }

        // Check if the value is a recognized keyword or a valid identifier
        if (
            keywords.includes(value.toLowerCase()) ||
            value.toLowerCase() === "otherwiseif"
        ) {
            return {
                type: "Keyword",
                value: value.toLowerCase(),
                line:
                    value.toLowerCase() === "otherwise"
                        ? this.line - 1 // Adjust line for 'otherwise'
                        : this.line,
            };
        } else {
            // If it's not a keyword, treat it as an identifier
            return { type: "Identifier", value, line: this.line };
        }
    }

    /**
     * Consumes a numeric literal from the pseudocode.
     * This method reads characters until a non-digit is encountered and constructs a token
     * representing the numeric literal.
     *
     * @returns {Object} The token representing the numeric literal with type 'Number' and the current line number.
     */
    consumeNumber() {
        let value = "";
        // Loop through the pseudocode to collect digits
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
     * This method handles the parsing of string literals by consuming characters between
     * double quotes. It raises an error if the string is not properly closed or if a newline is encountered.
     *
     * @returns {Object} The token representing the string literal with type 'String' and the current line number.
     * @throws {Error} If the string is not properly closed or an unexpected newline is found.
     */
    consumeString() {
        let str = "";
        this.currentIndex++; // Skip the initial opening quote
        // Loop through the pseudocode to collect the string contents
        while (this.currentIndex < this.pseudocode.length) {
            const char = this.pseudocode[this.currentIndex];
            if (char === '"') {
                this.currentIndex++; // Skip the closing quote
                return { type: "String", value: str, line: this.line };
            } else if (char === "\n" || char === "\r") {
                // Raise an error if the string contains a newline without being closed
                throw new Error(
                    `Unexpected character: ${char} at line ${this.line}`
                );
            } else {
                str += char; // Append the character to the string
            }
            this.currentIndex++;
        }
        // Raise an error if the string is not properly closed by the end of the pseudocode
        throw new Error(`Unexpected end of string at line ${this.line}`);
    }

    /**
     * Consumes a boolean literal from the pseudocode.
     * This method handles the tokenization of boolean values ('true' or 'false').
     * It raises an error if the consumed value is not a valid boolean.
     *
     * @returns {Object} The token representing the boolean literal with type 'Boolean' and the current line number.
     */
    consumeBoolean() {
        const startIndex = this.currentIndex;
        let value = "";

        // Loop through the pseudocode to collect letters that form a boolean literal
        while (
            this.currentIndex < this.pseudocode.length &&
            this.isLetter(this.pseudocode[this.currentIndex])
        ) {
            value += this.pseudocode[this.currentIndex];
            this.currentIndex++;
        }

        // Check if the collected value is 'true' or 'false'
        if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
            return {
                type: "Boolean",
                value: value.toLowerCase(),
                line: this.line,
            };
        } else {
            // If not a valid boolean, reset the index and let other strategies handle it
            this.currentIndex = startIndex;
            return this.consumeIdentifierOrKeyword();
        }
    }

    /**
     * Consumes a delimiter from the pseudocode.
     * This method extracts a single character delimiter, such as parentheses, brackets, or commas.
     *
     * @returns {Object} The token representing the delimiter with type 'Delimiter' and the current line number.
     */
    consumeDelimiter() {
        const char = this.pseudocode[this.currentIndex];
        this.currentIndex++; // Move past the delimiter
        return { type: "Delimiter", value: char, line: this.line };
    }

    /**
     * Consumes an operator character from the pseudocode.
     * This method extracts a single character operator, such as '+', '-', '*', '/', or '%'.
     *
     * @returns {Object} The token representing the operator with type 'Operator' and the current line number.
     */
    consumeOperator() {
        const char = this.pseudocode[this.currentIndex];
        this.currentIndex++; // Move past the operator
        return { type: "Operator", value: char, line: this.line };
    }

    /**
     * Consumes a comparison operator from the pseudocode.
     * This method handles both single-character comparison operators (e.g., '>', '<') and
     * multi-character operators (e.g., '>=', '<=', '==', '!=').
     *
     * @returns {Object} The token representing the comparison operator with type 'ComparisonOperator' and the current line number.
     */
    consumeComparisonOperator() {
        const char = this.pseudocode[this.currentIndex];
        let value = char; // Store the first character
        this.currentIndex++; // Move past the first character

        // Check for multi-character comparison operators (e.g., '>=', '<=', '==', '!=')
        if (
            (char === ">" || char === "<" || char === "=" || char === "!") &&
            this.pseudocode[this.currentIndex] === "="
        ) {
            value += "="; // Add the '=' to form the complete operator
            this.currentIndex++; // Move past the second character
        }

        return { type: "ComparisonOperator", value, line: this.line };
    }

    /**
     * Peeks at the next word in the pseudocode without consuming it.
     * This method temporarily advances the index to look at the upcoming word in the pseudocode,
     * without altering the current position of the tokenizer.
     *
     * @returns {string} The next word in the pseudocode. This word is composed of consecutive letter characters.
     */
    peekNextWord() {
        let nextWord = "";
        let tempIndex = this.currentIndex;
        this.consumeWhitespace(); // Skip any whitespace before the next word
        while (
            tempIndex < this.pseudocode.length &&
            this.isLetter(this.pseudocode[tempIndex])
        ) {
            nextWord += this.pseudocode[tempIndex]; // Build the next word
            tempIndex++; // Move to the next character
        }
        return nextWord;
    }

    /**
     * Skips over a comment line that starts with "//".
     * This method advances the tokenizer's index until it encounters a newline character,
     * effectively skipping the entire comment line from where the comment began.
     */
    skipComment() {
        while (
            this.currentIndex < this.pseudocode.length &&
            this.pseudocode[this.currentIndex] !== "\n"
        ) {
            this.currentIndex++; // Move past the comment characters
        }
    }
}

export default Tokenizer;

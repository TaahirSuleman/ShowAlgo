import { expect } from "chai";
import Tokenizer from "../src/helpers/tokenizer.js";

describe("Tokenizer", () => {
    function tokenize(input) {
        const tokenizer = new Tokenizer(input);
        return tokenizer.tokenize();
    }

    it("should tokenize a basic indexing operation", () => {
        const code = `Set firstCharacter to character at 0 of myString`;
        const tokens = tokenize(code);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "firstCharacter", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Keyword", value: "character", line: 1 },
            { type: "Keyword", value: "at", line: 1 },
            { type: "Number", value: "0", line: 1 },
            { type: "Keyword", value: "of", line: 1 },
            { type: "Identifier", value: "myString", line: 1 },
        ]);
    });

    it("should tokenize indexing with a variable index", () => {
        const code = `Set characterAtIndex to character at index of myString`;
        const tokens = tokenize(code);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "characterAtIndex", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Keyword", value: "character", line: 1 },
            { type: "Keyword", value: "at", line: 1 },
            { type: "Identifier", value: "index", line: 1 },
            { type: "Keyword", value: "of", line: 1 },
            { type: "Identifier", value: "myString", line: 1 },
        ]);
    });

    it("should tokenize indexing at the end of the string", () => {
        const code = `Set lastCharacter to character at length of myString - 1 of myString`;
        const tokens = tokenize(code);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "lastCharacter", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Keyword", value: "character", line: 1 },
            { type: "Keyword", value: "at", line: 1 },
            { type: "Keyword", value: "length", line: 1 },
            { type: "Keyword", value: "of", line: 1 },
            { type: "Identifier", value: "myString", line: 1 },
            { type: "Operator", value: "-", line: 1 },
            { type: "Number", value: "1", line: 1 },
            { type: "Keyword", value: "of", line: 1 },
            { type: "Identifier", value: "myString", line: 1 },
        ]);
    });

    it("should tokenize indexing with a negative index", () => {
        const code = `Set invalidCharacter to character at -1 of myString`;
        const tokens = tokenize(code);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "invalidCharacter", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Keyword", value: "character", line: 1 },
            { type: "Keyword", value: "at", line: 1 },
            { type: "Operator", value: "-", line: 1 },
            { type: "Number", value: "1", line: 1 },
            { type: "Keyword", value: "of", line: 1 },
            { type: "Identifier", value: "myString", line: 1 },
        ]);
    });

    it("should tokenize indexing an empty string", () => {
        const code = `Set emptyIndex to character at 0 of emptyString`;
        const tokens = tokenize(code);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "emptyIndex", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Keyword", value: "character", line: 1 },
            { type: "Keyword", value: "at", line: 1 },
            { type: "Number", value: "0", line: 1 },
            { type: "Keyword", value: "of", line: 1 },
            { type: "Identifier", value: "emptyString", line: 1 },
        ]);
    });

    // Additional test cases for traditional syntax
    it("should tokenize traditional syntax for a basic indexing operation", () => {
        const code = `Set firstCharacter to character at 0 of myString`;
        const tokens = tokenize(code);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "firstCharacter", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Keyword", value: "character", line: 1 },
            { type: "Keyword", value: "at", line: 1 },
            { type: "Number", value: "0", line: 1 },
            { type: "Keyword", value: "of", line: 1 },
            { type: "Identifier", value: "myString", line: 1 },
        ]);
    });

    it("should tokenize traditional syntax for indexing with a variable index", () => {
        const code = `Set characterAtIndex to character at index of myString`;
        const tokens = tokenize(code);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "characterAtIndex", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Keyword", value: "character", line: 1 },
            { type: "Keyword", value: "at", line: 1 },
            { type: "Identifier", value: "index", line: 1 },
            { type: "Keyword", value: "of", line: 1 },
            { type: "Identifier", value: "myString", line: 1 },
        ]);
    });

    it("should tokenize a LENGTH OF operation followed by a print statement correctly", () => {
        const pseudocode = `
            SET greeting TO string "Good Morning"
            SET greetingLength TO LENGTH OF greeting
            PRINT greetingLength
        `;
        const tokens = tokenize(pseudocode);

        const expectedTokens = [
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "greeting", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "string", line: 2 },
            { type: "String", value: "Good Morning", line: 2 },
            { type: "Keyword", value: "set", line: 3 },
            { type: "Identifier", value: "greetingLength", line: 3 },
            { type: "Keyword", value: "to", line: 3 },
            { type: "Keyword", value: "length", line: 3 },
            { type: "Keyword", value: "of", line: 3 },
            { type: "Identifier", value: "greeting", line: 3 },
            { type: "Keyword", value: "print", line: 4 },
            { type: "Identifier", value: "greetingLength", line: 4 },
        ];

        expect(tokens).to.deep.equal(expectedTokens);
    });

    // Test case 3: LENGTH OF operation with an undeclared variable
    it("should tokenize a LENGTH OF operation with an undeclared variable correctly", () => {
        const pseudocode = `
            SET nameLength TO LENGTH OF unknownVariable
        `;
        const tokens = tokenize(pseudocode);

        const expectedTokens = [
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "nameLength", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "length", line: 2 },
            { type: "Keyword", value: "of", line: 2 },
            { type: "Identifier", value: "unknownVariable", line: 2 },
        ];

        expect(tokens).to.deep.equal(expectedTokens);
    });

    it("should tokenize a LENGTH OF operation correctly", () => {
        const pseudocode = `
            SET fullName TO string "John Doe"
            SET len TO LENGTH OF fullName
            PRINT len
        `;
        const tokens = tokenize(pseudocode);

        const expectedTokens = [
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "fullName", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "string", line: 2 },
            { type: "String", value: "John Doe", line: 2 },
            { type: "Keyword", value: "set", line: 3 },
            { type: "Identifier", value: "len", line: 3 },
            { type: "Keyword", value: "to", line: 3 },
            { type: "Keyword", value: "length", line: 3 },
            { type: "Keyword", value: "of", line: 3 },
            { type: "Identifier", value: "fullName", line: 3 },
            { type: "Keyword", value: "print", line: 4 },
            { type: "Identifier", value: "len", line: 4 },
        ];

        expect(tokens).to.deep.equal(expectedTokens);
    });

    it("should tokenize a basic substring operation", () => {
        const input = `
            SET subStr TO substring of myString from 7 to 12
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "subStr", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "substring", line: 2 },
            { type: "Keyword", value: "of", line: 2 },
            { type: "Identifier", value: "myString", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Number", value: "7", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Number", value: "12", line: 2 },
        ]);
    });

    it("should tokenize a substring operation with variable indices", () => {
        const input = `
            SET subStr TO substring of myString from startIndex to endIndex
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "subStr", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "substring", line: 2 },
            { type: "Keyword", value: "of", line: 2 },
            { type: "Identifier", value: "myString", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Identifier", value: "startIndex", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Identifier", value: "endIndex", line: 2 },
        ]);
    });

    it("should tokenize a substring operation with zero-based index", () => {
        const input = `
            SET subStr TO substring of myString from 0 to 5
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "subStr", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "substring", line: 2 },
            { type: "Keyword", value: "of", line: 2 },
            { type: "Identifier", value: "myString", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Number", value: "0", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Number", value: "5", line: 2 },
        ]);
    });

    it("should tokenize a substring operation with the same start and end indices", () => {
        const input = `
            SET subStr TO substring of myString from 3 to 3
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "subStr", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "substring", line: 2 },
            { type: "Keyword", value: "of", line: 2 },
            { type: "Identifier", value: "myString", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Number", value: "3", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Number", value: "3", line: 2 },
        ]);
    });

    it("should tokenize a substring operation with negative indices", () => {
        const input = `
            SET subStr TO substring of myString from -3 to -1
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "subStr", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "substring", line: 2 },
            { type: "Keyword", value: "of", line: 2 },
            { type: "Identifier", value: "myString", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Operator", value: "-", line: 2 },
            { type: "Number", value: "3", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Operator", value: "-", line: 2 },
            { type: "Number", value: "1", line: 2 },
        ]);
    });

    it("should tokenize a substring operation with a start index only", () => {
        const input = `
            SET subStr TO substring of myString from 5
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "subStr", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "substring", line: 2 },
            { type: "Keyword", value: "of", line: 2 },
            { type: "Identifier", value: "myString", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Number", value: "5", line: 2 },
        ]);
    });

    it("should tokenize a substring operation followed by another operation", () => {
        const input = `
            SET subStr TO substring of myString from 5 to 10
            PRINT subStr
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "subStr", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "substring", line: 2 },
            { type: "Keyword", value: "of", line: 2 },
            { type: "Identifier", value: "myString", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Number", value: "5", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Number", value: "10", line: 2 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "Identifier", value: "subStr", line: 3 },
        ]);
    });

    it("should tokenize substring operation correctly", () => {
        const input = `
            SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM 7 TO 12
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "myString", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Keyword", value: "string", line: 2 },
            { type: "String", value: "Hello, World!", line: 2 },
            { type: "Keyword", value: "set", line: 3 },
            { type: "Identifier", value: "subStr", line: 3 },
            { type: "Keyword", value: "to", line: 3 },
            { type: "Keyword", value: "substring", line: 3 },
            { type: "Keyword", value: "of", line: 3 },
            { type: "Identifier", value: "myString", line: 3 },
            { type: "Keyword", value: "from", line: 3 },
            { type: "Number", value: "7", line: 3 },
            { type: "Keyword", value: "to", line: 3 },
            { type: "Number", value: "12", line: 3 },
        ]);
    });

    it("should tokenize mixed logical operators correctly", () => {
        const input = `
            SET isTrue TO true
            IF isTrue AND NOT isFalse THEN 
                PRINT "Correct" 
            OTHERWISE 
                PRINT "Incorrect" 
            END IF
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "isTrue", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Boolean", value: "true", line: 2 },
            { type: "Keyword", value: "if", line: 3 },
            { type: "Identifier", value: "isTrue", line: 3 },
            { type: "LogicalOperator", value: "and", line: 3 },
            { type: "LogicalOperator", value: "not", line: 3 },
            { type: "Identifier", value: "isFalse", line: 3 },
            { type: "Keyword", value: "then", line: 3 },
            { type: "Keyword", value: "print", line: 4 },
            { type: "String", value: "Correct", line: 4 },
            { type: "Keyword", value: "otherwise", line: 5 },
            { type: "Keyword", value: "print", line: 6 },
            { type: "String", value: "Incorrect", line: 6 },
            { type: "Keyword", value: "end", line: 7 },
            { type: "Keyword", value: "if", line: 7 },
        ]);
    });

    it("should tokenize boolean literals correctly", () => {
        const input = "SET isTrue TO true\nSET isFalse TO false";
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "isTrue", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Boolean", value: "true", line: 1 },
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "isFalse", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Boolean", value: "false", line: 2 },
        ]);
    });

    it("should tokenize boolean expressions correctly", () => {
        const input = `
            SET isTrue TO true
            SET isFalse TO false
            IF isTrue AND isFalse THEN PRINT "Both are booleans" END IF
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "isTrue", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Boolean", value: "true", line: 2 },
            { type: "Keyword", value: "set", line: 3 },
            { type: "Identifier", value: "isFalse", line: 3 },
            { type: "Keyword", value: "to", line: 3 },
            { type: "Boolean", value: "false", line: 3 },
            { type: "Keyword", value: "if", line: 4 },
            { type: "Identifier", value: "isTrue", line: 4 },
            { type: "LogicalOperator", value: "and", line: 4 },
            { type: "Identifier", value: "isFalse", line: 4 },
            { type: "Keyword", value: "then", line: 4 },
            { type: "Keyword", value: "print", line: 4 },
            { type: "String", value: "Both are booleans", line: 4 },
            { type: "Keyword", value: "end", line: 4 },
            { type: "Keyword", value: "if", line: 4 },
        ]);
    });

    it("should tokenize NOT operator correctly", () => {
        const input = `
            SET isTrue TO true
            IF NOT isTrue THEN PRINT "isTrue is false" END IF
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "isTrue", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Boolean", value: "true", line: 2 },
            { type: "Keyword", value: "if", line: 3 },
            { type: "LogicalOperator", value: "not", line: 3 },
            { type: "Identifier", value: "isTrue", line: 3 },
            { type: "Keyword", value: "then", line: 3 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "String", value: "isTrue is false", line: 3 },
            { type: "Keyword", value: "end", line: 3 },
            { type: "Keyword", value: "if", line: 3 },
        ]);
    });
    it("should tokenize boolean comparisons correctly", () => {
        const input = "SET result TO isTrue = false";
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "result", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Identifier", value: "isTrue", line: 1 },
            { type: "ComparisonOperator", value: "=", line: 1 },
            { type: "Boolean", value: "false", line: 1 },
        ]);
    });

    it("should tokenize keywords correctly", () => {
        const input = "SET x TO 10";
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "x", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Number", value: "10", line: 1 },
        ]);
    });

    it("should tokenize identifiers and keywords correctly", () => {
        const input = "define add_numbers with parameters (a, b)";
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "define", line: 1 },
            { type: "Identifier", value: "add_numbers", line: 1 },
            { type: "Keyword", value: "with", line: 1 },
            { type: "Keyword", value: "parameters", line: 1 },
            { type: "Delimiter", value: "(", line: 1 },
            { type: "Identifier", value: "a", line: 1 },
            { type: "Delimiter", value: ",", line: 1 },
            { type: "Identifier", value: "b", line: 1 },
            { type: "Delimiter", value: ")", line: 1 },
        ]);
    });

    it("should tokenize numbers correctly", () => {
        const input = "set num to 12345";
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 1 },
            { type: "Identifier", value: "num", line: 1 },
            { type: "Keyword", value: "to", line: 1 },
            { type: "Number", value: "12345", line: 1 },
        ]);
    });

    it("should tokenize strings correctly", () => {
        const input = 'print "Hello, World!"';
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "print", line: 1 },
            { type: "String", value: "Hello, World!", line: 1 },
        ]);
    });

    it("should tokenize delimiters correctly", () => {
        const input = "create array as nums with [1, 2, 3]";
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "create", line: 1 },
            { type: "Keyword", value: "array", line: 1 },
            { type: "Keyword", value: "as", line: 1 },
            { type: "Identifier", value: "nums", line: 1 },
            { type: "Keyword", value: "with", line: 1 },
            { type: "Delimiter", value: "[", line: 1 },
            { type: "Number", value: "1", line: 1 },
            { type: "Delimiter", value: ",", line: 1 },
            { type: "Number", value: "2", line: 1 },
            { type: "Delimiter", value: ",", line: 1 },
            { type: "Number", value: "3", line: 1 },
            { type: "Delimiter", value: "]", line: 1 },
        ]);
    });

    it("should tokenize operators correctly", () => {
        const input = "return a + b";
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "return", line: 1 },
            { type: "Identifier", value: "a", line: 1 },
            { type: "Operator", value: "+", line: 1 },
            { type: "Identifier", value: "b", line: 1 },
        ]);
    });

    it("should tokenize comparison operators correctly", () => {
        const input = "if a >= b then";
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "if", line: 1 },
            { type: "Identifier", value: "a", line: 1 },
            { type: "ComparisonOperator", value: ">=", line: 1 },
            { type: "Identifier", value: "b", line: 1 },
            { type: "Keyword", value: "then", line: 1 },
        ]);
    });

    it("should handle multiline inputs correctly", () => {
        const input = `
            set x to 10
            print x
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "set", line: 2 },
            { type: "Identifier", value: "x", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Number", value: "10", line: 2 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "Identifier", value: "x", line: 3 },
        ]);
    });

    it("should throw an error for unexpected characters", () => {
        const input = "set x to 10 # invalid character";
        expect(() => tokenize(input)).to.throw(
            "Unexpected character: # at line 1"
        );
    });

    it("should throw an error for unterminated strings", () => {
        const input = 'print "Hello, World';
        expect(() => tokenize(input)).to.throw(
            "Unexpected end of string at line 1"
        );
    });
    it("should tokenize 'LOOP until' syntax correctly", () => {
        const input = `
            LOOP until x is greater than 5
                PRINT x
                SET x to x plus 1
            END LOOP
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "loop", line: 2 },
            { type: "Keyword", value: "until", line: 2 },
            { type: "Identifier", value: "x", line: 2 },
            { type: "Keyword", value: "is", line: 2 },
            { type: "Keyword", value: "greater", line: 2 },
            { type: "Keyword", value: "than", line: 2 },
            { type: "Number", value: "5", line: 2 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "Identifier", value: "x", line: 3 },
            { type: "Keyword", value: "set", line: 4 },
            { type: "Identifier", value: "x", line: 4 },
            { type: "Keyword", value: "to", line: 4 },
            { type: "Identifier", value: "x", line: 4 },
            { type: "Identifier", value: "plus", line: 4 },
            { type: "Number", value: "1", line: 4 },
            { type: "Keyword", value: "end", line: 5 },
            { type: "Keyword", value: "loop", line: 5 },
        ]);
    });

    it("should tokenize 'LOOP UNTIL' syntax correctly", () => {
        const input = `
            LOOP UNTIL x > 5
                PRINT x
                SET x TO x + 1
            END LOOP
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "loop", line: 2 },
            { type: "Keyword", value: "until", line: 2 },
            { type: "Identifier", value: "x", line: 2 },
            { type: "ComparisonOperator", value: ">", line: 2 },
            { type: "Number", value: "5", line: 2 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "Identifier", value: "x", line: 3 },
            { type: "Keyword", value: "set", line: 4 },
            { type: "Identifier", value: "x", line: 4 },
            { type: "Keyword", value: "to", line: 4 },
            { type: "Identifier", value: "x", line: 4 },
            { type: "Operator", value: "+", line: 4 },
            { type: "Number", value: "1", line: 4 },
            { type: "Keyword", value: "end", line: 5 },
            { type: "Keyword", value: "loop", line: 5 },
        ]);
    });

    it("should tokenize 'FOR LOOP from' syntax correctly", () => {
        const input = `
            FOR LOOP from 0 up to 10
                PRINT i
            END LOOP
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "for", line: 2 },
            { type: "Keyword", value: "loop", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Number", value: "0", line: 2 },
            { type: "Identifier", value: "up", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Number", value: "10", line: 2 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "Identifier", value: "i", line: 3 },
            { type: "Keyword", value: "end", line: 4 },
            { type: "Keyword", value: "loop", line: 4 },
        ]);
    });

    it("should tokenize 'LOOP FROM TO' syntax correctly", () => {
        const input = `
            LOOP FROM 0 TO 10
                PRINT i
            END LOOP
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "loop", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Number", value: "0", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Number", value: "10", line: 2 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "Identifier", value: "i", line: 3 },
            { type: "Keyword", value: "end", line: 4 },
            { type: "Keyword", value: "loop", line: 4 },
        ]);
    });

    it("should tokenize 'FOR LOOP until' syntax correctly", () => {
        const input = `
            FOR LOOP until x is greater than 5
                PRINT x
                SET x to x plus 1
            END LOOP
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "for", line: 2 },
            { type: "Keyword", value: "loop", line: 2 },
            { type: "Keyword", value: "until", line: 2 },
            { type: "Identifier", value: "x", line: 2 },
            { type: "Keyword", value: "is", line: 2 },
            { type: "Keyword", value: "greater", line: 2 },
            { type: "Keyword", value: "than", line: 2 },
            { type: "Number", value: "5", line: 2 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "Identifier", value: "x", line: 3 },
            { type: "Keyword", value: "set", line: 4 },
            { type: "Identifier", value: "x", line: 4 },
            { type: "Keyword", value: "to", line: 4 },
            { type: "Identifier", value: "x", line: 4 },
            { type: "Identifier", value: "plus", line: 4 },
            { type: "Number", value: "1", line: 4 },
            { type: "Keyword", value: "end", line: 5 },
            { type: "Keyword", value: "loop", line: 5 },
        ]);
    });

    it("should tokenize 'FOR LOOP UNTIL' syntax correctly", () => {
        const input = `
            FOR LOOP UNTIL x > 5
                PRINT x
                SET x TO x + 1
            END LOOP
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "for", line: 2 },
            { type: "Keyword", value: "loop", line: 2 },
            { type: "Keyword", value: "until", line: 2 },
            { type: "Identifier", value: "x", line: 2 },
            { type: "ComparisonOperator", value: ">", line: 2 },
            { type: "Number", value: "5", line: 2 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "Identifier", value: "x", line: 3 },
            { type: "Keyword", value: "set", line: 4 },
            { type: "Identifier", value: "x", line: 4 },
            { type: "Keyword", value: "to", line: 4 },
            { type: "Identifier", value: "x", line: 4 },
            { type: "Operator", value: "+", line: 4 },
            { type: "Number", value: "1", line: 4 },
            { type: "Keyword", value: "end", line: 5 },
            { type: "Keyword", value: "loop", line: 5 },
        ]);
    });

    it("should tokenize 'FOR LOOP from' syntax correctly", () => {
        const input = `
            FOR LOOP from 0 up to 10
                PRINT i
            END LOOP
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "for", line: 2 },
            { type: "Keyword", value: "loop", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Number", value: "0", line: 2 },
            { type: "Identifier", value: "up", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Number", value: "10", line: 2 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "Identifier", value: "i", line: 3 },
            { type: "Keyword", value: "end", line: 4 },
            { type: "Keyword", value: "loop", line: 4 },
        ]);
    });

    it("should tokenize 'FOR LOOP FROM TO' syntax correctly", () => {
        const input = `
            FOR LOOP FROM 0 TO 10
                PRINT i
            END LOOP
        `;
        const tokens = tokenize(input);
        expect(tokens).to.deep.equal([
            { type: "Keyword", value: "for", line: 2 },
            { type: "Keyword", value: "loop", line: 2 },
            { type: "Keyword", value: "from", line: 2 },
            { type: "Number", value: "0", line: 2 },
            { type: "Keyword", value: "to", line: 2 },
            { type: "Number", value: "10", line: 2 },
            { type: "Keyword", value: "print", line: 3 },
            { type: "Identifier", value: "i", line: 3 },
            { type: "Keyword", value: "end", line: 4 },
            { type: "Keyword", value: "loop", line: 4 },
        ]);
    });
});

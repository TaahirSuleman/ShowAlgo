import { expect } from "chai";
import Tokenizer from "../src/helpers/tokenizer.js";

describe("Tokenizer", () => {
    function tokenize(input) {
        const tokenizer = new Tokenizer(input);
        return tokenizer.tokenize();
    }

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

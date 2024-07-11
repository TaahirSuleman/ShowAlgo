// helpers/tokenizer.js

class Token {
  constructor(type, value, line) {
    this.type = type;
    this.value = value;
    this.line = line;
  }
}

class Tokenizer {
  constructor(code) {
    this.code = code;
    this.currentIndex = 0;
    this.line = 1;
    this.tokens = [];
    this.keywords = [
      "SET",
      "CREATE",
      "IF",
      "ELSE",
      "LOOP",
      "PRINT",
      "END",
      "SWITCH",
      "CASE",
      "OTHERWISE",
      "BREAK",
    ];
    this.operators = [
      "=",
      "+",
      "-",
      "*",
      "/",
      ">",
      "<",
      "==",
      "!=",
      ">=",
      "<=",
    ];
    this.delimiters = ["(", ")", "{", "}", "[", "]", ",", ":"];
    this.whitespace = [" ", "\t"];
  }

  tokenize() {
    while (this.currentIndex < this.code.length) {
      const char = this.code[this.currentIndex];

      if (this.whitespace.includes(char)) {
        this.currentIndex++;
        continue;
      }

      if (char === "\n") {
        this.line++;
        this.currentIndex++;
        continue;
      }

      if (char === "/" && this.code[this.currentIndex + 1] === "/") {
        this.skipComment();
        continue;
      }

      if (char === "#") {
        this.skipComment();
        continue;
      }

      if (this.isDigit(char)) {
        this.tokens.push(this.tokenizeNumber());
        continue;
      }

      if (this.isLetter(char)) {
        this.tokens.push(this.tokenizeIdentifier());
        continue;
      }

      if (this.operators.includes(char)) {
        this.tokens.push(this.tokenizeOperator());
        continue;
      }

      if (this.delimiters.includes(char)) {
        this.tokens.push(new Token("Delimiter", char, this.line));
        this.currentIndex++;
        continue;
      }

      if (char === '"' || char === "'") {
        this.tokens.push(this.tokenizeString(char));
        continue;
      }

      throw new Error(`Unexpected character: ${char} at line ${this.line}`);
    }
    return this.tokens;
  }

  skipComment() {
    while (
      this.currentIndex < this.code.length &&
      this.code[this.currentIndex] !== "\n"
    ) {
      this.currentIndex++;
    }
  }

  isDigit(char) {
    return /\d/.test(char);
  }

  isLetter(char) {
    return /[a-zA-Z]/.test(char);
  }

  tokenizeNumber() {
    let numStr = "";
    while (
      this.currentIndex < this.code.length &&
      this.isDigit(this.code[this.currentIndex])
    ) {
      numStr += this.code[this.currentIndex];
      this.currentIndex++;
    }
    return new Token("Number", numStr, this.line);
  }

  tokenizeIdentifier() {
    let idStr = "";
    while (
      this.currentIndex < this.code.length &&
      (this.isLetter(this.code[this.currentIndex]) ||
        this.isDigit(this.code[this.currentIndex]))
    ) {
      idStr += this.code[this.currentIndex];
      this.currentIndex++;
    }
    if (this.keywords.includes(idStr.toUpperCase())) {
      return new Token("Keyword", idStr.toUpperCase(), this.line);
    }
    return new Token("Identifier", idStr, this.line);
  }

  tokenizeOperator() {
    let opStr = "";
    while (
      this.currentIndex < this.code.length &&
      this.operators.includes(this.code[this.currentIndex])
    ) {
      opStr += this.code[this.currentIndex];
      this.currentIndex++;
    }
    if (this.operators.includes(opStr)) {
      return new Token("Operator", opStr, this.line);
    }
    throw new Error(`Unknown operator: ${opStr} at line ${this.line}`);
  }

  tokenizeString(quoteType) {
    let str = "";
    this.currentIndex++; // Skip the opening quote
    while (
      this.currentIndex < this.code.length &&
      this.code[this.currentIndex] !== quoteType
    ) {
      str += this.code[this.currentIndex];
      this.currentIndex++;
    }
    if (this.code[this.currentIndex] !== quoteType) {
      throw new Error(`Unterminated string at line ${this.line}`);
    }
    this.currentIndex++; // Skip the closing quote
    return new Token("String", str, this.line);
  }
}

export default Tokenizer;

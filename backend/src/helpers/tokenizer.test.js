// helpers/tokenizer.test.js
import Tokenizer from "./tokenizer.js";

function testTokenizer() {
  const sampleCode = `
        SET x to number 7
        SET name to string "Alice"
        IF x is greater than 5 THEN
            PRINT "x is greater than 5"
        OTHERWISE
            PRINT "x is less than or equal to 5"
        END IF
    `;

  const tokenizer = new Tokenizer(sampleCode);
  const tokens = tokenizer.tokenize();

  console.log(JSON.stringify(tokens, null, 2));
}

testTokenizer();

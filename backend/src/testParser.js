// testParser.js
import Tokenizer from "./helpers/tokenizer.js";
import Parser from "./models/parser.js";

// Example pseudocode
const pseudocode = `DEFINE add_numbers WITH PARAMETERS (a, b)
        RETURN a + b
    END FUNCTION

    CREATE array as nums WITH [1, 2, 3, 4, 5]
    SET sum TO CALL add_numbers WITH (2, 3)
    PRINT sum

    FOR each num IN nums
        PRINT num
    END FOR

    SET x TO 10
    WHILE x > 0
        PRINT x
        SET x TO x - 1
    END WHILE`;

try {
  const tokenizer = new Tokenizer(pseudocode);
  const tokens = tokenizer.tokenize();
  console.log("Tokens:", tokens);

  const parser = new Parser(tokens);
  const ast = parser.parse();
  console.log("AST:", JSON.stringify(ast, null, 2));
} catch (error) {
  console.error(`Error: ${error.message}`);
}

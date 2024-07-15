import fs from "fs";
import Tokenizer from "./src/helpers/tokenizer.js";
import Parser from "./src/models/parser.js";
import Transformer from "./src/helpers/transformer.js";

class ExampleUsage {
    static run() {
        const pseudocode = `SET x TO 10
DEFINE add_numbers WITH PARAMETERS (a, b)
    RETURN a + b
END FUNCTION
IF x IS greater THAN 5 THEN
    PRINT "x is greater than 5"
OTHERWISE
    PRINT "x is not greater than 5"
END IF
FOR EACH num IN nums
    PRINT num
END FOR
WHILE x > 0
    PRINT x
    SET x TO x - 1
END WHILE`;

        try {
            // Tokenize the pseudocode
            const tokenizer = new Tokenizer(pseudocode);
            const tokens = tokenizer.tokenize();
            console.log("Tokens:", JSON.stringify(tokens, null, 2));

            // Parse the tokens into an AST
            const parser = new Parser(tokens);
            const ast = parser.parse();
            console.log("AST:", JSON.stringify(ast, null, 2));

            // Transform the AST into optimized JSON IR
            const transformer = new Transformer();
            const optimizedIR = transformer.transform(ast);
            console.log("Optimized IR:", JSON.stringify(optimizedIR, null, 2));

            // Save the IR to a JSON file
            fs.writeFileSync(
                "optimizedIR.json",
                JSON.stringify(optimizedIR, null, 2)
            );
            console.log("Optimized IR has been written to optimizedIR.json");
        } catch (error) {
            console.error("An error occurred:", error.message);
        }
    }
}

ExampleUsage.run();

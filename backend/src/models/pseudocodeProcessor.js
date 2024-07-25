import Tokenizer from "../helpers/tokenizer.js";
import Parser from "./parser.js";
import Transformer from "../helpers/transformer.js";
import JsonConverter from "./JsonConverter.js";

class PseudocodeProcessor {
    static process(pseudocode) {
        const tokenizer = new Tokenizer(pseudocode);
        const tokens = tokenizer.tokenize();
        console.log("Tokens:", tokens);

        const parser = new Parser(tokens);
        const ast = parser.parse();
        console.log("AST:", JSON.stringify(ast, null, 2));

        const transformer = new Transformer();
        const ir = transformer.transform(ast);
        console.log(
            "Intermediate Representation:",
            JSON.stringify(ir, null, 2)
        );

        const jsonConverter = new JsonConverter();
        const finalJson = jsonConverter.transformToFinalJSON(ir);
        console.log("Final JSON:", JSON.stringify(finalJson, null, 2));

        return finalJson;
    }
}

export default PseudocodeProcessor;

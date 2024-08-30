import fs from "fs";
import Tokenizer from "../helpers/tokenizer.js";
import Parser from "./parser.js";
import Transformer from "../helpers/transformer.js";
import JsonConverter from "./JsonConverter.js";

class PseudocodeProcessor {
    static writeToFile(content) {
        fs.appendFileSync("output.txt", content + "\n");
    }

    static process(pseudocode) {
        const tokenizer = new Tokenizer(pseudocode);
        const tokens = tokenizer.tokenize();
        // PseudocodeProcessor.writeToFile(
        //     "Tokens: " + JSON.stringify(tokens, null, 2)
        // );

        const parser = new Parser(tokens);
        const ast = parser.parse();
        // PseudocodeProcessor.writeToFile("AST: " + JSON.stringify(ast, null, 2));

        const transformer = new Transformer();
        const ir = transformer.transform(ast);
        PseudocodeProcessor.writeToFile(
            "Intermediate Representation: " + JSON.stringify(ir, null, 2)
        );

        const jsonConverter = new JsonConverter();
        const finalJson = jsonConverter.transformToFinalJSON(ir);
        PseudocodeProcessor.writeToFile(
            "Final JSON: " + JSON.stringify(finalJson, null, 2)
        );

        return finalJson;
    }
}

export default PseudocodeProcessor;

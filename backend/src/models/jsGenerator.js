import fs from "fs";
import Tokenizer from "../helpers/tokenizer.js";
import Parser from "./parser.js";
import Transformer from "../helpers/transformer.js";
import JavaScriptGenerator from "../helpers/JavaScriptGenerator.js"; // Corrected import

class JSGenerator {
    static convert(pseudocode) {
        const tokenizer = new Tokenizer(pseudocode);
        const tokens = tokenizer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const transformer = new Transformer();
        const ir = transformer.transform(ast);
        const generator = new JavaScriptGenerator(ir);
        const jsCode = generator.generate().trim();
        return jsCode;
    }
}

export default JSGenerator;

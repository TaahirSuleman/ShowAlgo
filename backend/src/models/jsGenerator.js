import fs from "fs";
import Tokenizer from "../helpers/tokenizer.js";
import Parser from "./parser.js";
import Transformer from "../helpers/transformer.js";
import JavaScriptGenerator from "./JavaScriptGenerator.js"; // Corrected import

class JSGenerator {
    static writeToFile(content) {
        fs.appendFileSync("jsOutput.txt", content + "\n");
    }

    static convert(pseudocode) {
        const tokenizer = new Tokenizer(pseudocode);
        const tokens = tokenizer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const transformer = new Transformer();
        const ir = transformer.transform(ast);
        const generator = new JavaScriptGenerator(ir);
        const jsCode = generator.generate().trim();
        JSGenerator.writeToFile("Final JavaScript: " + jsCode);
        return jsCode;
    }
}

export default JSGenerator;

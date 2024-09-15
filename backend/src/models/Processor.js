import fs from "fs";
import Tokenizer from "../helpers/Tokenizer.js";
import Parser from "./Parser.js";
import Transformer from "../helpers/Transformer.js";
import Converter from "./Converter.js"; // Import the Converter base class

class Processor {
    constructor(converter) {
        if (!(converter instanceof Converter)) {
            throw new Error(
                "The provided converter must be an instance of Converter."
            );
        }
        this.converter = converter;
    }

    static writeToFile(filename, content) {
        fs.appendFileSync(filename, content + "\n");
    }

    process(pseudocode, outputFile = "jsOutput.txt") {
        const tokenizer = new Tokenizer(pseudocode);
        const tokens = tokenizer.tokenize();

        const parser = new Parser(tokens);
        const ast = parser.parse();

        Processor.writeToFile(
            outputFile,
            "AST: " + JSON.stringify(ast, null, 2)
        );

        const transformer = new Transformer();
        const ir = transformer.transform(ast);
        Processor.writeToFile(
            outputFile,
            "Intermediate Representation: " + JSON.stringify(ir, null, 2)
        );

        // Use the injected converter to transform the IR into the final output format
        const finalOutput = this.converter.convert(ir);
        Processor.writeToFile(
            outputFile,
            "Final Output: " + JSON.stringify(finalOutput, null, 2)
        );

        return finalOutput;
    }
}

export default Processor;

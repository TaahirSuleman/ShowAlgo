import Tokenizer from "../helpers/Tokenizer.js";
import Parser from "./Parser.js";
import Transformer from "../helpers/Transformer.js";
import Converter from "./Converter.js"; // Import the Converter base class

/**
 * Processor class that handles the entire process of transforming pseudocode
 * into a final output format by tokenizing, parsing, and converting it.
 *
 * @author Taahir Suleman
 */
class Processor {
    /**
     * Constructs a new Processor instance with a specific converter.
     *
     * @param {Converter} converter - An instance of a Converter class, which must implement the `convert` method.
     * @throws {Error} Throws an error if the provided converter is not an instance of the `Converter` class.
     */
    constructor(converter) {
        if (!(converter instanceof Converter)) {
            throw new Error(
                "The provided converter must be an instance of Converter."
            );
        }
        this.converter = converter;
    }

    /**
     * Processes the provided pseudocode by tokenizing, parsing, and converting it to the final output format.
     *
     * @param {string} pseudocode - The pseudocode that needs to be processed.
     * @returns {Object} The final output produced by converting the pseudocode into the desired format.
     */
    process(pseudocode) {
        const tokenizer = new Tokenizer(pseudocode);
        const tokens = tokenizer.tokenize();

        const parser = new Parser(tokens);
        const ast = parser.parse();

        const transformer = new Transformer();
        const ir = transformer.transform(ast);

        // Use the injected converter to transform the IR into the final output format
        const finalOutput = this.converter.convert(ir);

        return finalOutput;
    }
}

export default Processor;

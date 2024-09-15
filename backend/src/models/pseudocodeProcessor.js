import fs from "fs";
import Tokenizer from "../helpers/Tokenizer.js";
import Parser from "./Parser.js";
import Transformer from "../helpers/Transformer.js";
import JsonConverter from "./JsonConverter.js";

/**
 * @author Taahir Suleman
 * @class PseudocodeProcessor
 * @description This class is solely for testing purposes. It processes pseudocode through various stages: tokenizing, parsing, transforming into intermediate representation (IR), and finally converting into a final JSON format.
 * It integrates the Tokenizer, Parser, Transformer, and JsonConverter classes to demonstrate the complete flow of processing pseudocode. This class is used only in pseudocodeProcessor.test.js
 */
class PseudocodeProcessor {
    /**
     * @method process
     * @description Takes pseudocode as input, tokenizes it, parses it into an Abstract Syntax Tree (AST), transforms it into an intermediate representation (IR), and then converts it into a final JSON format.
     * This method ties together the complete pseudocode processing pipeline.
     * @param {string} pseudocode - The pseudocode to be processed.
     * @returns {Object} The final JSON output after processing the pseudocode.
     */
    static process(pseudocode) {
        const tokenizer = new Tokenizer(pseudocode);
        const tokens = tokenizer.tokenize();

        const parser = new Parser(tokens);
        const ast = parser.parse();

        const transformer = new Transformer();
        const ir = transformer.transform(ast);

        const jsonConverter = new JsonConverter();
        const finalJson = jsonConverter.transformToFinalJSON(ir);

        return finalJson;
    }
}

export default PseudocodeProcessor;

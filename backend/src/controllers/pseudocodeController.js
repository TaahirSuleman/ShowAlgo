// controllers/pseudocodeController.js
import Tokenizer from "../helpers/tokenizer.js";
import Parser from "../models/parser.js";

export function parsePseudocode(pseudocode) {
  try {
    // Tokenize the pseudocode
    const tokenizer = new Tokenizer(pseudocode);
    const tokens = tokenizer.tokenize();

    // Parse the tokens to create an AST
    const parser = new Parser(tokens);
    const ast = parser.parse();

    return ast;
  } catch (error) {
    throw new Error(error.message);
  }
}

export function convertPseudocodeToJSON(req, res) {
  const { pseudocode } = req.body;

  try {
    const ast = parsePseudocode(pseudocode);
    res.json(ast);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

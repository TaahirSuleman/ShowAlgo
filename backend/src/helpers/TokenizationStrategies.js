import TokenizationStrategy from "./TokenizationStrategy.js";

/**
 * KeywordStrategy handles the tokenization of keywords and identifiers.
 */
class KeywordStrategy extends TokenizationStrategy {
    apply(tokenizer) {
        return tokenizer.consumeIdentifierOrKeyword();
    }
}

/**
 * NumberStrategy handles the tokenization of numeric literals.
 */
class NumberStrategy extends TokenizationStrategy {
    apply(tokenizer) {
        return tokenizer.consumeNumber();
    }
}

/**
 * StringStrategy handles the tokenization of string literals.
 */
class StringStrategy extends TokenizationStrategy {
    apply(tokenizer) {
        return tokenizer.consumeString();
    }
}

/**
 * DelimiterStrategy handles the tokenization of delimiters.
 */
class DelimiterStrategy extends TokenizationStrategy {
    apply(tokenizer) {
        return tokenizer.consumeDelimiter();
    }
}

/**
 * OperatorStrategy handles the tokenization of operators.
 */
class OperatorStrategy extends TokenizationStrategy {
    apply(tokenizer) {
        return tokenizer.consumeOperator();
    }
}

/**
 * ComparisonOperatorStrategy handles the tokenization of comparison operators.
 */
class ComparisonOperatorStrategy extends TokenizationStrategy {
    apply(tokenizer) {
        return tokenizer.consumeComparisonOperator();
    }
}

export {
    KeywordStrategy,
    NumberStrategy,
    StringStrategy,
    DelimiterStrategy,
    OperatorStrategy,
    ComparisonOperatorStrategy,
};

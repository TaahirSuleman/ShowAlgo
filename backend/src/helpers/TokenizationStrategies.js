import TokenizationStrategy from "./TokenizationStrategy.js";

/**
 * KeywordStrategy handles the tokenization of keywords and identifiers.
 *
 * This strategy is responsible for recognizing keywords and identifiers in the pseudocode.
 * It delegates the actual process to the tokenizer's `consumeIdentifierOrKeyword` method.
 *
 * @author Taahir Suleman
 */
class KeywordStrategy extends TokenizationStrategy {
    /**
     * Applies the keyword strategy to the tokenizer.
     *
     * @param {Tokenizer} tokenizer - The tokenizer instance.
     * @returns {Object} The token representing the keyword or identifier.
     */
    apply(tokenizer) {
        return tokenizer.consumeIdentifierOrKeyword();
    }
}

/**
 * NumberStrategy handles the tokenization of numeric literals.
 *
 * This strategy is responsible for recognizing numbers (integers, decimals, etc.)
 * and delegates the process to the tokenizer's `consumeNumber` method.
 *
 * @author Taahir Suleman
 */
class NumberStrategy extends TokenizationStrategy {
    /**
     * Applies the number tokenization strategy to the tokenizer.
     *
     * @param {Tokenizer} tokenizer - The tokenizer instance.
     * @returns {Object} The token representing the numeric literal.
     */
    apply(tokenizer) {
        return tokenizer.consumeNumber();
    }
}

/**
 * StringStrategy handles the tokenization of string literals.
 *
 * This strategy identifies string literals in the pseudocode and uses the tokenizer's
 * `consumeString` method to process them.
 *
 * @author Taahir Suleman
 */
class StringStrategy extends TokenizationStrategy {
    /**
     * Applies the string tokenization strategy to the tokenizer.
     *
     * @param {Tokenizer} tokenizer - The tokenizer instance.
     * @returns {Object} The token representing the string literal.
     */
    apply(tokenizer) {
        return tokenizer.consumeString();
    }
}

/**
 * BooleanStrategy handles the tokenization of boolean literals.
 *
 * This strategy is used for recognizing `true` and `false` boolean literals in the pseudocode.
 * The actual tokenization process is delegated to the tokenizer's `consumeBoolean` method.
 *
 * @author Taahir Suleman
 */
class BooleanStrategy extends TokenizationStrategy {
    /**
     * Applies the boolean tokenization strategy to the tokenizer.
     *
     * @param {Tokenizer} tokenizer - The tokenizer instance.
     * @returns {Object} The token representing the boolean literal.
     */
    apply(tokenizer) {
        return tokenizer.consumeBoolean();
    }
}

/**
 * DelimiterStrategy handles the tokenization of delimiters.
 *
 * This strategy is responsible for identifying delimiters such as parentheses, brackets,
 * commas, etc., and delegates the processing to the tokenizer's `consumeDelimiter` method.
 *
 * @author Taahir Suleman
 */
class DelimiterStrategy extends TokenizationStrategy {
    /**
     * Applies the delimiter tokenization strategy to the tokenizer.
     *
     * @param {Tokenizer} tokenizer - The tokenizer instance.
     * @returns {Object} The token representing the delimiter.
     */
    apply(tokenizer) {
        return tokenizer.consumeDelimiter();
    }
}

/**
 * OperatorStrategy handles the tokenization of operators.
 *
 * This strategy is used for recognizing mathematical  operators such as `+`, `-`, `*`, etc.
 * It delegates the tokenization process to the tokenizer's `consumeOperator` method.
 *
 * @author Taahir Suleman
 */
class OperatorStrategy extends TokenizationStrategy {
    /**
     * Applies the operator tokenization strategy to the tokenizer.
     *
     * @param {Tokenizer} tokenizer - The tokenizer instance.
     * @returns {Object} The token representing the operator.
     */
    apply(tokenizer) {
        return tokenizer.consumeOperator();
    }
}

/**
 * ComparisonOperatorStrategy handles the tokenization of comparison operators.
 *
 * This strategy identifies comparison operators like `>`, `<`, `==`, `!=`, and similar.
 * It uses the tokenizer's `consumeComparisonOperator` method to tokenize them.
 *
 * @author Taahir Suleman
 */
class ComparisonOperatorStrategy extends TokenizationStrategy {
    /**
     * Applies the comparison operator tokenization strategy to the tokenizer.
     *
     * @param {Tokenizer} tokenizer - The tokenizer instance.
     * @returns {Object} The token representing the comparison operator.
     */
    apply(tokenizer) {
        return tokenizer.consumeComparisonOperator();
    }
}

/**
 * LogicalOperatorStrategy handles the tokenization of logical operators.
 *
 * This strategy is responsible for recognizing logical operators such as `and`, `or`. If a valid logical operator is found, it returns the corresponding token.
 * If no logical operator is found, the tokenizer resets and attempts to tokenize
 * the input as an identifier or keyword.
 *
 * @author Taahir Suleman
 */
class LogicalOperatorStrategy extends TokenizationStrategy {
    /**
     * Applies the logical operator tokenization strategy to the tokenizer.
     *
     * @param {Tokenizer} tokenizer - The tokenizer instance.
     * @returns {Object} The token representing the logical operator or an identifier/keyword.
     */
    apply(tokenizer) {
        let value = "";
        const startIndex = tokenizer.currentIndex;

        // Read consecutive letters to form potential logical operator
        while (
            tokenizer.currentIndex < tokenizer.pseudocode.length &&
            tokenizer.isLetter(tokenizer.pseudocode[tokenizer.currentIndex])
        ) {
            value += tokenizer.pseudocode[tokenizer.currentIndex];
            tokenizer.currentIndex++;
        }

        value = value.toLowerCase();

        // Return a logical operator token if recognized
        if (["and", "or", "not"].includes(value)) {
            return {
                type: "LogicalOperator",
                value,
                line: tokenizer.line,
            };
        } else {
            // Reset tokenizer index if it's not a logical operator
            tokenizer.currentIndex = startIndex;
            return tokenizer.consumeIdentifierOrKeyword();
        }
    }
}

export {
    KeywordStrategy,
    NumberStrategy,
    StringStrategy,
    BooleanStrategy,
    DelimiterStrategy,
    OperatorStrategy,
    ComparisonOperatorStrategy,
    LogicalOperatorStrategy,
};

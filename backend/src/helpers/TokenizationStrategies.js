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
 * BooleanStrategy handles the tokenization of boolean literals.
 */
class BooleanStrategy extends TokenizationStrategy {
    apply(tokenizer) {
        return tokenizer.consumeBoolean();
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

class LogicalOperatorStrategy extends TokenizationStrategy {
    apply(tokenizer) {
        let value = "";
        const startIndex = tokenizer.currentIndex;

        while (
            tokenizer.currentIndex < tokenizer.pseudocode.length &&
            tokenizer.isLetter(tokenizer.pseudocode[tokenizer.currentIndex])
        ) {
            value += tokenizer.pseudocode[tokenizer.currentIndex];
            tokenizer.currentIndex++;
        }

        value = value.toLowerCase();

        if (["and", "or", "not"].includes(value)) {
            return {
                type: "LogicalOperator",
                value,
                line: tokenizer.line,
            };
        } else {
            // Reset currentIndex if it’s not a logical operator
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

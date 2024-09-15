/**
 * @class ExpressionEvaluator
 * @description Evaluates expressions in the pseudocode, handles operator precedence, variable lookups, and expression types such as literals, identifiers, and length expressions.
 * @author Taahir Suleman
 */
class ExpressionEvaluator {
    /**
     * @constructor
     * @description Initializes the evaluator with variables and declared variables.
     * @param {Object} variables - The variables and their values.
     * @param {Set} declaredVariables - A set of declared variable names.
     */
    constructor(variables, declaredVariables) {
        this.variables = variables;
        this.declaredVariables = declaredVariables;
    }

    /**
     * @method evaluateExpression
     * @description Evaluates an expression, handling different expression types (e.g., operators, literals, identifiers).
     * @param {Object} expression - The expression to evaluate.
     * @returns {number|string} The evaluated result of the expression.
     * @throws {Error} If an invalid operator is encountered or if variables are undeclared.
     */
    evaluateExpression(expression) {
        if (expression.type === "Expression") {
            const left = this.evaluateExpression(expression.left);
            const right = this.evaluateExpression(expression.right);

            // Handles operator precedence for multiplication and division
            const hasHigherPrecedence = (operator) =>
                operator === "*" || operator === "/";

            if (expression.operator === "+" || expression.operator === "-") {
                // Handles precedence by evaluating higher precedence operators first
                if (
                    typeof expression.left === "object" &&
                    hasHigherPrecedence(expression.left.operator)
                ) {
                    const leftResult = this.evaluateExpression(expression.left);
                    return this.computeExpression(
                        leftResult,
                        expression.operator,
                        right
                    );
                }

                if (
                    typeof expression.right === "object" &&
                    hasHigherPrecedence(expression.right.operator)
                ) {
                    const rightResult = this.evaluateExpression(
                        expression.right
                    );
                    return this.computeExpression(
                        left,
                        expression.operator,
                        rightResult
                    );
                }
            }

            // Regular evaluation without precedence issues
            const result = this.computeExpression(
                left,
                expression.operator,
                right
            );

            if (isNaN(result) && typeof result !== "string") {
                throw new Error(
                    `Ensure that all variables are declared before being used in an expression.`
                );
            }

            return result;
        } else if (this.declaredVariables.has(expression)) {
            // Ensures boolean variables are not used in numeric expressions
            if (typeof this.variables[expression] === "boolean")
                throw new Error(
                    "Booleans cannot be used in numeric expressions"
                );
            else return this.variables[expression];
        } else if (
            expression.type === "NumberLiteral" ||
            expression.type === "StringLiteral"
        ) {
            return this.convertValue(expression.value); // Evaluates literal values
        } else if (expression.type === "Identifier") {
            return this.getVariableValue(expression.value); // Looks up variable values
        } else if (expression.type === "LengthExpression") {
            return this.evaluateLengthExpression(expression); // Evaluates length expressions
        } else if (expression.type === "IndexExpression") {
            return; // Handle index expressions (to be defined later)
        } else {
            return this.convertValue(expression); // Converts non-literal values
        }
    }

    /**
     * @method computeExpression
     * @description Computes a binary expression given the left and right operands and the operator.
     * @param {number|string} left - The left operand.
     * @param {string} operator - The operator (+, -, *, /, %).
     * @param {number|string} right - The right operand.
     * @returns {number} The result of the computation.
     * @throws {Error} If an unknown operator is encountered or division by zero occurs.
     */
    computeExpression(left, operator, right) {
        switch (operator) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "/":
                if (right == 0)
                    throw new Error("Division by zero is not allowed");
                return left / right;
            case "%":
                return left % right;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    }

    /**
     * @method evaluateLengthExpression
     * @description Evaluates a length expression for strings or arrays.
     * @param {Object} expression - The length expression to evaluate.
     * @returns {number} The length of the string or array.
     * @throws {Error} If the source is not a string or array.
     */
    evaluateLengthExpression(expression) {
        const source = expression.source;
        const sourceValue = this.getVariableValue(source);

        if (typeof sourceValue === "string" || Array.isArray(sourceValue)) {
            return sourceValue.length; // Returns the length of the string or array
        } else {
            throw new Error(
                `Cannot compute length for non-string/non-array type: ${source}`
            );
        }
    }

    /**
     * @method convertValue
     * @description Converts a string value to a number if it is numeric; otherwise, returns the original value.
     * @param {string|number} value - The value to convert.
     * @returns {number|string} The converted value.
     */
    convertValue(value) {
        if (typeof value === "string" && value.trim() !== "" && !isNaN(value)) {
            return Number(value); // Converts numeric strings to numbers
        }
        return value; // Returns the original value if no conversion
    }

    /**
     * @method getVariableValue
     * @description Retrieves the value of a declared variable.
     * @param {string} variableName - The name of the variable.
     * @returns {any} The value of the variable.
     * @throws {Error} If the variable is not declared.
     */
    getVariableValue(variableName) {
        if (this.declaredVariables.has(variableName)) {
            return this.variables[variableName];
        } else {
            throw new Error(
                `Variable '${variableName}' is not declared. Ensure that '${variableName}' is declared before it is used.`
            );
        }
    }

    /**
     * @method evaluateCondition
     * @description Evaluates a condition in control structures such as 'if', 'while', or 'loop'. It supports various condition types, including booleans, numbers, strings, identifiers, unary expressions like 'not', and binary expressions involving operators like 'and', 'or', '>', '<', etc.
     * @param {Object|boolean|number|string} condition - The condition to evaluate. Can be a boolean, number, string, or an object representing a complex expression.
     * @returns {boolean|number|string} The evaluated result of the condition.
     * @throws {Error} Throws an error for unknown operators, using 'and'/'or' with non-boolean expressions, or attempting comparison between incompatible types.
     */
    evaluateCondition(condition) {
        // Directly return the condition if it's already a primitive type (boolean, number, or string)
        if (
            typeof condition === "boolean" ||
            typeof condition === "number" ||
            typeof condition === "string"
        ) {
            return condition;
        }

        // Check if the condition is a declared variable
        if (this.declaredVariables.has(condition)) {
            return this.getVariableValue(condition);
        }

        // Handle identifier type conditions
        if (condition.type === "Identifier") {
            if (condition.value) return this.getVariableValue(condition.value);
            else return this.getVariableValue(condition);
        }

        // Handle length expressions
        if (condition.type === "LengthExpression") {
            return this.evaluateLengthExpression(condition);
        }

        // Handle 'not' operator in unary expressions
        if (
            condition.operator === "not" &&
            condition.type === "UnaryExpression"
        ) {
            const right = this.evaluateCondition(condition.argument);
            return this.declaredVariables.has(right)
                ? !this.variables[right]
                : !right;
        } else if (condition.operator === "not") {
            const right = this.evaluateCondition(condition.right);
            return !right;
        }

        // Evaluate the left side of the condition
        const left =
            condition.left && typeof condition.left === "object"
                ? this.evaluateCondition(condition.left)
                : isNaN(condition.left)
                ? this.getVariableValue(condition.left)
                : parseFloat(condition.left);

        // Evaluate the right side of the condition
        const right =
            condition.right && typeof condition.right === "object"
                ? this.evaluateCondition(condition.right)
                : isNaN(condition.right)
                ? this.getVariableValue(condition.right)
                : parseFloat(condition.right);

        // Map condition operators to their logical equivalents
        const operatorsMap = {
            and: "&&",
            or: "||",
            greater: ">",
            less: "<",
            equal: "==",
            "&&": "&&",
            "||": "||",
            ">": ">",
            "<": "<",
            "==": "==",
            "!=": "!=",
            ">=": ">=",
            "<=": "<=",
        };

        const operator = operatorsMap[condition.operator];

        // Throw an error if the operator is unknown
        if (!operator) {
            throw new Error(`Unknown operator: ${condition.operator}`);
        }

        // Switch-case to handle each operator and return the evaluated result
        switch (operator) {
            case "&&":
                if (typeof left != "boolean" || typeof right != "boolean")
                    throw new Error(
                        "Cannot use 'and' with non-boolean expressions on either side."
                    );
                return left && right;
            case "||":
                if (typeof left != "boolean" || typeof right != "boolean")
                    throw new Error(
                        "Cannot use 'or' with non-boolean expressions on either side."
                    );
                return left || right;
            case ">":
                if (typeof left != typeof right)
                    throw new Error(
                        "Using comparison operators with different value types on either side is not allowed."
                    );
                return left > right;
            case "<":
                if (typeof left != typeof right)
                    throw new Error(
                        "Using comparison operators with different value types on either side is not allowed."
                    );
                return left < right;
            case "==":
                if (typeof left != typeof right)
                    throw new Error(
                        "Using comparison operators with different value types on either side is not allowed."
                    );
                return left === right;
            case "!=":
                if (typeof left != typeof right)
                    throw new Error(
                        "Using comparison operators with different value types on either side is not allowed."
                    );
                return left !== right;
            case ">=":
                if (typeof left != typeof right)
                    throw new Error(
                        "Using comparison operators with different value types on either side is not allowed."
                    );
                return left >= right;
            case "<=":
                if (typeof left != typeof right)
                    throw new Error(
                        "Using comparison operators with different value types on either side is not allowed."
                    );
                return left <= right;
            default:
                throw new Error(`The operator ${operator} is not allowed.`);
        }
    }
}

export default ExpressionEvaluator;

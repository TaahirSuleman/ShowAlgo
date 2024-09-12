class ExpressionEvaluator {
    constructor(variables, declaredVariables) {
        this.variables = variables;
        this.declaredVariables = declaredVariables;
    }

    evaluateExpression(expression) {
        if (expression.type === "Expression") {
            const left = this.evaluateExpression(expression.left);
            const right = this.evaluateExpression(expression.right);
            return this.computeExpression(left, expression.operator, right);
        } else if (this.declaredVariables.has(expression)) {
            return this.convertValue(this.variables[expression]);
        } else if (
            expression.type === "NumberLiteral" ||
            expression.type === "StringLiteral"
        ) {
            return this.convertValue(expression.value);
        } else if (expression.type === "Identifier") {
            if (this.declaredVariables.has(expression.value)) {
                return this.variables[expression.value];
            }
        } else if (expression.type === "LengthExpression") {
            return this.evaluateLengthExpression(expression);
        } else if (expression.type === "IndexExpression") return;
        else {
            return this.convertValue(expression);
        }
    }

    computeExpression(left, operator, right) {
        switch (operator) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "/":
                return left / right;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    }

    evaluateLengthExpression(expression) {
        const source = expression.source;
        const sourceValue = this.getVariableValue(source);

        if (typeof sourceValue === "string" || Array.isArray(sourceValue)) {
            return sourceValue.length;
        } else {
            throw new Error(
                `Cannot compute length for non-string/non-array type: ${source}`
            );
        }
    }

    convertValue(value) {
        if (typeof value === "string" && value.trim() !== "" && !isNaN(value)) {
            return Number(value);
        }
        return value;
    }

    getVariableValue(variableName) {
        if (this.declaredVariables.has(variableName)) {
            return this.variables[variableName];
        } else {
            throw new Error(
                `Variable '${variableName}' is not declared. Ensure that '${variableName}' is declared before it is used.`
            );
        }
    }

    evaluateCondition(condition) {
        if (
            typeof condition === "boolean" ||
            typeof condition === "number" ||
            typeof condition === "string"
        ) {
            return condition;
        }

        if (this.declaredVariables.has(condition)) {
            return this.variables[condition];
        }

        if (condition.type === "Identifier") {
            return this.variables[condition.value] || this.variables[condition];
        }

        if (condition.type === "LengthExpression") {
            return this.evaluateLengthExpression(condition);
        }

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

        const left =
            condition.left && typeof condition.left === "object"
                ? this.evaluateCondition(condition.left)
                : isNaN(condition.left)
                ? this.variables[condition.left]
                : parseFloat(condition.left);

        const right =
            condition.right && typeof condition.right === "object"
                ? this.evaluateCondition(condition.right)
                : isNaN(condition.right)
                ? this.variables[condition.right]
                : parseFloat(condition.right);

        const operatorsMap = {
            and: "&&",
            or: "||",
            greater: ">",
            less: "<",
            equal: "==",
            ">": ">",
            "<": "<",
            "==": "==",
            "!=": "!=",
            ">=": ">=",
            "<=": "<=",
        };

        const operator = operatorsMap[condition.operator];

        if (!operator) {
            throw new Error(`Unknown operator: ${condition.operator}`);
        }

        switch (operator) {
            case "&&":
                return left && right;
            case "||":
                return left || right;
            case ">":
                return left > right;
            case "<":
                return left < right;
            case "==":
                return left === right;
            case "!=":
                return left !== right;
            case ">=":
                return left >= right;
            case "<=":
                return left <= right;
            default:
                throw new Error(`Unhandled operator: ${operator}`);
        }
    }
}

export default ExpressionEvaluator;

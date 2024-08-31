import Converter from "./Converter.js";
class JsonConverter extends Converter {
    constructor() {
        super();
        this.variables = {};
        this.declaredVariables = new Set();
        this.initializedArrays = new Set();
        this.currentLine = 1;
        this.nestedEndIf = 0;
        this.ifDepth = 0; // Track the depth of nested IF statements
    }

    convert(ir) {
        return this.transformToFinalJSON(ir);
    }

    transformToFinalJSON(ir) {
        return {
            actionFrames: this.transformNodes(ir.program),
        };
    }

    transformNodes(nodes) {
        return nodes.flatMap((node) => this.transformNode(node));
    }

    transformNode(node) {
        const nodeWithLine = { ...node, line: this.currentLine++ };

        switch (nodeWithLine.type) {
            case "VariableDeclaration":
                return this.transformVariableDeclaration(nodeWithLine);
            case "FunctionDeclaration":
                return this.transformFunctionDeclaration(nodeWithLine);
            case "PrintStatement":
                return this.transformPrintStatement(nodeWithLine);
            case "IfStatement":
                const returnVal = this.transformIfStatement(nodeWithLine);
                if (this.ifDepth == 0) this.nestedEndIf = 0;
                return returnVal;
            case "ForLoop":
                return this.transformForLoop(nodeWithLine);
            case "WhileLoop":
                return this.transformWhileOrLoopUntil(nodeWithLine, "while");
            case "LoopUntil":
                return this.transformWhileOrLoopUntil(
                    nodeWithLine,
                    "loop_until"
                );
            case "LoopFromTo":
                return this.transformLoopFromTo(nodeWithLine);
            case "ReturnStatement":
                return this.transformReturnStatement(nodeWithLine);
            case "ArrayCreation":
                return this.transformArrayCreation(nodeWithLine);
            case "ArrayInsertion":
                return this.transformArrayInsertion(nodeWithLine);
            default:
                throw new Error(`Unknown node type: ${nodeWithLine.type}`);
        }
    }

    transformVariableDeclaration(node) {
        if (node.value.type === "SubstringExpression") {
            return this.handleSubstringExpression(node);
        }
        let typeBool = false;
        let length;
        if (node.value.type === "LengthExpression") {
            length = this.evaluateLengthExpression(node.value);
        }
        let value = this.evaluateExpression(node.value);

        if (node.value.type === "BooleanLiteral") {
            typeBool = true;
            value = value.value;
        }
        this.variables[node.name] = value;
        this.declaredVariables.add(node.name);
        let varType = typeBool
            ? "boolean"
            : node.type === "StringLiteral"
            ? "string"
            : this.determineType(value);

        const buildExpressionString = (expr) => {
            if (expr.type === "Expression") {
                // Check if this is a subtraction from zero (negative number)
                if (expr.operator === "-" && expr.left.value === 0) {
                    return `-${buildExpressionString(expr.right)}`;
                } else {
                    return `(${buildExpressionString(expr.left)} ${
                        expr.operator
                    } ${buildExpressionString(expr.right)})`;
                }
            } else if (expr.type == "LengthExpression")
                return this.evaluateLengthExpression(expr);
            else {
                return String(expr);
            }
        };

        // Generate the expression string
        let returnVal =
            node.value.type === "Expression"
                ? buildExpressionString(node.value)
                : node.value.type === "BooleanLiteral" ||
                  node.value.type === "LengthExpression"
                ? value
                : String(value);
        // Remove outer parentheses for top-level expression
        if (
            typeof returnVal === "string" &&
            returnVal.startsWith("(") &&
            returnVal.endsWith(")")
        ) {
            returnVal = returnVal.slice(1, -1);
        }
        if (typeof this.variables[node.name] === "string") returnVal = value;
        return {
            line: node.line,
            operation: "set",
            varName: node.name,
            type: varType,
            value: value,
            timestamp: new Date().toISOString(),
            description: `Set variable ${node.name} to ${returnVal}.`,
        };
    }

    handleSubstringExpression(node) {
        const { name, value } = node;
        const source = value.string;

        // Evaluate start and end using evaluateExpression
        const start = this.evaluateExpression(value.start);
        const end = this.evaluateExpression(value.end);
        if (start > end) {
            throw new Error(
                `Invalid substring operation: 'start' index (${start}) cannot be greater than 'end' index (${end}).`
            );
        }
        if (start < 0)
            throw new Error(
                "Invalid substring operation: 'start' index cannot be negative."
            );
        // Retrieve the actual string value from the stored variables
        const sourceValue = this.getVariableValue(source);
        // Perform the substring operation
        const finalValue = sourceValue.substring(start, end);

        // Update the variables with the substring result
        this.variables[name] = finalValue;
        this.declaredVariables.add(name);

        return {
            line: node.line,
            operation: "set",
            varName: name,
            type: "string",
            value: {
                operation: "substring",
                source,
                start,
                end,
                result: finalValue,
            },
            timestamp: new Date().toISOString(),
            description:
                start === end
                    ? "Set variable subStr to an empty string as start and end indices are identical."
                    : `Set variable ${name} to a substring of ${source} from index ${start} to ${end}.`,
        };
    }

    determineType(value) {
        // Try to convert the value to a number
        const convertedValue = Number(value);
        if (typeof value === "string") {
            if (value.trim() === "") return "string";
        }
        // Check if the conversion is successful and the result is not NaN
        if (!isNaN(convertedValue)) {
            return "number";
        } else {
            return typeof value;
        }
    }

    transformFunctionDeclaration(node) {
        const returnVal = {
            line: node.line,
            operation: "define",
            varName: node.name,
            params: node.params,
            body: this.transformNodes(node.body),
            timestamp: new Date().toISOString(),
            description: `Defined function ${
                node.name
            } with parameters ${node.params.join(", ")}.`,
        };
        this.currentLine++;
        return returnVal;
    }

    transformPrintStatement(node) {
        const value = node.value;
        const isLiteral = !this.declaredVariables.has(value);
        return {
            line: node.line,
            operation: "print",
            isLiteral: isLiteral,
            varName: isLiteral ? null : value,
            literal: isLiteral ? value : this.variables[value],
            timestamp: new Date().toISOString(),
            description: `Printed ${value}.`,
        };
    }

    transformIfStatement(node) {
        this.ifDepth++; // Entering an IF statement, increment depth
        const conditionResult = this.evaluateCondition(node.condition);
        const conditionString = this.convertConditionToString(node.condition);

        // Start with the IF statement
        let frames = [
            {
                line: node.line,
                operation: "if",
                condition: conditionString,
                result: conditionResult,
                timestamp: new Date().toISOString(),
                description: `Checked if ${conditionString}.`,
            },
        ];
        let consequentLineCount = 0;
        let alternateLineCount = 0;
        if (conditionResult) {
            // Handle the true condition (consequent)
            frames = frames.concat(this.transformNodes(node.consequent));
            consequentLineCount = frames.length;
            // Adjust currentLine to account for alternate block length + 1
            if (node.alternate && node.alternate.length > 0) {
                this.currentLine = Math.max(
                    this.currentLine,
                    this.currentLine + node.alternate.length + 1
                );
            } else {
                //this.currentLine++;
                this.currentLine = node.line + node.consequent.length + 1;
            }
        } else {
            // Handle the false condition (alternate)
            if (node.alternate && node.alternate.length > 0) {
                this.currentLine = Math.max(
                    this.currentLine,
                    this.currentLine + node.consequent.length + 1
                );
            } else {
                this.currentLine = node.line + node.consequent.length + 1;
            }
            frames = frames.concat(this.transformNodes(node.alternate || []));

            // Simply increment the current line by 1
            //this.currentLine++;
        }
        // Add the "End If" movement object
        if (node.alternate && node.alternate.length > 0) {
            this.currentLine = Math.max(
                this.currentLine,
                node.line + node.consequent.length + node.alternate.length + 2
            );
        } else {
            this.currentLine = Math.max(
                this.currentLine,
                node.line + node.consequent.length + 1
            );
        }
        if (this.nestedEndIf > 0 && !node.alternate) {
            this.currentLine = this.nestedEndIf + 1;
            frames.push({
                line: this.currentLine,
                operation: "endif",
                timestamp: new Date().toISOString(),
                description: "End of if statement.",
            });
        } else {
            frames.push({
                line: this.currentLine,
                operation: "endif",
                timestamp: new Date().toISOString(),
                description: "End of if statement.",
            });
        }
        this.ifDepth--; // Exiting an IF statement, decrement depth
        this.nestedEndIf = this.currentLine;
        this.currentLine++;
        return frames;
    }

    calculateEndIfLine(node) {
        let maxLine = node.line;

        const updateMaxLine = (nodes) => {
            for (const subNode of nodes) {
                if (subNode.type === "IfStatement") {
                    maxLine = Math.max(
                        maxLine,
                        this.calculateEndIfLine(subNode)
                    );
                } else if (subNode.line) {
                    maxLine = Math.max(maxLine, subNode.line);
                }
            }
        };

        if (node.consequent && node.consequent.length > 0) {
            updateMaxLine(node.consequent);
        }

        if (node.alternate && node.alternate.length > 0) {
            updateMaxLine(node.alternate);
        }

        return maxLine + 1; // Adding 1 to represent the 'End If' line
    }

    transformForLoop(node) {
        return {
            line: node.line,
            operation: "for",
            iterator: node.iterator,
            collection: node.collection,
            body: this.transformNodes(node.body),
            timestamp: new Date().toISOString(),
            description: `Iterating over ${node.collection} with ${node.iterator}.`,
        };
    }
    transformGenericLoop(node, loopType, conditionString) {
        const loopLine = node.line;
        const actionFrames = [
            {
                line: node.line,
                operation: loopType,
                condition: conditionString,
                timestamp: new Date().toISOString(),
                description: `${loopType.replace(
                    "_",
                    " "
                )} loop with condition ${conditionString}.`,
            },
        ];

        let bodyLineStart = node.line; // Line where loop body starts
        let bodyLineCount = 0; // Track the number of lines in the loop body

        while (this.evaluateCondition(node.condition)) {
            let z = 0;
            this.currentLine = node.line + 1;
            if (this.variables["x"] == 0) {
                z += 1;
            }
            actionFrames.push({
                line: node.line,
                operation: "if",
                condition: conditionString,
                result: true,
                timestamp: new Date().toISOString(),
                description: `Checked if ${conditionString}.`,
            });

            const bodyFrames = this.transformNodes(node.body).map((frame) => ({
                ...frame,
                line: frame.line,
            }));

            actionFrames.push(...bodyFrames);
            bodyLineCount = Math.max(
                bodyLineCount,
                this.currentLine - bodyLineStart
            );
            // For loop_from_to, update the loop variable and add the set movement object
            if (loopType === "loop_from_to") {
                const updateFrame = this.updateLoopVariable(
                    node.loopVariable,
                    loopLine
                );
                actionFrames.push(updateFrame);
            }
            //this.currentLine = this.currentLine - node.body.length;
        }

        actionFrames.push({
            line: node.line,
            operation: "if",
            condition: conditionString,
            result: false,
            timestamp: new Date().toISOString(),
            description: `Checked if ${conditionString}.`,
        });

        this.currentLine = bodyLineStart + bodyLineCount;
        actionFrames.push({
            line: this.currentLine++,
            operation: "loop_end",
            timestamp: new Date().toISOString(),
            description: `End of ${loopType.replace("_", " ")} loop`,
        });
        return actionFrames;
    }

    updateLoopVariable(loopVariableName, loopLine) {
        if (!this.variables.hasOwnProperty(loopVariableName)) {
            throw new Error(
                `Loop variable ${loopVariableName} is not declared.`
            );
        }

        // Increment the loop variable
        this.variables[loopVariableName] += 1;

        // Return the frame representing this update
        return {
            line: loopLine,
            operation: "set",
            varName: loopVariableName,
            type: "number",
            value: this.variables[loopVariableName],
            timestamp: new Date().toISOString(),
            description: `Set variable ${loopVariableName} to ${this.variables[loopVariableName]}.`,
        };
    }

    transformWhileOrLoopUntil(node, loopType) {
        if (!node.condition || typeof node.condition !== "object") {
            throw new Error(`${loopType} condition is malformed or missing.`);
        }

        let { left, operator, right } = node.condition;

        if (
            typeof left === "undefined" ||
            typeof operator === "undefined" ||
            typeof right === "undefined"
        ) {
            console.error(`${loopType} condition components are undefined.`, {
                left,
                operator,
                right,
            });
            throw new Error(
                `${loopType} condition is missing components: left, operator, or right.`
            );
        }

        let conditionString = this.convertConditionToString(node.condition);

        if (loopType === "loop_until") {
            // Flip the condition for `loop_until`
            conditionString = this.flipCondition(conditionString);

            // Flip the operator in node.condition as well
            node.condition.operator = this.flipOperator(operator);
        }

        return this.transformGenericLoop(node, "while", conditionString);
    }

    flipOperator(operator) {
        const flipMap = {
            ">": "<=",
            "<": ">=",
            ">=": "<",
            "<=": ">",
            "==": "!=",
            "!=": "==",
        };

        if (flipMap[operator]) {
            return flipMap[operator];
        }

        throw new Error(`Unsupported operator for flipping: ${operator}`);
    }

    // Helper function to flip the condition for LoopUntil
    flipCondition(condition) {
        if (condition.includes(">=")) {
            return condition.replace(">=", "<");
        } else if (condition.includes(">")) {
            return condition.replace(">", "<=");
        } else if (condition.includes("<=")) {
            return condition.replace("<=", ">");
        } else if (condition.includes("<")) {
            return condition.replace("<", ">=");
        } else if (condition.includes("==")) {
            return condition.replace("==", "!=");
        } else if (condition.includes("!=")) {
            return condition.replace("!=", "==");
        }
        throw new Error("Unsupported condition operator for flipping");
    }

    transformLoopFromTo(node) {
        //console.log(this.currentLine);
        const startValue = this.convertValue(node.range.start);
        const endValue = this.convertValue(node.range.end);
        const loopVariable = node.loopVariable;

        // Create an action frame to set the loop variable to the start value
        const actionFrames = [
            {
                line: this.currentLine - 1,
                operation: "set",
                varName: loopVariable,
                type: "number",
                value: startValue,
                timestamp: new Date().toISOString(),
                description: `Set variable ${loopVariable} to ${startValue}.`,
            },
        ];
        this.variables[loopVariable] = startValue;
        this.declaredVariables.add(loopVariable);
        // Generate the condition string for the loop
        const conditionString = `${loopVariable} <= ${endValue}`;
        //console.log("end val " + endValue);
        // Set the node.condition to the associated condition
        node.condition = {
            left: loopVariable,
            operator: "<=",
            right: endValue,
        };

        // Start the loop processing using the common logic
        actionFrames.push(
            ...this.transformGenericLoop(node, "loop_from_to", conditionString)
        );

        return actionFrames;
    }

    convertConditionToString(condition) {
        // Handle simple values (e.g., true, false, numbers, strings) directly
        if (
            typeof condition === "boolean" ||
            typeof condition === "number" ||
            typeof condition === "string"
        ) {
            return condition.toString();
        }

        if (this.declaredVariables.has(condition)) {
            return condition;
        }

        // Handle identifiers and declared variables
        if (
            condition.type === "Identifier" ||
            this.declaredVariables.has(condition)
        ) {
            return condition.value;
        }

        if (condition.type === "LengthExpression")
            return this.evaluateLengthExpression(condition);

        // Handle malformed or undefined conditions
        if (!condition || !condition.operator) {
            console.error("Condition is malformed or undefined:", condition);
            throw new Error("Condition is malformed or undefined.");
        }

        // Handle 'not' operator separately
        if (
            condition.operator === "not" &&
            condition.type === "UnaryExpression"
        ) {
            const right = this.convertConditionToString(condition.argument);
            return `!${right}`;
        } else if (condition.operator === "not") {
            const right = this.convertConditionToString(condition.right);
            return `!${right}`;
        }

        // Handle nested conditions recursively
        const left =
            condition.left && typeof condition.left === "object"
                ? this.convertConditionToString(condition.left)
                : condition.left;

        const right =
            condition.right && typeof condition.right === "object"
                ? this.convertConditionToString(condition.right)
                : condition.right;

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

        return `${left} ${operator} ${right}`;
    }

    transformReturnStatement(node) {
        const transformedReturnValue = this.transformExpression(node.value);
        return {
            line: node.line,
            operation: "return",
            value: transformedReturnValue,
            timestamp: new Date().toISOString(),
            description: `Returned ${JSON.stringify(transformedReturnValue)}.`,
        };
    }

    evaluateCondition(condition) {
        // Handle simple values (e.g., true, false, numbers, strings) directly
        console.log(condition);
        if (
            typeof condition === "boolean" ||
            typeof condition === "number" ||
            typeof condition === "string"
        ) {
            return condition;
        }

        if (this.declaredVariables.has(condition))
            return this.variables[condition];

        // Handle identifiers and declared variables
        if (
            condition.type === "Identifier" ||
            this.declaredVariables.has(condition)
        ) {
            return this.variables[condition.value] || this.variables[condition];
        }

        if (condition.type === "LengthExpression") {
            return this.evaluateLengthExpression(condition);
        }

        // Handle malformed or undefined conditions
        if (!condition || !condition.operator) {
            console.error("Condition is malformed or undefined:", condition);
            throw new Error("Condition is malformed or undefined.");
        }

        // Handle 'not' operator separately
        if (
            condition.operator === "not" &&
            condition.type === "UnaryExpression"
        ) {
            const right = this.evaluateCondition(condition.argument);
            console.log(`right is ${right}`);
            return this.declaredVariables.has(right)
                ? !this.variables[right]
                : !right;
        } else if (condition.operator === "not") {
            const right = this.evaluateCondition(condition.right);
            console.log(`right is ${right}`);
            return !right;
        }

        // Handle nested conditions recursively
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

    transformExpression(expression) {
        if (expression.type === "Expression") {
            // Recursively transform the left and right parts of the expression
            const left = this.transformExpression(expression.left);
            const right = this.transformExpression(expression.right);
            return {
                left: left.value || left, // Return the transformed value or the transformed expression
                operator: expression.operator,
                right: right.value || right, // Return the transformed value or the transformed expression
            };
        } else if (this.declaredVariables.has(expression)) {
            // If the expression is an identifier and has been declared, retrieve its value
            return {
                value: this.variables[expression] || expression,
            };
        } else if (
            expression.type === "NumberLiteral" ||
            expression.type === "StringLiteral"
        ) {
            // If the expression is a literal (number or string), return its value directly
            return {
                value: expression.value,
            };
        } else {
            // Handle any other cases (like a plain value or unrecognized type)

            return expression;
        }
    }

    // Handle length expressions
    evaluateLengthExpression(expression) {
        const source = expression.source; // This is the variable name
        const sourceValue = this.getVariableValue(source); // Retrieve the value of the source variable

        if (typeof sourceValue === "string" || Array.isArray(sourceValue)) {
            return sourceValue.length;
        } else {
            throw new Error(
                `Cannot compute length for non-string/non-array type: ${source}`
            );
        }
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
        } else {
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
                console.log(left / right);
                return left / right;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    }

    transformArrayCreation(node) {
        const elements = (node.values || []).map((el) =>
            this.evaluateExpression(el)
        );
        this.variables[node.varName] = elements;
        this.initializedArrays.add(node.varName);
        this.declaredVariables.add(node.varName);
        return {
            line: node.line,
            operation: "create_array",
            varName: node.varName,
            value: elements.map((el) => this.convertValue(el)),
            timestamp: new Date().toISOString(),
            description: `Created array ${node.varName}.`,
        };
    }

    transformArrayInsertion(node) {
        if (!this.variables[node.varName]) {
            throw new Error(`Array ${node.varName} not initialized.`);
        }
        const value = this.evaluateExpression(node.value);
        const position = parseInt(node.position);

        this.variables[node.varName][position] = value;
        return {
            line: node.line,
            operation: "add",
            varName: node.varName,
            value: this.convertValue(value),
            position: position,
            timestamp: new Date().toISOString(),
            description: `Added ${value} to array ${node.varName} at position ${node.position}.`,
        };
    }

    convertValue(value) {
        console.log(value.value);
        if (typeof value === "string" && value.trim() !== "" && !isNaN(value)) {
            return Number(value);
        }
        return value;
    }

    /**
     * Retrieves the value of a variable if it has been declared.
     * @param {string} variableName - The name of the variable to retrieve.
     * @returns {*} The value of the variable.
     * @throws {Error} Throws an error if the variable has not been declared.
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
}

export default JsonConverter;

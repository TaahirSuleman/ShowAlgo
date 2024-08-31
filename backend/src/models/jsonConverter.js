import Converter from "./Converter.js";
import JsonNodeConverterFactory from "./JsonNodeConverterFactory.js";
import ExpressionEvaluator from "./ExpressionEvaluator.js";

class JsonConverter extends Converter {
    constructor() {
        super();
        this.variables = {};
        this.declaredVariables = new Set();
        this.initializedArrays = new Set();
        this.currentLine = 1;
        this.nestedEndIf = 0;
        this.ifDepth = 0; // Track the depth of nested IF statements
        this.nodeConverterFactory = new JsonNodeConverterFactory(this);
        this.expressionEvaluator = new ExpressionEvaluator(
            this.variables,
            this.declaredVariables
        );
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

    /**
     * Transforms a single node using the appropriate conversion method.
     * @param {Object} node - The IR node to transform.
     * @returns {Object|Array} The transformed node, or an array of transformed nodes.
     */
    transformNode(node) {
        const nodeWithLine = {
            ...node,
            line:
                node.type === "OtherwiseIfStatement"
                    ? node.line
                    : this.currentLine++,
        };

        // Use the factory to get the appropriate converter for the node type
        const converter = this.nodeConverterFactory.getConverter(
            nodeWithLine.type
        );
        return converter(nodeWithLine);
    }

    transformVariableDeclaration(node) {
        if (node.value.type === "SubstringExpression") {
            return this.handleSubstringExpression(node);
        }
        if (node.value.type === "IndexExpression")
            return this.transformIndexExpression(node);
        let typeBool = false;
        let length;
        if (node.value.type === "LengthExpression") {
            length = this.expressionEvaluator.evaluateLengthExpression(
                node.value
            );
        }
        let value = this.expressionEvaluator.evaluateExpression(node.value);

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
                if (expr.operator === "-" && expr.left.value === 0) {
                    return `-${buildExpressionString(expr.right)}`;
                } else {
                    return `(${buildExpressionString(expr.left)} ${
                        expr.operator
                    } ${buildExpressionString(expr.right)})`;
                }
            } else if (expr.type == "LengthExpression")
                return this.expressionEvaluator.evaluateLengthExpression(expr);
            else {
                return String(expr);
            }
        };

        let returnVal =
            node.value.type === "Expression"
                ? buildExpressionString(node.value)
                : node.value.type === "BooleanLiteral" ||
                  node.value.type === "LengthExpression"
                ? value
                : String(value);
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

    transformIndexExpression(node) {
        const { varName, value } = node;
        const source = value.source;

        const index = this.expressionEvaluator.evaluateExpression(value.index);

        if (index < 0) {
            throw new Error(
                `Invalid index operation: index (${index}) cannot be negative.`
            );
        }

        const sourceValue = this.expressionEvaluator.getVariableValue(source);

        let result;
        let type;
        if (typeof sourceValue === "string") {
            if (index > sourceValue.length) {
                throw new Error(
                    `Index out of bounds: string length is ${sourceValue.length}, but index is ${index}.`
                );
            }
            type = "string";
            result = sourceValue.charAt(index);
        } else if (Array.isArray(sourceValue)) {
            if (index > sourceValue.length) {
                throw new Error(
                    `Index out of bounds: array length is ${sourceValue.length}, but index is ${index}.`
                );
            }
            type = "array";
            result = sourceValue[index];
        } else {
            throw new Error(
                `Unsupported type for indexing: ${typeof sourceValue}`
            );
        }

        this.variables[varName] = result;
        this.declaredVariables.add(varName);

        return {
            line: node.line,
            operation: "set",
            varName: node.name,
            type: type,
            value: {
                operation: "get",
                type: type,
                varName: source,
                index: index,
                result: result,
            },
            timestamp: new Date().toISOString(),
            description: `Set variable ${node.name} to ${source}[${index}].`,
        };
    }

    handleSubstringExpression(node) {
        const { name, value } = node;
        const source = value.string;

        const start = this.expressionEvaluator.evaluateExpression(value.start);
        const end = this.expressionEvaluator.evaluateExpression(value.end);
        if (start > end) {
            throw new Error(
                `Invalid substring operation: 'start' index (${start}) cannot be greater than 'end' index (${end}).`
            );
        }
        if (start < 0)
            throw new Error(
                "Invalid substring operation: 'start' index cannot be negative."
            );
        const sourceValue = this.expressionEvaluator.getVariableValue(source);
        const finalValue = sourceValue.substring(start, end);

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
        const conditionResult = this.expressionEvaluator.evaluateCondition(
            node.condition
        );
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

    transformOtherwiseIfStatement(node) {
        // Entering an Otherwise If statement, increment depth
        //this.ifDepth++;
        this.currentLine = node.line;
        console.log(node.line);
        const conditionResult = this.expressionEvaluator.evaluateCondition(
            node.condition
        );
        const conditionString = this.convertConditionToString(node.condition);

        let frames = [
            {
                line: this.currentLine++,
                operation: "if", // Transform Otherwise If as an If in JSON
                condition: conditionString,
                result: conditionResult,
                timestamp: new Date().toISOString(),
                description: `Checked if ${conditionString}.`,
            },
        ];

        if (conditionResult) {
            frames = frames.concat(this.transformNodes(node.consequent));
        } else if (node.alternate) {
            if (node.alternate.type != "OtherwiseIfStatement")
                this.currentLine = node.otherwiseLine;
            // Recursively handle nested Otherwise If or Otherwise
            //this.currentLine = node.line;
            frames = frames.concat(this.transformNodes(node.alternate));
        }
        this.currentLine = node.endLine;

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

        while (this.expressionEvaluator.evaluateCondition(node.condition)) {
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
        const startValue = this.expressionEvaluator.convertValue(
            node.range.start
        );
        const endValue = this.expressionEvaluator.convertValue(node.range.end);
        const loopVariable = node.loopVariable;

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
        const conditionString = `${loopVariable} <= ${endValue}`;
        node.condition = {
            left: loopVariable,
            operator: "<=",
            right: endValue,
        };

        actionFrames.push(
            ...this.transformGenericLoop(node, "loop_from_to", conditionString)
        );

        return actionFrames;
    }

    convertConditionToString(condition) {
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

        if (
            condition.type === "Identifier" ||
            this.declaredVariables.has(condition)
        ) {
            return condition.value;
        }

        if (condition.type === "LengthExpression")
            return this.expressionEvaluator.evaluateLengthExpression(condition);

        if (!condition || !condition.operator) {
            console.error("Condition is malformed or undefined:", condition);
            throw new Error("Condition is malformed or undefined.");
        }

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

    transformExpression(expression) {
        if (expression.type === "IndexExpression") {
            return this.transformIndexExpression(expression);
        } else if (expression.type === "Expression") {
            const left = this.transformExpression(expression.left);
            const right = this.transformExpression(expression.right);
            return {
                left: left.value || left,
                operator: expression.operator,
                right: right.value || right,
            };
        } else if (this.declaredVariables.has(expression)) {
            return {
                value: this.variables[expression] || expression,
            };
        } else if (
            expression.type === "NumberLiteral" ||
            expression.type === "StringLiteral"
        ) {
            return {
                value: expression.value,
            };
        } else {
            return expression;
        }
    }

    transformArrayCreation(node) {
        const elements = (node.values || []).map((el) =>
            this.expressionEvaluator.evaluateExpression(el)
        );
        this.variables[node.varName] = elements;
        this.initializedArrays.add(node.varName);
        this.declaredVariables.add(node.varName);
        return {
            line: node.line,
            operation: "create_array",
            varName: node.varName,
            value: elements.map((el) =>
                this.expressionEvaluator.convertValue(el)
            ),
            timestamp: new Date().toISOString(),
            description: `Created array ${node.varName}.`,
        };
    }

    transformArrayInsertion(node) {
        if (!this.variables[node.varName]) {
            throw new Error(`Array ${node.varName} not initialized.`);
        }
        const value = this.expressionEvaluator.evaluateExpression(node.value);
        const position = parseInt(node.position);

        this.variables[node.varName][position] = value;
        return {
            line: node.line,
            operation: "add",
            varName: node.varName,
            value: this.expressionEvaluator.convertValue(value),
            position: position,
            timestamp: new Date().toISOString(),
            description: `Added ${value} to array ${node.varName} at position ${node.position}.`,
        };
    }
}

export default JsonConverter;

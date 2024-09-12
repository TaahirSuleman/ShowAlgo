import Converter from "./Converter.js";
import JsonNodeConverterFactory from "./JsonNodeConverterFactory.js";
import ExpressionEvaluator from "./ExpressionEvaluator.js";

class JsonConverter extends Converter {
    constructor() {
        super();
        this.variables = {};
        this.declaredVariables = new Set();
        this.initializedArrays = {};
        this.currentLine = 1;
        this.nestedEndIf = 0;
        this.ifDepth = 0; // Track the depth of nested IF statements
        this.nodeConverterFactory = new JsonNodeConverterFactory(this);
        this.expressionEvaluator = new ExpressionEvaluator(
            this.variables,
            this.declaredVariables
        );
        this.functionMap = new Map(); // This will store function names mapped to their IR for transformation when the function is called.
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

        if (node.value.type === "IndexExpression") {
            console.log("hello");
            return this.transformIndexExpression(node);
        }

        let frames = []; // Collect frames for movements
        let value = this.expressionEvaluator.evaluateExpression(node.value);

        // Check if the value is a function call
        if (node.value.type === "FunctionCall") {
            const lineNum = node.value.line;
            // Process the function call and retrieve the frames and return value
            const functionCallResult = this.transformFunctionCall(node.value);

            // Add the function call frames first
            frames = [...functionCallResult.frames];

            // Set the return value from the function call as the value of the variable
            value = functionCallResult.returnValue;

            // Assign the value from the function return to the variable
            this.variables[node.name] = value;
            this.declaredVariables.add(node.name);

            const varType = this.determineType(value);

            // Add the variable declaration movement after function call and body
            frames.push({
                line: lineNum,
                operation: "set",
                varName: node.name,
                type: varType,
                value: value,
                timestamp: new Date().toISOString(),
                description: `Set variable ${node.name} to function return value ${value}.`,
            });
            this.currentLine = lineNum + 1;
            return frames; // Return all frames including the function call and variable assignment
        }

        // For non-function-call values, proceed as usual
        let typeBool = false;

        if (node.value.type === "LengthExpression") {
            value = this.expressionEvaluator.evaluateLengthExpression(
                node.value
            );
        }

        if (node.value.type === "BooleanLiteral") {
            typeBool = true;
            value = value.value;
        }

        this.variables[node.name] = value;
        this.declaredVariables.add(node.name);

        const varType = typeBool
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

        if (typeof this.variables[node.name] === "string") {
            returnVal = value;
        }

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
        console.log("in here" + value);
        const source = value.source;
        const index = this.expressionEvaluator.evaluateExpression(value.index);

        if (index < 0) {
            throw new Error(
                `Invalid index operation: index (${index}) cannot be negative.`
            );
        }

        const sourceValue = this.expressionEvaluator.getVariableValue(source);

        let result;
        let getType;
        let varType;
        if (typeof sourceValue === "string") {
            if (index > sourceValue.length) {
                throw new Error(
                    `Index out of bounds: string length is ${sourceValue.length}, but index is ${index}.`
                );
            }
            getType = "string";
            varType = "string";
            result = sourceValue.charAt(index);
        } else if (Array.isArray(sourceValue)) {
            getType = "array";
            if (index > sourceValue.length) {
                throw new Error(
                    `Index out of bounds: array length is ${sourceValue.length}, but index is ${index}.`
                );
            }
            varType = this.initializedArrays[source];
            result = sourceValue[index];
        } else {
            throw new Error(
                `Unsupported type for indexing: ${typeof sourceValue}`
            );
        }

        this.variables[node.name] = result;
        this.declaredVariables.add(node.name);
        //console.log(this.variables);
        return {
            line: node.line,
            operation: "set",
            varName: node.name,
            type: varType,
            value: {
                operation: "get",
                type: getType,
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

    /**
     * Transforms a SwapOperation node into a final JSON action frame.
     * @param {Object} node - The SwapOperation node to transform.
     * @returns {Object} The transformed action frame for the swap operation.
     */
    transformSwapOperation(node) {
        const firstPosition = this.expressionEvaluator.evaluateExpression(
            node.firstPosition
        );
        const secondPosition = this.expressionEvaluator.evaluateExpression(
            node.secondPosition
        );

        // Ensure the array is initialized
        if (!this.initializedArrays[node.varName]) {
            throw new Error(
                `Error at line ${node.line}: Array ${node.varName} must be initialized before being used.`
            );
        }

        // Ensure firstPosition and secondPosition are within array bounds
        const arrayLength = this.variables[node.varName].length;
        if (
            firstPosition < 0 ||
            firstPosition >= arrayLength ||
            secondPosition < 0 ||
            secondPosition >= arrayLength
        ) {
            throw new Error(
                `Error at line ${node.line}: Swap positions must be within the bounds of the array ${node.varName} (size ${arrayLength}).`
            );
        }

        // Perform the swap in the array stored in this.variables
        const array = this.variables[node.varName];
        const temp = array[firstPosition];
        array[firstPosition] = array[secondPosition];
        array[secondPosition] = temp;

        // Update the array in this.variables after the swap
        this.variables[node.varName] = array;

        return {
            line: node.line,
            operation: "swap",
            dataStructure: "array",
            firstPosition: firstPosition,
            secondPosition: secondPosition,
            varName: node.varName,
            description: `Swapped values in position ${firstPosition} and ${secondPosition} in array ${node.varName}.`,
            timestamp: new Date().toISOString(),
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
        // Store the entire IR (body, params) in the functionMap for later processing
        const functionIR = {
            name: node.name,
            params: node.params,
            startLine: node.startLine,
            body: node.body,
        };

        this.functionMap.set(node.name, functionIR);

        // Return a movement object for the function definition
        return {
            line: node.line,
            operation: "define",
            varName: node.name,
            params: node.params,
            timestamp: new Date().toISOString(),
            description: `Defined function ${
                node.name
            } with parameters ${node.params.join(", ")}.`,
        };
    }

    transformFunctionCall(node) {
        const frames = [];
        const functionName = node.name;

        // Ensure the function exists in the map
        if (!this.functionMap.has(functionName)) {
            throw new Error(`Function ${functionName} is not defined.`);
        }

        // Retrieve the function's full IR
        const functionIR = this.functionMap.get(functionName);
        //console.log(functionIR);
        // Check argument count match between the call and definition
        const params = functionIR.params;
        const args = node.args;

        if (params.length !== args.length) {
            throw new Error(
                `Argument count mismatch in function ${functionName}. Expected ${params.length} but got ${args.length}.`
            );
        }
        let prevLine = node.line;
        this.currentLine = functionIR.startLine + 1;
        // Map arguments to function parameters
        const previousVariables = { ...this.variables }; // Save the current variables state
        for (let i = 0; i < params.length; i++) {
            this.variables[params[i]] =
                this.expressionEvaluator.evaluateExpression(args[i]);
            this.declaredVariables.add(params[i]);
        }
        //console.log(this.variables);
        let frameArgs = args.map((arg) =>
            this.expressionEvaluator.evaluateExpression(arg)
        );
        // Output the function call movement object
        frames.push({
            line: node.line,
            operation: "function_call",
            varName: functionName,
            arguments: frameArgs,
            timestamp: new Date().toISOString(),
            description: `Called function ${functionName} with arguments ${frameArgs}.`,
        });

        // Process the function body and retrieve the return value
        let returnValue = null;
        functionIR.body.forEach((statement) => {
            const bodyFrame = this.transformNode(statement);

            // Check if the statement is a return statement
            if (statement.type === "ReturnStatement") {
                returnValue = this.expressionEvaluator.evaluateExpression(
                    statement.value
                );
                //console.log("Hello " + returnValue);
            }

            // If bodyFrame is an array, loop through each element and push them to frames
            if (Array.isArray(bodyFrame)) {
                bodyFrame.forEach((frame) => frames.push(frame));
            } else {
                frames.push(bodyFrame); // If it's a single frame, just push it directly
            }
        });

        // Restore the previous variable state
        this.variables = previousVariables;
        this.currentLine = prevLine;
        node.line = prevLine;

        return {
            frames,
            returnValue, // Return the final result of the function, if any
        };
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
        //console.log(node.line);
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

    transformForEachLoop(node) {
        const arrayName = node.collection;
        const iterator = node.iterator;

        // Set the initial index to 0
        const startValue = 0;
        const endValue = this.variables[arrayName].length - 1; // Length of the array minus one

        this.variables[iterator] = null; // Initialize the iterator
        const conditionString = `${iterator} in ${arrayName}`; // New condition format

        return this.transformGenericLoop(node, "for_each", conditionString);
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
        let ifCondition;
        let bodyLineStart = node.line; // Line where loop body starts
        let bodyLineCount = 0; // Track the number of lines in the loop body
        if (loopType === "for_each") {
            // Handle the special case for the for_each loop
            const arrayName = node.collection; // The array to iterate over
            const iterator = node.iterator; // The iterator variable (e.g., 'num')
            let index = 0; // Start with index 0
            ifCondition = `Checked if index < ${this.variables[arrayName].length}`;

            // While the index is within the array bounds
            while (index < this.variables[arrayName].length) {
                actionFrames.push({
                    line: node.line,
                    operation: "if",
                    condition: ifCondition,
                    result: true,
                    timestamp: new Date().toISOString(),
                    description: ifCondition,
                });

                // Set the iterator variable to the value at the current index
                const arrayValue = this.variables[arrayName][index];
                actionFrames.push({
                    line: node.line,
                    operation: "set",
                    varName: iterator,
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: arrayName,
                        index: index,
                        result: arrayValue,
                    },
                    timestamp: new Date().toISOString(),
                    description: `Set variable ${iterator} to ${arrayName}[${index}].`,
                });
                this.declaredVariables.add(iterator);
                this.variables[iterator] = arrayValue;
                this.currentLine = bodyLineStart + 1;
                // Transform the loop body (processing the body of the loop)
                const bodyFrames = this.transformNodes(node.body).map(
                    (frame) => ({
                        ...frame,
                        line: frame.line,
                    })
                );

                actionFrames.push(...bodyFrames);

                // Increment the index
                index += 1;
                bodyLineCount = Math.max(
                    bodyLineCount,
                    this.currentLine - bodyLineStart
                );
                this.currentLine = node.endLine;
            }
        } else {
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

                const bodyFrames = this.transformNodes(node.body).map(
                    (frame) => ({
                        ...frame,
                        line: frame.line,
                    })
                );

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
        }
        actionFrames.push({
            line: node.line,
            operation: "if",
            condition: loopType === "for_each" ? ifCondition : conditionString,
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

        const operatorMapped = operatorsMap[operator];
        const flipMap = {
            ">": "<=",
            "<": ">=",
            ">=": "<",
            "<=": ">",
            "==": "!=",
            "!=": "==",
        };

        if (flipMap[operatorMapped]) {
            return flipMap[operatorMapped];
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
        const startValue = this.expressionEvaluator.evaluateExpression(
            node.range.start
        );
        const endValue = this.expressionEvaluator.evaluateExpression(
            node.range.end
        );
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
        const transformedReturnValue =
            this.expressionEvaluator.evaluateExpression(node.value);
        return {
            line: node.line,
            operation: "return",
            value: transformedReturnValue,
            timestamp: new Date().toISOString(),
            description: `Returned ${transformedReturnValue}.`,
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
        let elements;
        if (node.dsType === "boolean")
            elements = (node.values || []).map((el) => el.value);
        else
            elements = (node.values || []).map((el) =>
                this.expressionEvaluator.evaluateExpression(el)
            );
        this.variables[node.varName] = elements;
        this.initializedArrays[node.varName] = node.dsType;
        this.declaredVariables.add(node.varName);
        const unInitialised = node.unInitialised;
        let value;
        if (node.dsType === "boolean") value = elements.map((el) => el);
        else
            value = elements.map((el) =>
                this.expressionEvaluator.convertValue(el)
            );
        return {
            line: node.line,
            operation: "create",
            dataStructure: "array",
            type: node.dsType,
            varName: node.varName,
            value: value,
            timestamp: new Date().toISOString(),
            description: unInitialised
                ? `Created array ${node.varName} with size ${elements.length}.`
                : `Created array ${node.varName} with values [${value}].`,
        };
    }

    /**
     * Transforms a RemoveOperation node into an action frame.
     * @param {Object} node - The RemoveOperation node.
     * @returns {Object} The transformed action frame.
     */
    transformRemoveOperation(node) {
        const line = node.line;

        // Ensure the variable is an initialized array
        if (!this.initializedArrays.hasOwnProperty(node.varName)) {
            throw new Error(
                `Variable ${node.varName} is not an initialized array.`
            );
        }

        // Determine the data structure type (currently supporting only arrays)
        const dsType = this.initializedArrays[node.varName];
        // if (dsType !== "array") {
        //     throw new Error(
        //         `Operation 'remove' is not supported for ${dsType} data structure.`
        //     );
        // }

        // Evaluate the position to remove
        const position = this.expressionEvaluator.evaluateExpression(
            node.positionToRemove
        );

        return {
            line: line,
            operation: "remove",
            dataStructure: "array",
            varName: node.varName,
            positionToRemove: position,
            timestamp: new Date().toISOString(),
            description: `Removed value at position ${position} in array ${node.varName}.`,
        };
    }

    transformArrayInsertion(node) {
        if (!this.variables[node.varName]) {
            throw new Error(`Array ${node.varName} not initialized.`);
        }
        const value = this.expressionEvaluator.evaluateExpression(node.value);
        const position = parseInt(node.position);
        if (typeof value != this.initializedArrays[node.varName])
            throw new Error(
                `Array type mismtach: cannot insert value of type ${typeof value} into array of type ${
                    this.initializedArrays[node.varName]
                }.`
            );
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

    transformArraySetValue(node) {
        const varName = node.varName;
        const index = this.expressionEvaluator.evaluateExpression(node.index);
        console.log("set");
        const setValue =
            node.setValue.type === "IndexExpression"
                ? this.transformIndexExpression(node.setValue)
                : this.expressionEvaluator.evaluateExpression(node.setValue);

        // Ensure the array has been initialized before proceeding
        if (!this.initializedArrays[varName]) {
            if (this.declaredVariables.has(varName))
                throw new Error(`Variable '${varName}' is not an array.`);
            else throw new Error(`Array '${varName}' is not initialized.`);
        }

        // Perform the actual setting of the value in the array
        if (!Array.isArray(this.variables[varName])) {
            throw new Error(`Variable '${varName}' is not an array.`);
        }

        if (index < 0 || index >= this.variables[varName].length) {
            throw new Error(
                `Index ${index} is out of bounds for array '${varName}'.`
            );
        }

        if (typeof setValue != this.initializedArrays[varName])
            throw new Error(
                `Type mismatch at line ${
                    node.line
                }: attempt to set an array of type ${
                    this.initializedArrays[varName]
                } to a value of type ${typeof setValue}.`
            );

        // Set the value at the specified index
        this.variables[varName][index] = setValue;

        return {
            line: node.line,
            operation: "set_array",
            varName: varName,
            index: index,
            setValue: setValue,
            timestamp: new Date().toISOString(),
            description: `Set ${varName}[${index}] to ${setValue}.`,
        };
    }
}

export default JsonConverter;

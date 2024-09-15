import Converter from "./Converter.js";
import JsonNodeConverterFactory from "./JsonNodeConverterFactory.js";
import ExpressionEvaluator from "./ExpressionEvaluator.js";

class JsonConverter extends Converter {
    constructor() {
        super();
        this.variables = {};
        this.declaredVariables = new Set();
        this.initializedArrays = {};
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
        // Use the factory to get the appropriate converter for the node type
        const converter = this.nodeConverterFactory.getConverter(node.type);
        return converter(node);
    }

    transformVariableDeclaration(node) {
        if (node.value.type === "SubstringExpression") {
            return this.handleSubstringExpression(node);
        }

        if (node.value.type === "IndexExpression") {
            return this.transformIndexExpression(node);
        }

        let frames = []; // Collect frames for movements
        let value = this.expressionEvaluator.evaluateExpression(node.value);
        if (
            typeof node.name === "object" ||
            node.name == null ||
            node.name == undefined
        )
            throw new Error(
                `Please ensure that variable name at ${node.line} is correctly written as a single word and not an operation or expression.`
            );
        // Check if the value is a function call
        if (node.value.type === "FunctionCall") {
            const lineNum = node.value.line;
            // Process the function call and retrieve the frames and return value
            const functionCallResult = this.transformFunctionCall(
                node.value,
                true
            );

            // Add the function call frames first
            if (!functionCallResult.returnValue) {
                throw new Error(
                    `Function ${node.value.name} does not return a value and cannot be used in a variable declaration.`
                );
            }
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
            if (value != true && value != false) {
                throw new Error("Booleans can only be true or false");
            }
        }

        this.variables[node.name] = value;
        this.declaredVariables.add(node.name);

        const varType = typeBool
            ? "boolean"
            : node.value.type === "StringLiteral"
            ? "string"
            : this.determineType(value);

        const operatorPrecedence = {
            "+": 1,
            "-": 1,
            "*": 2,
            "/": 2,
        };
        if (typeof value != "string" && varType === "string") {
            value = String(value);
            this.variables[node.name] = value;
        }
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

        // let result = eval(returnVal);
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
        const array = this.expressionEvaluator.getVariableValue(node.varName);
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
            description:
                node.params.length == 0
                    ? `Defined function ${node.name} with no parameters.`
                    : `Defined function ${
                          node.name
                      } with parameters ${node.params.join(", ")}.`,
        };
    }

    transformFunctionCall(node, varDecl = false) {
        const frames = [];
        const functionName = node.name;

        // Ensure the function exists in the map
        if (!this.functionMap.has(functionName)) {
            throw new Error(`Function ${functionName} is not defined.`);
        }

        // Retrieve the function's full IR
        const functionIR = this.functionMap.get(functionName);

        // Ensure params and args are defined, defaulting to an empty array if no params exist
        const params = functionIR.params || [];
        const args = node.args || [];

        // Check argument count match between the call and definition
        if (params.length !== args.length) {
            throw new Error(
                `Argument count mismatch in function ${functionName}. Expected ${params.length} but got ${args.length}.`
            );
        }

        // Store the current line number
        let prevLine = node.line;

        // Map arguments to function parameters
        const previousVariables = { ...this.variables }; // Save the current variables state
        for (let i = 0; i < params.length; i++) {
            this.variables[params[i]] =
                this.expressionEvaluator.evaluateExpression(args[i]);
            this.declaredVariables.add(params[i]);
        }

        // Prepare the frame for the function call
        let frameArgs = args.map((arg) =>
            this.expressionEvaluator.evaluateExpression(arg)
        );

        // Add the function call frame
        frames.push({
            line: node.callLine ? node.callLine : node.line,
            operation: "function_call",
            varName: functionName,
            arguments: frameArgs,
            timestamp: new Date().toISOString(),
            description:
                frameArgs.length === 0
                    ? `Called function ${functionName} with no arguments.`
                    : `Called function ${functionName} with arguments ${frameArgs}.`,
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
            }

            // Flatten the frames directly into the main frames array
            if (Array.isArray(bodyFrame)) {
                frames.push(...bodyFrame); // Spread array if multiple frames
            } else {
                frames.push(bodyFrame); // Push single frame directly
            }
        });
        node.line = prevLine;

        return returnValue !== null && varDecl
            ? { frames, returnValue }
            : frames;
    }

    transformPrintStatement(node) {
        const value = node.value.type
            ? this.expressionEvaluator.evaluateExpression(node.value)
            : node.value;
        const isLiteral = !this.declaredVariables.has(value);
        let printVal = isLiteral ? value : this.variables[value];
        if (
            (typeof printVal === "object" && !Array.isArray(printVal)) ||
            printVal == undefined
        )
            throw new Error(
                "Nesting other operations or expressions within print statements is not allowed. Please assign this to a variable first then try again."
            );
        return {
            line: node.line,
            operation: "print",
            isLiteral: isLiteral,
            varName: isLiteral ? null : value,
            literal: printVal,
            timestamp: new Date().toISOString(),
            description: `Printed ${value}.`,
        };
    }

    transformIfStatement(node) {
        const conditionResult = this.expressionEvaluator.evaluateCondition(
            node.condition
        );
        const conditionString = this.convertConditionToString(node.condition);
        if (conditionResult != true && conditionResult != false) {
            throw new Error(
                "Please ensure that only booleans and conditional expressions are used in conditions."
            );
        }
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
        if (conditionResult) {
            // Handle the true condition (consequent)
            frames = frames.concat(this.transformNodes(node.consequent));
        } else {
            frames = frames.concat(this.transformNodes(node.alternate || []));
        }
        frames.push({
            line: null,
            operation: "endif",
            timestamp: new Date().toISOString(),
            description: "End of if statement.",
        });
        return frames;
    }

    transformOtherwiseIfStatement(node) {
        // Entering an Otherwise If statement, increment depth
        const conditionResult = this.expressionEvaluator.evaluateCondition(
            node.condition
        );
        const conditionString = this.convertConditionToString(node.condition);

        let frames = [
            {
                line: node.line,
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
                frames = frames.concat(this.transformNodes(node.alternate));
        }

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
        const endValue =
            this.expressionEvaluator.getVariableValue(arrayName).length - 1;

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
            ifCondition = `index < ${
                this.expressionEvaluator.getVariableValue(arrayName).length
            }`;

            // While the index is within the array bounds
            while (index < this.variables[arrayName].length) {
                actionFrames.push({
                    line: node.line,
                    operation: "if",
                    condition: ifCondition,
                    result: true,
                    timestamp: new Date().toISOString(),
                    description: `Checked if ${ifCondition}`,
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
            }
        } else {
            while (this.expressionEvaluator.evaluateCondition(node.condition)) {
                let z = 0;
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

        actionFrames.push({
            line: null,
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
            node.condition === "Expression" &&
            (typeof left === "undefined" ||
                typeof operator === "undefined" ||
                typeof right === "undefined")
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

        return this.transformGenericLoop(node, "while", conditionString);
    }

    applyFlipOperatorRecursively(conditionNode) {
        // Ensure the node is an object and has an operator
        if (
            !conditionNode ||
            typeof conditionNode !== "object" ||
            !conditionNode.operator
        ) {
            return;
        }

        // Flip the operator of the current node
        conditionNode.operator = this.flipOperator(conditionNode.operator);

        // Recursively handle the left side if it's an expression
        if (
            typeof conditionNode.left === "object" &&
            conditionNode.left !== null &&
            conditionNode.left.type === "Expression"
        ) {
            this.applyFlipOperatorRecursively(conditionNode.left);
        }

        // Recursively handle the right side if it's an expression
        if (
            typeof conditionNode.right === "object" &&
            conditionNode.right !== null &&
            conditionNode.right.type === "Expression"
        ) {
            this.applyFlipOperatorRecursively(conditionNode.right);
        }
    }

    flipOperator(operator) {
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

        const operatorMapped = operatorsMap[operator];
        const flipMap = {
            and: "&&",
            or: "||",
            greater: ">",
            less: "<",
            equal: "!=",
            "&&": "&&",
            "||": "||",
            ">": ">",
            "<": "<",
            "==": "!=",
            ">": "<=",
            "<": ">=",
            ">=": "<",
            "<=": ">",
            "==": "!=",
            "!=": "==",
        };

        if (flipMap[operatorMapped]) {
            return flipMap[operatorMapped];
        } else if (
            typeof this.expressionEvaluator.getVariableValue(operator) ===
            "boolean"
        )
            return operator;

        throw new Error(`Unsupported operator for flipping: ${operator}`);
    }

    flipCondition(condition) {
        if (condition.includes(">=")) {
            return condition.replaceAll(">=", "<");
        } else if (condition.includes(">")) {
            return condition.replaceAll(">", "<=");
        } else if (condition.includes("<=")) {
            return condition.replaceAll("<=", ">");
        } else if (condition.includes("<")) {
            return condition.replaceAll("<", ">=");
        } else if (condition.includes("==")) {
            return condition.replaceAll("==", "!=");
        } else if (condition.includes("!=")) {
            return condition.replaceAll("!=", "==");
        } else if (condition.type === "Identifier") return condition.value;
        return condition;
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
                line: node.line,
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

            // Handle parentheses based on operator precedence
            const wrapInParentheses = (expr) => {
                return expr.operator &&
                    (expr.operator === "+" || expr.operator === "-")
                    ? `(${expr.left} ${expr.operator} ${expr.right})`
                    : `${expr.left} ${expr.operator} ${expr.right}`;
            };

            const transformedExpression = {
                left: left.value || left,
                operator: expression.operator,
                right: right.value || right,
            };

            return wrapInParentheses(transformedExpression);
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
        if (node.dsType === "boolean" && !node.unInitialised)
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

        // Evaluate the position to remove
        const position = this.expressionEvaluator.evaluateExpression(
            node.positionToRemove
        );
        if (typeof position != "number")
            throw new Error(
                `Error at line ${node.line}: Position to remove must be a number.`
            );
        const arrayLength = this.variables[node.varName].length;
        if (position < 0 || position >= arrayLength) {
            throw new Error(
                `Error at line ${node.line}: Position ${position} is out of bounds for array ${node.varName}.`
            );
        }
        const removedValue = this.variables[node.varName].splice(position, 1);
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
        if (
            position < 0 ||
            position > this.variables[node.varName].length ||
            isNaN(position)
        ) {
            throw new Error(
                `Index is out of bounds for array insertion at line ${node.line}`
            );
        }
        this.variables[node.varName].splice(position, 0, value);
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

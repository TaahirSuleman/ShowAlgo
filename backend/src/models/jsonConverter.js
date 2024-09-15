import Converter from "./Converter.js";
import JsonNodeConverterFactory from "./JsonNodeConverterFactory.js";
import ExpressionEvaluator from "./ExpressionEvaluator.js";

/**
 * @class JsonConverter
 * @extends Converter
 * @description Converts the intermediate representation (IR) to JSON format. Handles variable declarations, arrays, and nested control structures.
 */
class JsonConverter extends Converter {
    /**
     * @constructor
     * Initializes the JsonConverter with variables, declared variables, and other utility objects for managing state during conversion.
     */
    constructor() {
        super();
        this.variables = {}; // Store declared variables and their values
        this.declaredVariables = new Set(); // Track declared variable names
        this.initializedArrays = {}; // Keep track of initialized arrays
        this.nodeConverterFactory = new JsonNodeConverterFactory(this); // Factory for node conversion
        this.expressionEvaluator = new ExpressionEvaluator(
            this.variables,
            this.declaredVariables
        ); // Evaluates expressions in the conversion process
        this.functionMap = new Map(); // Store function definitions mapped to their IR
    }

    /**
     * @method convert
     * @description Converts the intermediate representation (IR) into final JSON format.
     * @param {Object} ir - The intermediate representation to convert.
     * @returns {Object} The transformed JSON object.
     */
    convert(ir) {
        return this.transformToFinalJSON(ir);
    }

    /**
     * @method transformToFinalJSON
     * @description Transforms the intermediate representation (IR) into the final JSON structure.
     * @param {Object} ir - The intermediate representation containing the program nodes.
     * @returns {Object} The JSON object containing action frames.
     */
    transformToFinalJSON(ir) {
        return {
            actionFrames: this.transformNodes(ir.program), // Convert program nodes into action frames
        };
    }

    /**
     * @method transformNodes
     * @description Transforms an array of IR nodes into the corresponding JSON representation.
     * @param {Array} nodes - Array of IR nodes.
     * @returns {Array} The transformed array of JSON action frames.
     */
    transformNodes(nodes) {
        return nodes.flatMap((node) => this.transformNode(node)); // Flatten and transform all nodes
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

    /**
     * @method transformVariableDeclaration
     * @description Transforms a variable declaration node into the appropriate frames for execution,
     * handling various cases such as function calls, substring expressions, index expressions, and boolean literals.
     * It also checks the validity of the variable name, evaluates expressions, and manages the declared variables.
     * @param {Object} node - The AST node representing the variable declaration.
     * @returns {Object|Array} A frame representing the variable declaration or an array of frames if the value is derived from a function call.
     * @throws {Error} If the variable name is invalid, if the function doesn't return a value, or if the boolean value is invalid.
     */
    transformVariableDeclaration(node) {
        if (node.value.type === "SubstringExpression") {
            return this.handleSubstringExpression(node);
        }

        if (node.value.type === "IndexExpression") {
            return this.transformIndexExpression(node);
        }

        let frames = []; // Collect frames for movements
        let value = this.expressionEvaluator.evaluateExpression(node.value);

        // Ensure the variable name is valid
        if (
            typeof node.name === "object" ||
            node.name == null ||
            node.name == undefined
        )
            throw new Error(
                `Please ensure that variable name at ${node.line} is correctly written as a single word and not an operation or expression.`
            );

        // Handle function call within variable declaration
        if (node.value.type === "FunctionCall") {
            const lineNum = node.value.line;
            const functionCallResult = this.transformFunctionCall(
                node.value,
                true
            );

            if (
                !functionCallResult.returnValue &&
                functionCallResult.returnValue != 0
            ) {
                throw new Error(
                    `Function ${node.value.name} does not return a value and cannot be used in a variable declaration.`
                );
            }

            // Add function call frames
            frames = [...functionCallResult.frames];

            value = functionCallResult.returnValue;
            if (value.type === "BooleanLiteral") value = value.value;
            this.variables[node.name] = value;
            this.declaredVariables.add(node.name);
            const varType = this.determineType(value);

            // Frame for setting the variable to the function return value
            frames.push({
                line: lineNum,
                operation: "set",
                varName: node.name,
                type: varType,
                value: value,
                timestamp: new Date().toISOString(),
                description: `Set variable ${node.name} to function return value ${value}.`,
            });

            return frames; // Return all frames, including the function call and variable assignment
        }

        // Handle boolean literals and length expressions
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

        // Convert non-string values to strings if needed
        if (typeof value != "string" && varType === "string") {
            value = String(value);
            this.variables[node.name] = value;
        }

        // Function to build the expression string
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

        // Build the return value for the variable
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

        // Return the frame representing the variable assignment
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

    /**
     * @method transformIndexExpression
     * @description Transforms an index expression node, handling array and string indexing.
     * It evaluates the index and checks for out-of-bounds errors, then retrieves the value from the source variable
     * and assigns it to the target variable. It also manages type checks and error handling for unsupported types.
     * @param {Object} node - The AST node representing the index expression.
     * @returns {Object} A frame representing the variable assignment from the indexed value.
     * @throws {Error} If the index is negative, out of bounds, or the source type is unsupported for indexing.
     */
    transformIndexExpression(node) {
        const { varName, value } = node;
        const source = value.source;
        const index = this.expressionEvaluator.evaluateExpression(value.index);

        // Ensure the index is not negative
        if (index < 0) {
            throw new Error(
                `Invalid index operation: index (${index}) cannot be negative.`
            );
        }

        const sourceValue = this.expressionEvaluator.getVariableValue(source);

        let result;
        let getType;
        let varType;

        // Handle indexing for strings
        if (typeof sourceValue === "string") {
            if (index >= sourceValue.length) {
                throw new Error(
                    `Index out of bounds: string length is ${sourceValue.length}, but index is ${index}.`
                );
            }
            getType = "string";
            varType = "string";
            result = sourceValue.charAt(index); // Retrieve the character at the specified index
        }
        // Handle indexing for arrays
        else if (Array.isArray(sourceValue)) {
            getType = "array";
            if (index >= sourceValue.length) {
                throw new Error(
                    `Index out of bounds: array length is ${sourceValue.length}, but index is ${index}.`
                );
            }
            varType = this.initializedArrays[source]; // Retrieve the array's data type
            result = sourceValue[index]; // Retrieve the element at the specified index
        }
        // Throw error if the source type is unsupported for indexing
        else {
            throw new Error(
                `Unsupported type for indexing: ${typeof sourceValue}`
            );
        }

        // Assign the result to the target variable
        this.variables[node.name] = result;
        this.declaredVariables.add(node.name);

        // Return the frame for setting the variable to the indexed value
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

    /**
     * @method handleSubstringExpression
     * @description Handles a substring operation by evaluating the start and end indices, performing validation,
     * and extracting the substring from the source string. It then stores the result in the target variable.
     * @param {Object} node - The AST node representing the substring operation.
     * @returns {Object} A frame representing the substring operation.
     * @throws {Error} If the start index is greater than the end index or the start index is negative.
     */
    handleSubstringExpression(node) {
        const { name, value } = node;
        const source = value.string;

        // Evaluate the start and end expressions
        const start = this.expressionEvaluator.evaluateExpression(value.start);
        const end = this.expressionEvaluator.evaluateExpression(value.end);

        // Validate the start and end indices
        if (start > end) {
            throw new Error(
                `Invalid substring operation: 'start' index (${start}) cannot be greater than 'end' index (${end}).`
            );
        }
        if (start < 0)
            throw new Error(
                "Invalid substring operation: 'start' index cannot be negative."
            );

        // Retrieve the source value and extract the substring
        const sourceValue = this.expressionEvaluator.getVariableValue(source);
        const finalValue = sourceValue.substring(start, end);

        // Store the substring result in the target variable
        this.variables[name] = finalValue;
        this.declaredVariables.add(name);

        // Return the frame for the substring operation
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
     * @method transformSwapOperation
     * @description Transforms a SwapOperation node by evaluating the positions to swap, validating the array bounds,
     * and performing the swap operation. The result is stored back in the array.
     * @param {Object} node - The AST node representing the swap operation.
     * @returns {Object} A frame representing the swap operation.
     * @throws {Error} If the array is not initialized or the swap positions are out of bounds.
     */
    transformSwapOperation(node) {
        // Evaluate the positions to swap
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

        // Validate the positions are within the bounds of the array
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

        // Perform the swap operation in the array
        const array = this.expressionEvaluator.getVariableValue(node.varName);
        const temp = array[firstPosition];
        array[firstPosition] = array[secondPosition];
        array[secondPosition] = temp;

        // Update the array in this.variables after the swap
        this.variables[node.varName] = array;

        // Return the frame for the swap operation
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

    /**
     * @method determineType
     * @description Determines the type of a given value by attempting to convert it to a number and checking its original type.
     * @param {any} value - The value to determine the type of.
     * @returns {string} The type of the value, either "number", "string", or the original type.
     */
    determineType(value) {
        // Try to convert the value to a number
        const convertedValue = Number(value);

        // Check if the value is a string and handle empty strings
        if (typeof value === "string") {
            if (value.trim() === "") return "string";
        }

        // Check if the conversion is successful and the result is not NaN
        if (!isNaN(convertedValue)) {
            return "number";
        } else {
            // Return the original type if the conversion is not valid
            return typeof value;
        }
    }

    /**
     * @method transformFunctionDeclaration
     * @description Transforms a function declaration node by storing the function's intermediate representation (IR) and returning a movement object representing the function definition.
     * @param {Object} node - The AST node representing the function declaration.
     * @returns {Object} A movement object representing the function definition.
     */
    transformFunctionDeclaration(node) {
        // Store the entire IR (body, params) in the functionMap for later processing
        const functionIR = {
            name: node.name,
            params: node.params,
            startLine: node.startLine,
            body: node.body,
        };

        // Add the function to the functionMap
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

    /**
     * @method transformFunctionCall
     * @description Transforms a function call node by evaluating the arguments, mapping them to parameters, and processing the function body to generate the corresponding action frames.
     * @param {Object} node - The AST node representing the function call.
     * @param {boolean} varDecl - A flag to indicate whether the call is part of a variable declaration.
     * @returns {Array|Object} The frames generated from the function call. If varDecl is true, returns an object containing frames and the return value.
     * @throws {Error} Throws an error if the function is not defined or if the argument count does not match the function definition.
     */
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

    /**
     * @method transformPrintStatement
     * @description Transforms a print statement node into a JSON action frame for printing a value.
     * @param {Object} node - The AST node representing the print statement.
     * @returns {Object} The action frame representing the print operation.
     * @throws {Error} Throws an error if the print statement includes nested operations or if the value to print is undefined.
     */
    transformPrintStatement(node) {
        const value = node.value.type
            ? this.expressionEvaluator.evaluateExpression(node.value)
            : node.value;
        const isLiteral = !this.declaredVariables.has(value);
        let printVal = isLiteral ? value : this.variables[value];

        // Ensure the value is not an object or undefined
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

    /**
     * @method transformIfStatement
     * @description Transforms an if statement node into a series of JSON action frames. Evaluates the condition and processes the consequent or alternate block accordingly.
     * @param {Object} node - The AST node representing the if statement.
     * @returns {Array} An array of action frames representing the if statement and its execution.
     * @throws {Error} Throws an error if the condition does not evaluate to a boolean value.
     */
    transformIfStatement(node) {
        // Evaluate the condition of the if statement
        const conditionResult = this.expressionEvaluator.evaluateCondition(
            node.condition
        );
        // Convert the condition to a string representation for JSON output
        const conditionString = this.convertConditionToString(node.condition);

        // Ensure the condition result is a boolean (true/false)
        if (conditionResult != true && conditionResult != false) {
            throw new Error(
                "Please ensure that only booleans and conditional expressions are used in conditions."
            );
        }

        // Create the initial frame for the if statement
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

        // If the condition is true, process the consequent block
        if (conditionResult) {
            frames = frames.concat(this.transformNodes(node.consequent));
        } else {
            // Otherwise, process the alternate block (else clause, if present)
            frames = frames.concat(this.transformNodes(node.alternate || []));
        }

        // Add an end frame for the if statement
        frames.push({
            line: null,
            operation: "endif",
            timestamp: new Date().toISOString(),
            description: "End of if statement.",
        });

        // Return the array of action frames representing the if statement
        return frames;
    }

    /**
     * @method transformOtherwiseIfStatement
     * @description Transforms an otherwise if statement node into a series of JSON action frames, treating it as an if statement in JSON format. Evaluates the condition and processes the consequent or alternate block accordingly.
     * @param {Object} node - The AST node representing the otherwise if statement.
     * @returns {Array} An array of action frames representing the otherwise if statement.
     */
    transformOtherwiseIfStatement(node) {
        // Evaluate the condition for the otherwise if statement
        const conditionResult = this.expressionEvaluator.evaluateCondition(
            node.condition
        );
        // Convert the condition to a string for the JSON output
        const conditionString = this.convertConditionToString(node.condition);

        // Create the frame for the otherwise if statement (treated as an if)
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

        // If the condition is true, process the consequent block
        if (conditionResult) {
            frames = frames.concat(this.transformNodes(node.consequent));
        } else if (node.alternate) {
            // Otherwise, process the alternate block, if not another OtherwiseIfStatement
            if (node.alternate.type != "OtherwiseIfStatement") {
                frames = frames.concat(this.transformNodes(node.alternate));
            }
        }

        // Return the array of action frames representing the otherwise if statement
        return frames;
    }

    /**
     * @method transformForEachLoop
     * @description Transforms a for-each loop node into a series of JSON action frames, iterating over an array or collection. Evaluates the collection and processes each iteration.
     * @param {Object} node - The AST node representing the for-each loop.
     * @returns {Array} An array of action frames representing the for-each loop execution.
     */
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

    /**
     * @method transformGenericLoop
     * @description Transforms a generic loop (such as for_each or loop_from_to) into a series of JSON action frames. It handles conditions, iterators, and loop body execution.
     * @param {Object} node - The AST node representing the loop.
     * @param {string} loopType - The type of loop (e.g., 'for_each', 'loop_from_to').
     * @param {string} conditionString - The string representing the loop condition.
     * @returns {Array} An array of action frames representing the loop and its execution.
     */
    transformGenericLoop(node, loopType, conditionString) {
        const loopLine = node.line; // Store the line where the loop starts
        const actionFrames = [
            {
                line: node.line,
                operation: loopType, // The type of loop (for_each, loop_from_to)
                condition: conditionString,
                timestamp: new Date().toISOString(),
                description: `${loopType.replace(
                    "_",
                    " "
                )} loop with condition ${conditionString}.`, // Description for the loop
            },
        ];

        let ifCondition;
        let bodyLineStart = node.line; // Track where the loop body starts
        let bodyLineCount = 0; // Track the number of lines in the loop body

        if (loopType === "for_each") {
            // Handle special case for 'for_each' loops

            const arrayName = node.collection; // The array to iterate over
            const iterator = node.iterator; // Iterator variable (e.g., 'num')
            let index = 0; // Initialize index at 0

            // Set the loop condition for array bounds
            ifCondition = `index < ${
                this.expressionEvaluator.getVariableValue(arrayName).length
            }`;

            // Iterate through the array
            while (index < this.variables[arrayName].length) {
                actionFrames.push({
                    line: node.line,
                    operation: "if", // Check the loop condition
                    condition: ifCondition,
                    result: true, // Always true until the end of the array
                    timestamp: new Date().toISOString(),
                    description: `Checked if ${ifCondition}`, // Condition description
                });

                // Set the iterator variable to the current array value
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

                // Add the iterator to declared variables and set its value
                this.declaredVariables.add(iterator);
                this.variables[iterator] = arrayValue;

                // Transform the loop body (process the loop body)
                const bodyFrames = this.transformNodes(node.body).map(
                    (frame) => ({
                        ...frame,
                        line: frame.line, // Ensure each frame retains its original line number
                    })
                );

                actionFrames.push(...bodyFrames); // Append body frames to the actionFrames

                // Increment the index after each iteration
                index += 1;
            }
        } else {
            // For other loop types, such as 'loop_from_to'

            // Continue looping while the condition is true
            while (this.expressionEvaluator.evaluateCondition(node.condition)) {
                actionFrames.push({
                    line: node.line,
                    operation: "if",
                    condition: conditionString,
                    result: true,
                    timestamp: new Date().toISOString(),
                    description: `Checked if ${conditionString}.`, // Log the condition check
                });

                // Transform the loop body
                const bodyFrames = this.transformNodes(node.body).map(
                    (frame) => ({
                        ...frame,
                        line: frame.line, // Ensure the line number is preserved
                    })
                );

                actionFrames.push(...bodyFrames); // Append body frames to actionFrames

                // If it's a loop_from_to, update the loop variable
                if (loopType === "loop_from_to") {
                    const updateFrame = this.updateLoopVariable(
                        node.loopVariable,
                        loopLine
                    );
                    actionFrames.push(updateFrame); // Append the update frame for the loop variable
                }
            }
        }

        // After the loop ends, check the condition one final time (false result)
        actionFrames.push({
            line: node.line,
            operation: "if",
            condition: loopType === "for_each" ? ifCondition : conditionString,
            result: false, // The loop condition is false, so the loop ends
            timestamp: new Date().toISOString(),
            description: `Checked if ${conditionString}.`, // Log the final condition check
        });

        // Add the final frame marking the end of the loop
        actionFrames.push({
            line: null,
            operation: "loop_end",
            timestamp: new Date().toISOString(),
            description: `End of ${loopType.replace("_", " ")} loop`, // Log the loop ending
        });

        // Return all the action frames representing the loop execution
        return actionFrames;
    }

    /**
     * @method updateLoopVariable
     * @description Increments the value of the loop variable by 1. Used to simulate the progress of loop variables in loops.
     * @param {string} loopVariableName - The name of the loop variable to be updated.
     * @param {number} loopLine - The line number where the loop occurs.
     * @returns {Object} A JSON action frame representing the update of the loop variable.
     * @throws {Error} Throws an error if the loop variable is not declared.
     */
    updateLoopVariable(loopVariableName, loopLine) {
        if (!this.variables.hasOwnProperty(loopVariableName)) {
            throw new Error(
                `Loop variable ${loopVariableName} is not declared.`
            );
        }

        // Increment the loop variable by 1
        this.variables[loopVariableName] += 1;

        // Return the frame representing this update in the loop variable
        return {
            line: loopLine,
            operation: "set", // The operation is to set the variable's value
            varName: loopVariableName, // The name of the loop variable
            type: "number", // Type is always a number in this case
            value: this.variables[loopVariableName], // New value of the loop variable
            timestamp: new Date().toISOString(),
            description: `Set variable ${loopVariableName} to ${this.variables[loopVariableName]}.`, // Description of the update
        };
    }

    /**
     * @method transformWhileOrLoopUntil
     * @description Transforms a while or loop-until loop into a series of JSON action frames. It validates the loop condition and transforms the loop body.
     * @param {Object} node - The AST node representing the loop.
     * @param {string} loopType - The type of loop, either 'while' or 'until'.
     * @returns {Array} An array of action frames representing the loop and its execution.
     * @throws {Error} Throws an error if the loop condition is malformed or missing.
     */
    transformWhileOrLoopUntil(node, loopType) {
        if (!node.condition || typeof node.condition !== "object") {
            throw new Error(`${loopType} condition is malformed or missing.`);
        }

        let { left, operator, right } = node.condition; // Extract the components of the condition

        // Ensure all components of the condition are defined
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

        // Convert the condition to a string for JSON representation
        let conditionString = this.convertConditionToString(node.condition);

        // Transform the loop as a generic loop with the given condition
        return this.transformGenericLoop(node, "while", conditionString);
    }

    /**
     * @method transformLoopFromTo
     * @description Transforms a loop-from-to loop into a series of JSON action frames. It sets the initial loop variable and processes the loop body.
     * @param {Object} node - The AST node representing the loop-from-to.
     * @returns {Array} An array of action frames representing the loop and its execution.
     */
    transformLoopFromTo(node) {
        // Evaluate the start and end values of the loop range
        const startValue = this.expressionEvaluator.evaluateExpression(
            node.range.start
        );
        const endValue = this.expressionEvaluator.evaluateExpression(
            node.range.end
        );
        const loopVariable = node.loopVariable;

        // Action frame for setting the initial loop variable
        const actionFrames = [
            {
                line: node.line,
                operation: "set", // Set the initial value of the loop variable
                varName: loopVariable, // Name of the loop variable
                type: "number", // The type is a number
                value: startValue, // Initial value for the loop variable
                timestamp: new Date().toISOString(),
                description: `Set variable ${loopVariable} to ${startValue}.`, // Log the initial setting
            },
        ];

        // Store the loop variable in the current variable state
        this.variables[loopVariable] = startValue;
        this.declaredVariables.add(loopVariable);

        // Construct the condition for the loop (loopVariable <= endValue)
        const conditionString = `${loopVariable} <= ${endValue}`;
        node.condition = {
            left: loopVariable,
            operator: "<=",
            right: endValue,
        };

        // Transform the loop body using the generic loop transformer
        actionFrames.push(
            ...this.transformGenericLoop(node, "loop_from_to", conditionString)
        );

        // Return the full set of action frames for the loop
        return actionFrames;
    }

    /**
     * @method convertConditionToString
     * @description Converts a condition into its string representation for use in JSON action frames. Handles various types of conditions, including booleans, numbers, strings, and expressions.
     * @param {Object|boolean|number|string} condition - The condition to convert into a string.
     * @returns {string} The string representation of the condition.
     * @throws {Error} Throws an error if the condition is malformed or the operator is unknown.
     */
    convertConditionToString(condition) {
        // Handle primitive types (boolean, number, string) directly
        if (
            typeof condition === "boolean" ||
            typeof condition === "number" ||
            typeof condition === "string"
        ) {
            return condition.toString(); // Convert the primitive value to a string
        }

        // Handle conditions that are declared variables
        if (this.declaredVariables.has(condition)) {
            return condition; // Return the condition directly if it is a declared variable
        }

        // Handle identifiers
        if (
            condition.type === "Identifier" ||
            this.declaredVariables.has(condition)
        ) {
            return condition.value; // Return the value of the identifier
        }

        // Handle length expressions by evaluating them
        if (condition.type === "LengthExpression")
            return this.expressionEvaluator.evaluateLengthExpression(condition);

        // If condition or operator is missing, log the error and throw an exception
        if (!condition || !condition.operator) {
            console.error("Condition is malformed or undefined:", condition);
            throw new Error("Condition is malformed or undefined.");
        }

        // Handle NOT operator in unary expressions (e.g., !condition)
        if (
            condition.operator === "not" &&
            condition.type === "UnaryExpression"
        ) {
            const right = this.convertConditionToString(condition.argument); // Convert the argument of the NOT expression
            return `!${right}`; // Return the negated condition as a string
        } else if (condition.operator === "not") {
            // Handle NOT operator in binary expressions
            const right = this.convertConditionToString(condition.right); // Convert the right side of the NOT expression
            return `!${right}`; // Return the negated condition
        }

        // Recursively handle the left side of the condition if it's an object
        const left =
            condition.left && typeof condition.left === "object"
                ? this.convertConditionToString(condition.left)
                : condition.left;

        // Recursively handle the right side of the condition if it's an object
        const right =
            condition.right && typeof condition.right === "object"
                ? this.convertConditionToString(condition.right)
                : condition.right;

        // Map logical and comparison operators to their JavaScript equivalents
        const operatorsMap = {
            and: "&&", // Logical AND
            or: "||", // Logical OR
            greater: ">", // Greater than
            less: "<", // Less than
            equal: "==", // Equality check
            ">": ">",
            "<": "<",
            "==": "==",
            "!=": "!=",
            ">=": ">=",
            "<=": "<=",
        };

        const operator = operatorsMap[condition.operator]; // Map the condition's operator

        // Throw an error if the operator is not recognized
        if (!operator) {
            throw new Error(`Unknown operator: ${condition.operator}`);
        }

        // Return the full condition as a string (e.g., "x > 5")
        return `${left} ${operator} ${right}`;
    }

    /**
     * @method transformReturnStatement
     * @description Transforms a return statement node into a JSON action frame. Evaluates the return value and constructs the appropriate frame.
     * @param {Object} node - The AST node representing the return statement.
     * @returns {Object} A JSON object representing the return action frame.
     */
    transformReturnStatement(node) {
        // Evaluate the expression or value being returned
        const transformedReturnValue =
            this.expressionEvaluator.evaluateExpression(node.value);

        // Return the action frame for the return statement
        return {
            line: node.line,
            operation: "return",
            value: transformedReturnValue,
            timestamp: new Date().toISOString(),
            description: `Returned ${transformedReturnValue}.`, // Log the returned value in the description
        };
    }

    /**
     * @method transformExpression
     * @description Transforms an expression node into a string or object for use in JSON action frames. Handles index expressions, binary expressions, and literals.
     * @param {Object} expression - The AST node representing the expression.
     * @returns {Object|string} A transformed expression, either as a string for binary operations or as an object for literals and index expressions.
     */
    transformExpression(expression) {
        // Handle index expressions (e.g., array[index])
        if (expression.type === "IndexExpression") {
            return this.transformIndexExpression(expression);
        }
        // Handle binary expressions (e.g., a + b, a - b)
        else if (expression.type === "Expression") {
            const left = this.transformExpression(expression.left); // Recursively transform the left side
            const right = this.transformExpression(expression.right); // Recursively transform the right side

            // Function to wrap expressions with parentheses when needed (for operator precedence)
            const wrapInParentheses = (expr) => {
                return expr.operator &&
                    (expr.operator === "+" || expr.operator === "-")
                    ? `(${expr.left} ${expr.operator} ${expr.right})` // Add parentheses for + and - operations
                    : `${expr.left} ${expr.operator} ${expr.right}`; // Return without parentheses for higher precedence operators
            };

            // Create the transformed expression object
            const transformedExpression = {
                left: left.value || left, // Use the value if available, otherwise use the transformed left expression
                operator: expression.operator, // The operator between the left and right expressions
                right: right.value || right, // Use the value if available, otherwise use the transformed right expression
            };

            // Return the transformed expression, wrapped in parentheses if necessary
            return wrapInParentheses(transformedExpression);
        }
        // Handle cases where the expression is a declared variable
        else if (this.declaredVariables.has(expression)) {
            return {
                value: this.variables[expression] || expression, // Return the variable's value if it exists, otherwise return the expression itself
            };
        }
        // Handle number and string literals (e.g., 5, "hello")
        else if (
            expression.type === "NumberLiteral" ||
            expression.type === "StringLiteral"
        ) {
            return {
                value: expression.value, // Return the value of the literal
            };
        }
        // For any other type of expression, return it as is
        else {
            return expression;
        }
    }

    /**
     * @method transformArrayCreation
     * @description Transforms an array creation node into a JSON action frame. Initializes the array with values or as uninitialized, depending on the node definition.
     * @param {Object} node - The AST node representing the array creation.
     * @returns {Object} A JSON object representing the array creation action frame.
     */
    transformArrayCreation(node) {
        let elements;

        // If the array is of boolean type and initialized, extract values directly
        if (node.dsType === "boolean" && !node.unInitialised)
            elements = (node.values || []).map((el) => el.value);
        // Otherwise, evaluate each element in the array using the expression evaluator
        else
            elements = (node.values || []).map((el) =>
                this.expressionEvaluator.evaluateExpression(el)
            );

        // Store the created array in the variables map
        this.variables[node.varName] = elements;

        // Keep track of the initialized array and its type
        this.initializedArrays[node.varName] = node.dsType;
        this.declaredVariables.add(node.varName);

        // Determine if the array is uninitialized
        const unInitialised = node.unInitialised;
        let value;

        // If the array is of boolean type, store the boolean values directly
        if (node.dsType === "boolean") value = elements.map((el) => el);
        // Otherwise, convert the evaluated elements into the correct type
        else
            value = elements.map((el) =>
                this.expressionEvaluator.convertValue(el)
            );

        // Return the JSON frame for array creation
        return {
            line: node.line,
            operation: "create",
            dataStructure: "array",
            type: node.dsType,
            varName: node.varName,
            value: value, // Store the evaluated array elements or size
            timestamp: new Date().toISOString(),
            description: unInitialised
                ? `Created array ${node.varName} with size ${elements.length}.`
                : `Created array ${node.varName} with values [${value}].`,
        };
    }

    /**
     * @method transformRemoveOperation
     * @description Transforms a remove operation node into a JSON action frame. Evaluates the position to remove and modifies the array.
     * @param {Object} node - The AST node representing the remove operation.
     * @returns {Object} A JSON object representing the remove action frame.
     * @throws {Error} Throws an error if the array is not initialized or if the position is invalid.
     */
    transformRemoveOperation(node) {
        const line = node.line;

        // Ensure the target variable is an initialized array
        if (!this.initializedArrays.hasOwnProperty(node.varName)) {
            throw new Error(
                `Variable ${node.varName} is not an initialized array.`
            );
        }

        // Determine the data structure type (currently only arrays are supported)
        const dsType = this.initializedArrays[node.varName];

        // Evaluate the position from which the element should be removed
        const position = this.expressionEvaluator.evaluateExpression(
            node.positionToRemove
        );

        // Ensure the position is a valid number
        if (typeof position != "number") {
            throw new Error(
                `Error at line ${node.line}: Position to remove must be a number.`
            );
        }

        // Check if the position is within array bounds
        const arrayLength = this.variables[node.varName].length;
        if (position < 0 || position >= arrayLength) {
            throw new Error(
                `Error at line ${node.line}: Position ${position} is out of bounds for array ${node.varName}.`
            );
        }

        // Remove the value at the specified position
        const removedValue = this.variables[node.varName].splice(position, 1);

        // Return the JSON frame for the remove operation
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

    /**
     * @method transformArrayInsertion
     * @description Transforms an array insertion node into a JSON action frame. Inserts a value at a specified position within the array, ensuring the value type matches the array type.
     * @param {Object} node - The AST node representing the array insertion.
     * @returns {Object} A JSON object representing the insertion action frame.
     * @throws {Error} Throws an error if the array is not initialized, if the position is out of bounds, or if the value type does not match the array type.
     */
    transformArrayInsertion(node) {
        // Ensure the array has been initialized
        if (!this.variables[node.varName]) {
            throw new Error(`Array ${node.varName} not initialized.`);
        }

        // Evaluate the value to be inserted
        const value = this.expressionEvaluator.evaluateExpression(node.value);

        // Parse the insertion position
        const position = parseInt(node.position);

        // Ensure the value type matches the array's initialized type
        if (typeof value != this.initializedArrays[node.varName])
            throw new Error(
                `Array type mismatch: cannot insert value of type ${typeof value} into array of type ${
                    this.initializedArrays[node.varName]
                }.`
            );

        // Ensure the position is within the bounds of the array
        if (
            position < 0 ||
            position > this.variables[node.varName].length ||
            isNaN(position)
        ) {
            throw new Error(
                `Index is out of bounds for array insertion at line ${node.line}`
            );
        }

        // Insert the value into the array at the specified position
        this.variables[node.varName].splice(position, 0, value);

        // Return the JSON frame for the array insertion
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

    /**
     * @method transformArraySetValue
     * @description Transforms an array set value node into a JSON action frame. Sets a value at a specified index in the array, ensuring the value type matches the array type.
     * @param {Object} node - The AST node representing the array set value operation.
     * @returns {Object} A JSON object representing the set array action frame.
     * @throws {Error} Throws an error if the array is not initialized, if the index is out of bounds, or if the value type does not match the array type.
     */
    transformArraySetValue(node) {
        const varName = node.varName;

        // Evaluate the index to set the value at
        const index = this.expressionEvaluator.evaluateExpression(node.index);

        // Evaluate the value to be set, handle index expressions if present
        const setValue =
            node.setValue.type === "IndexExpression"
                ? this.transformIndexExpression(node.setValue)
                : this.expressionEvaluator.evaluateExpression(node.setValue);

        // Ensure the array is initialized before setting a value
        if (!this.initializedArrays[varName]) {
            if (this.declaredVariables.has(varName))
                throw new Error(`Variable '${varName}' is not an array.`);
            else throw new Error(`Array '${varName}' is not initialized.`);
        }

        // Ensure the target variable is an array
        if (!Array.isArray(this.variables[varName])) {
            throw new Error(`Variable '${varName}' is not an array.`);
        }

        // Ensure the index is within the array bounds
        if (index < 0 || index >= this.variables[varName].length) {
            throw new Error(
                `Index ${index} is out of bounds for array '${varName}'.`
            );
        }

        // Ensure the value type matches the array's type
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

        // Return the JSON frame for setting the array value
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

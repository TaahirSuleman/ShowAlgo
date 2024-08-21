class JsonConverter {
    constructor() {
        this.variables = {};
        this.declaredVariables = new Set();
        this.initializedArrays = new Set();
        this.currentLine = 1;
    }

    transformToFinalJSON(ir) {
        // console.log("Transforming IR to final JSON:", ir);
        return {
            actionFrames: this.transformNodes(ir.program),
        };
    }

    transformNodes(nodes) {
        // console.log("Transforming nodes:", nodes);
        return nodes.flatMap((node) => this.transformNode(node));
    }

    transformNode(node) {
        // console.log("Transforming node:", node);
        const nodeWithLine = { ...node, line: this.currentLine++ };

        switch (nodeWithLine.type) {
            case "VariableDeclaration":
                return this.transformVariableDeclaration(nodeWithLine);
            case "FunctionDeclaration":
                return this.transformFunctionDeclaration(nodeWithLine);
            case "PrintStatement":
                return this.transformPrintStatement(nodeWithLine);
            case "IfStatement":
                return this.transformIfStatement(nodeWithLine);
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
        const value = this.evaluateExpression(node.value);
        this.variables[node.name] = value;
        this.declaredVariables.add(node.name);
        let varType = this.determineType(value);

        const buildExpressionString = (expr) => {
            if (expr.type === "Expression") {
                // Check if this is a subtraction from zero (negative number)
                if (expr.operator === "-" && expr.left === 0) {
                    return `-${buildExpressionString(expr.right)}`;
                } else {
                    return `(${buildExpressionString(expr.left)} ${
                        expr.operator
                    } ${buildExpressionString(expr.right)})`;
                }
            } else {
                return String(expr); // Convert to string to avoid object errors
            }
        };

        // Generate the expression string
        let returnVal =
            node.value.type === "Expression"
                ? buildExpressionString(node.value)
                : String(value);

        // Remove outer parentheses for top-level expression
        if (
            typeof returnVal === "string" &&
            returnVal.startsWith("(") &&
            returnVal.endsWith(")")
        ) {
            returnVal = returnVal.slice(1, -1);
        }

        return {
            line: node.line,
            operation: "set",
            varName: node.name,
            type: varType,
            value: isNaN(parseInt(value)) ? value : parseInt(value),
            timestamp: new Date().toISOString(),
            description: `Set variable ${node.name} to ${returnVal}.`,
        };
    }

    determineType(value) {
        // Try to convert the value to a number
        const convertedValue = Number(value);

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
        console.log("Print vars " + this.variables["i"]);
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
            }
        } else {
            // Handle the false condition (alternate)
            this.currentLine = Math.max(
                this.currentLine,
                this.currentLine + node.consequent.length + 1
            );
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
        frames.push({
            line: this.currentLine,
            operation: "endif",
            timestamp: new Date().toISOString(),
            description: "End of if statement.",
        });
        this.currentLine++;
        return frames;
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
        console.log(conditionString);
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

        // Debugging: Print the initial condition
        console.log(`Initial condition for ${loopType}:`, node.condition);
        let bodyLineStart = node.line; // Line where loop body starts
        let bodyLineCount = 0; // Track the number of lines in the loop body

        while (this.evaluateCondition(node.condition)) {
            // Debugging: Print the current state of the variables
            //console.log(`Variables at the start of the loop:`, this.variables);
            let z = 0;
            this.currentLine = node.line + 1;
            if (this.variables["x"] == 0) {
                console.log("TRUE!");
                console.log(this.variables);
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
        console.log(this.currentLine);
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
        console.log(this.currentLine);
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
        console.log("end val " + endValue);
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
        if (!condition || !condition.operator) {
            console.error(
                "Condition is undefined or missing operator:",
                condition
            );
            return null;
        }

        let operator = condition.operator;
        if (operator === "greater") operator = ">";
        if (operator === "less") operator = "<";
        if (operator === "equal") operator = "==";

        return `${condition.left} ${operator} ${condition.right}`;
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
        if (!condition || !condition.operator) {
            console.error("Condition is malformed or undefined:", condition);
            throw new Error("Condition is malformed or undefined.");
        }

        const left = isNaN(condition.left)
            ? this.variables[condition.left]
            : parseFloat(condition.left);
        const right = isNaN(condition.right)
            ? this.variables[condition.right]
            : parseFloat(condition.right);
        if (this.variables[condition.left] == 0) console.log(left);
        console.log(right);
        const operatorsMap = {
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

    evaluateExpression(expression) {
        //console.log("x value " + this.variables["x"]);
        if (expression.type === "Expression") {
            const left = this.evaluateExpression(expression.left);
            const right = this.evaluateExpression(expression.right);
            // console.log(`${left} ${expression.operator} ${right}`);
            return this.computeExpression(left, expression.operator, right);
        } else if (this.declaredVariables.has(expression)) {
            // console.log("var name " + expression);
            return this.convertValue(this.variables[expression]);
        } else if (
            expression.type === "NumberLiteral" ||
            expression.type === "StringLiteral"
        ) {
            // console.log("Value " + this.convertValue(expression.value));
            return this.convertValue(expression.value);
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
        if (!isNaN(value)) {
            return Number(value);
        }
        return value;
    }
}

export default JsonConverter;

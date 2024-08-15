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
                return this.transformWhileLoop(nodeWithLine);
            case "LoopUntil":
                return this.transformLoopUntil(nodeWithLine);
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

        if (conditionResult) {
            // Handle the true condition (consequent)
            frames = frames.concat(this.transformNodes(node.consequent));

            // Adjust currentLine to account for alternate block length + 1
            if (node.alternate && node.alternate.length > 0) {
                this.currentLine += node.alternate.length + 1;
            } else {
                //this.currentLine++;
            }
        } else {
            // Handle the false condition (alternate)
            frames = frames.concat(this.transformNodes(node.alternate || []));

            // Simply increment the current line by 1
            this.currentLine++;
        }
        // Add the "End If" movement object
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

    transformWhileLoop(node) {
        if (!node.condition || typeof node.condition !== "object") {
            throw new Error("While loop condition is malformed or missing.");
        }

        const { left, operator, right } = node.condition;

        if (
            typeof left === "undefined" ||
            typeof operator === "undefined" ||
            typeof right === "undefined"
        ) {
            console.error("While loop condition components are undefined.", {
                left,
                operator,
                right,
            });
            throw new Error(
                "While loop condition is missing components: left, operator, or right."
            );
        }

        const conditionString = this.convertConditionToString(node.condition);
        // Initial while statement
        const actionFrames = [
            {
                line: node.line,
                operation: "while",
                condition: conditionString,
                timestamp: new Date().toISOString(),
                description: `While loop with condition ${conditionString}.`,
            },
        ];

        // Simulate the loop execution by manually evaluating the condition
        while (this.evaluateCondition(node.condition)) {
            // Add an if statement for the condition evaluation
            actionFrames.push({
                line: node.line,
                operation: "if",
                condition: conditionString,
                result: true,
                timestamp: new Date().toISOString(),
                description: `Checked if ${conditionString}.`,
            });

            // Add the body operations, ensuring the line numbers remain consistent
            const bodyFrames = this.transformNodes(node.body).map((frame) => ({
                ...frame,
                line: frame.line, // Keep the line number consistent
            }));

            actionFrames.push(...bodyFrames);
            this.currentLine = this.currentLine - node.body.length;
        }

        // Final if statement where the condition evaluates to false
        actionFrames.push({
            line: node.line,
            operation: "if",
            condition: conditionString,
            result: false,
            timestamp: new Date().toISOString(),
            description: `Checked if ${conditionString}.`,
        });

        // Add the loop end statement with line number after the while loop
        actionFrames.push({
            line: node.line + node.body.length + 1,
            operation: "loop_end",
            timestamp: new Date().toISOString(),
            description: "End of while loop",
        });

        return actionFrames;
    }

    transformLoopUntil(node) {
        const conditionString = this.convertConditionToString(node.condition);

        if (!conditionString) {
            throw new Error("Loop until condition is malformed.");
        }

        const body = this.transformNodes(node.body);
        return {
            line: node.line,
            operation: "loop_until",
            condition: conditionString,
            body: body,
            timestamp: new Date().toISOString(),
            description: `Loop until ${conditionString}.`,
        };
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

    transformLoopFromTo(node) {
        const start = this.convertValue(node.range.start);
        const end = this.convertValue(node.range.end);

        let loopVariableName = "i";
        let counter = 0;
        while (this.declaredVariables.has(loopVariableName)) {
            loopVariableName = `i${++counter}`;
        }

        this.declaredVariables.add(loopVariableName);

        const initialization = {
            line: this.currentLine++,
            operation: "set",
            varName: loopVariableName,
            type: "number",
            value: start,
            timestamp: new Date().toISOString(),
            description: `Set variable ${loopVariableName} to number ${start}.`,
        };
        this.variables[loopVariableName] = start;
        const body = this.transformNodes(node.body).map((frame) => {
            if (
                frame.operation === "print" &&
                frame.varName === null &&
                frame.literal === loopVariableName
            ) {
                return {
                    ...frame,
                    isLiteral: false,
                    varName: loopVariableName,
                    literal: null,
                };
            }
            return frame;
        });

        return [
            initialization,
            {
                line: this.currentLine++,
                operation: "loop_from_to",
                range: `${start} to ${end}`,
                body: body,
                timestamp: new Date().toISOString(),
                description: `Loop from ${start} to ${end}.`,
            },
        ];
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
            ? this.variables[condition.left] || condition.left
            : parseFloat(condition.left);
        const right = isNaN(condition.right)
            ? this.variables[condition.right] || condition.right
            : parseFloat(condition.right);

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
            return {
                left:
                    this.transformExpression(expression.left).value ||
                    this.transformExpression(expression.left),
                operator: expression.operator,
                right:
                    this.transformExpression(expression.right).value ||
                    this.transformExpression(expression.right),
            };
        } else if (expression.type === "Identifier") {
            return {
                value: this.variables[expression.value] || expression.value,
            };
        } else {
            return { value: expression.value };
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

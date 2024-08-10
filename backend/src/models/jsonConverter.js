class JsonConverter {
    constructor() {
        this.variables = {};
        this.declaredVariables = new Set(); // Track declared variable names
        this.initializedArrays = new Set();
        this.currentLine = 1; // Start the current line from 1
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
        // Add the current line number to the node and increment the line number
        const nodeWithLine = { ...node, line: this.currentLine++ };

        switch (nodeWithLine.type) {
            case "VariableDeclaration":
                return this.transformVariableDeclaration(nodeWithLine);
            case "FunctionDeclaration":
                return {
                    line: nodeWithLine.line,
                    operation: "define",
                    varName: nodeWithLine.name,
                    params: nodeWithLine.params,
                    body: this.transformNodes(nodeWithLine.body),
                    timestamp: new Date().toISOString(),
                    description: `Defined function ${
                        nodeWithLine.name
                    } with parameters ${nodeWithLine.params.join(", ")}.`,
                };
            case "PrintStatement":
                return this.transformPrintStatement(nodeWithLine);
            case "IfStatement":
                const conditionResult = this.evaluateCondition(
                    nodeWithLine.condition
                );
                const conditionString = `${this.evaluateExpression(
                    nodeWithLine.condition.left
                )} ${nodeWithLine.condition.operator} ${this.evaluateExpression(
                    nodeWithLine.condition.right
                )}`;
                return [
                    {
                        line: nodeWithLine.line,
                        operation: "if",
                        condition: conditionString,
                        result: conditionResult,
                        timestamp: new Date().toISOString(),
                        description: `Checked if ${conditionString}.`,
                    },
                    ...(conditionResult
                        ? this.transformNodes(nodeWithLine.consequent)
                        : this.transformNodes(nodeWithLine.alternate || [])),
                ];
            case "ForLoop":
                return {
                    line: nodeWithLine.line,
                    operation: "for",
                    iterator: nodeWithLine.iterator,
                    collection: nodeWithLine.collection,
                    body: this.transformNodes(nodeWithLine.body),
                    timestamp: new Date().toISOString(),
                    description: `Iterating over ${nodeWithLine.collection} with ${nodeWithLine.iterator}.`,
                };
            case "WhileLoop":
                return {
                    ...this.transformWhileLoop(nodeWithLine),
                    line: nodeWithLine.line,
                };
            case "LoopUntil":
                return this.transformLoopUntil(nodeWithLine);
            case "LoopFromTo":
                return this.transformLoopFromTo(nodeWithLine);
            case "ReturnStatement":
                const transformedReturnValue = this.transformExpression(
                    nodeWithLine.value
                );
                return {
                    line: nodeWithLine.line,
                    operation: "return",
                    value: transformedReturnValue,
                    timestamp: new Date().toISOString(),
                    description: `Returned ${JSON.stringify(
                        transformedReturnValue
                    )}.`,
                };
            case "ArrayCreation":
                return {
                    ...this.transformArrayCreation(nodeWithLine),
                    line: nodeWithLine.line,
                };
            case "ArrayInsertion":
                return {
                    ...this.transformArrayInsertion(nodeWithLine),
                    line: nodeWithLine.line,
                };
            default:
                throw new Error(`Unknown node type: ${nodeWithLine.type}`);
        }
    }

    transformVariableDeclaration(node) {
        const value = this.evaluateExpression(node.value);
        this.variables[node.name] = value;
        this.declaredVariables.add(node.name); // Add variable to declaredVariables set

        return {
            line: node.line,
            operation: "set",
            varName: node.name,
            value: value,
            timestamp: new Date().toISOString(),
            description: `Set variable ${node.name} to ${value}.`,
        };
    }

    transformPrintStatement(node) {
        const value = node.value;

        // Check if the value is a declared variable
        const isLiteral = !this.declaredVariables.has(value);

        return {
            line: node.line,
            operation: "print",
            isLiteral: isLiteral,
            varName: isLiteral ? null : value, // Use varName for variables
            literal: isLiteral ? value : null, // Use value directly for literals
            timestamp: new Date().toISOString(),
            description: `Printed ${value}.`,
        };
    }

    transformWhileLoop(node) {
        const condition = `${this.evaluateExpression(node.condition.left)} ${
            node.condition.operator
        } ${this.evaluateExpression(node.condition.right)}`;
        const body = this.transformNodes(node.body).map((frame) => {
            if (frame.operation === "set" && frame.value.operator) {
                const description = `Set variable ${frame.varName} to ${frame.value.left} ${frame.value.operator} ${frame.value.right}.`;
                return {
                    ...frame,
                    description: description,
                    value: {
                        left: frame.value.left,
                        operator: frame.value.operator,
                        right: frame.value.right,
                    },
                };
            }
            return frame;
        });
        return {
            line: node.line,
            operation: "while",
            condition: condition,
            body: body,
            timestamp: new Date().toISOString(),
            description: `While loop with condition ${condition}.`,
        };
    }

    transformLoopUntil(node) {
        const condition = `${this.evaluateExpression(node.condition.left)} ${
            node.condition.operator
        } ${this.evaluateExpression(node.condition.right)}`;
        const body = this.transformNodes(node.body).map((frame) => {
            if (frame.operation === "set" && frame.value.operator) {
                const description = `Set variable ${frame.varName} to ${frame.value.left} ${frame.value.operator} ${frame.value.right}.`;
                return {
                    ...frame,
                    description: description,
                    value: {
                        left: frame.value.left,
                        operator: frame.value.operator,
                        right: frame.value.right,
                    },
                };
            }
            return frame;
        });
        const description =
            node.condition.operator === "greater"
                ? `Loop until ${node.condition.left} is greater than ${node.condition.right}.`
                : `Loop until ${condition}.`;
        return {
            line: node.line,
            operation: "loop_until",
            condition: condition,
            body: body,
            timestamp: new Date().toISOString(),
            description: description,
        };
    }

    transformLoopFromTo(node) {
        const start = this.convertValue(node.range.start);
        const end = this.convertValue(node.range.end);

        // Determine an available variable name for the loop variable
        let loopVariableName = "i";
        let counter = 0;
        while (this.declaredVariables.has(loopVariableName)) {
            loopVariableName = `i${++counter}`;
        }

        // Add the loop variable to the declared variables
        this.declaredVariables.add(loopVariableName);

        // Initialize the loop variable
        const initialization = {
            line: this.currentLine++,
            operation: "set",
            varName: loopVariableName,
            value: start,
            timestamp: new Date().toISOString(),
            description: `Set variable ${loopVariableName} to ${start}.`,
        };

        // Transform the loop body
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

    evaluateCondition(condition) {
        const left = isNaN(condition.left)
            ? this.variables[condition.left] || condition.left
            : parseFloat(condition.left);
        const right = isNaN(condition.right)
            ? this.variables[condition.right] || condition.right
            : parseFloat(condition.right);
        switch (condition.operator) {
            case "greater":
                return left > right;
            case "less":
                return left < right;
            case "equal":
                return left === right;
            default:
                throw new Error(`Unknown operator: ${condition.operator}`);
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
        if (expression.type === "Identifier") {
            return this.variables[expression.value] || expression.value;
        } else if (
            expression.type === "NumberLiteral" ||
            expression.type === "StringLiteral"
        ) {
            return this.convertValue(expression.value);
        } else if (expression.type === "Expression") {
            const left = this.evaluateExpression(expression.left);
            const right = this.evaluateExpression(expression.right);
            return `${left} ${expression.operator} ${right}`;
        } else {
            return expression;
        }
    }

    transformArrayCreation(node) {
        const elements = (node.values || []).map((el) =>
            this.evaluateExpression(el)
        );
        this.variables[node.varName] = elements;
        this.initializedArrays.add(node.varName);
        this.declaredVariables.add(node.varName); // Add array to declaredVariables set
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

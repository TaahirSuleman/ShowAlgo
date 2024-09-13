import Converter from "./Converter.js";
class JavaScriptGenerator extends Converter {
    constructor(ir) {
        super();
        this.ir = ir;
        this.jsCode = "";
        this.declaredVariables = new Set();
        //this.variables = {};
    }

    convert(ir) {
        this.ir = ir;
        return this.generate();
    }

    generate() {
        this.jsCode += "'use strict';\n";
        this.jsCode += this.generateNodes(this.ir.program);
        return this.jsCode;
    }

    generateNodes(nodes) {
        return nodes.map((node) => this.generateNode(node)).join("\n");
    }

    generateNode(node) {
        switch (node.type) {
            case "VariableDeclaration":
                return this.generateVariableDeclaration(node);
            case "FunctionDeclaration":
                return this.generateFunctionDeclaration(node);
            case "ReturnStatement":
                return this.generateReturnStatement(node);
            case "IfStatement":
                return this.generateIfStatement(node);
            case "SubstringExpression":
                const string = this.generateExpression(expression.string);
                const start = this.generateExpression(expression.start);
                const end = this.generateExpression(expression.end);
                return `${string}.substring(${start}, ${end})`; // JS is 0-indexed, subtract 1 from start
            case "LengthExpression":
                return this.generateLengthExpression(node);
            case "IndexExpression":
                return this.generateIndexExpression(node);
            case "RemoveOperation":
                return this.generateRemoveOperation(node);
            case "ArraySetValue":
                return this.generateArraySetValue(node);
            case "SwapOperation":
                return this.generateSwapOperation(node);
            case "ForLoop":
                return this.generateForLoop(node);
            case "WhileLoop":
                return this.generateWhileLoop(node);
            case "LoopUntil": // New case for LoopUntil
                return this.generateLoopUntil(node);
            case "LoopFromTo":
                return this.generateLoopFromTo(node);
            case "PrintStatement":
                return this.generatePrintStatement(node);
            case "ArrayCreation":
                return this.generateArrayCreation(node);
            case "ArrayInsertion":
                return this.generateArrayInsertion(node);
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    generateVariableDeclaration(node) {
        const declaration = this.declaredVariables.has(node.name)
            ? `${node.name}`
            : `let ${node.name}`;
        this.declaredVariables.add(node.name);
        //this.variables[node.name] = this.generateExpression(node.value);
        return `${declaration} = ${this.generateExpression(node.value)};`;
    }

    generateFunctionDeclaration(node) {
        const params = node.params.join(", ");
        for (const param of params) {
            this.declaredVariables.add(param);
        }
        const body = this.generateNodes(node.body);
        for (const param of params) {
            this.declaredVariables.delete(param);
        }
        return `function ${node.name}(${params}) {\n${body}\n}`;
    }

    generateReturnStatement(node) {
        return `return ${this.generateExpression(node.value)};`;
    }

    generateIfStatement(node) {
        const condition = this.generateCondition(node.condition);
        const consequent = this.generateNodes(node.consequent);
        const alternate = node.alternate
            ? `else {\n${this.generateNodes(node.alternate)}\n}`
            : "";
        return `if (${condition}) {\n${consequent}\n} ${alternate}`;
    }

    generateForLoop(node) {
        const iterator = node.iterator;
        const collection = node.collection;
        this.declaredVariables.add(iterator);
        const body = this.generateNodes(node.body);
        this.declaredVariables.delete(iterator);
        return `for (const ${iterator} of ${collection}) {\n${body}\n}`;
    }

    generateWhileLoop(node) {
        const condition = this.generateCondition(node.condition);
        //console.log("HI");
        const body = this.generateNodes(node.body);
        return `while (${condition}) {\n${body}\n}`;
    }

    generateLoopUntil(node) {
        // New method for handling LoopUntil
        const flippedCondition = this.flipCondition(
            this.generateCondition(node.condition)
        );
        return this.generateWhileLoop({ ...node, condition: flippedCondition });
    }

    generatePrintStatement(node) {
        return `console.log(${this.generateExpression(node.value)});`;
    }

    generateArrayCreation(node) {
        const values = node.values
            .map((value) => this.generateExpression(value))
            .join(", ");
        return `let ${node.varName} = [${values}];`;
    }

    generateArrayInsertion(node) {
        return `${node.varName}.splice(${
            node.position
        }, 0, ${this.generateExpression(node.value)});`;
    }

    generateRemoveOperation(node) {
        return `${node.varName}.splice(${node.positionToRemove}, 1);`;
    }

    // New method to set an element at a specific index in the array
    generateArraySetValue(node) {
        return `${node.varName}[${
            node.index.value
        }] = ${this.generateExpression(node.setValue)};`;
    }

    // New method to generate access to a specific element in an array
    generateIndexExpression(node) {
        return `${node.source.value}[${this.generateExpression(node.index)}]`;
    }

    // New method to generate retrieval of array length
    generateLengthExpression(node) {
        return `${node.source}.length`;
    }

    // New method to swap two elements in an array
    generateSwapOperation(node) {
        return `let temp = ${node.varName}[${node.firstPosition.value}];
${node.varName}[${node.firstPosition.value}] = ${node.varName}[${node.secondPosition.value}];
${node.varName}[${node.secondPosition.value}] = temp;`;
    }

    generateExpression(expression, parentIsNested = false) {
        const operatorPrecedence = {
            "*": 2,
            "/": 2,
            "+": 1,
            "-": 1,
        };

        const getOperatorPrecedence = (operator) => {
            return operatorPrecedence[operator] || 0;
        };

        expression = this.ensureStructuredValue(expression); // Ensure it's structured

        switch (expression.type) {
            case "Expression": {
                const currentPrecedence = getOperatorPrecedence(
                    expression.operator
                );
                const leftIsNested =
                    expression.left && expression.left.type === "Expression";
                const rightIsNested =
                    expression.right && expression.right.type === "Expression";

                const left = this.generateExpression(
                    expression.left,
                    leftIsNested
                );
                const right = this.generateExpression(
                    expression.right,
                    rightIsNested
                );

                // Only wrap in parentheses if it's a nested expression with lower precedence
                let exprString = `${left} ${expression.operator} ${right}`;

                // Add parentheses if it's nested
                if (parentIsNested) {
                    return `(${exprString})`;
                }
                return exprString;
            }
            case "Identifier":
                return expression.value;

            case "NumberLiteral":
                return expression.value;

            case "StringLiteral":
                return `"${expression.value}"`;

            case "FunctionCall":
                const args = expression.arguments
                    .map((arg) => this.generateExpression(arg))
                    .join(", ");
                return `${expression.callee}(${args})`;

            case "SubstringExpression":
                const string = expression.string;
                const start = this.generateExpression(expression.start);
                const end = this.generateExpression(expression.end);
                return `${string}.substring(${start}, ${end})`;

            case "IndexExpression":
                return `${expression.source}[${this.generateExpression(
                    expression.index
                )}]`;

            case "LengthExpression":
                return `${expression.source}.length`;

            default:
                throw new Error(`Unknown expression type: ${expression.type}`);
        }
    }

    generateCondition(condition) {
        if (typeof condition != "object" && condition !== null) {
            return condition; // Already a structured object
        }
        //console.log(condition.left);
        const left = this.generateExpression(condition.left);
        const operator = this.getOperator(condition.operator);
        const right = this.generateExpression(condition.right);
        return `${left} ${operator} ${right}`;
    }

    getOperator(operator) {
        switch (operator) {
            case "greater":
                return ">";
            case "less":
                return "<";
            case "equal":
                return "==";
            case ">":
                return ">";
            case "<":
                return "<";
            case "==":
                return "==";
            case "!=":
                return "!=";
            case ">=":
                return ">=";
            case "<=":
                return "<=";
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
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

    ensureStructuredValue(value) {
        if (typeof value === "object" && value !== null) {
            return value; // Already a structured object
        }
        //console.log(value);
        if (this.declaredVariables.has(value)) {
            // If the value is in declaredVariables, treat it as an Identifier
            return { type: "Identifier", value: value };
        } else if (!isNaN(value)) {
            // If the value is a number, treat it as a NumberLiteral
            return { type: "NumberLiteral", value: value.toString() };
        } else if (typeof value === "string") {
            // If it's a string, treat it as a StringLiteral
            return { type: "StringLiteral", value: value };
        } else {
            throw new Error(`Unsupported value type: ${typeof value}`);
        }
    }

    generateLoopFromTo(node) {
        const loopVariable = node.loopVariable;
        const startValue = this.generateExpression(node.range.start);
        const endValue = this.generateExpression(node.range.end);

        this.declaredVariables.add(loopVariable);

        const body = this.generateNodes(node.body);

        return `for (let ${loopVariable} = ${startValue}; ${loopVariable} <= ${endValue}; ${loopVariable}++) {\n${body}\n}`;
    }
}

export default JavaScriptGenerator;

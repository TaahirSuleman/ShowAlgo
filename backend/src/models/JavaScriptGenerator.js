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
        console.log("HI");
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

    generateExpression(expression) {
        //console.log(expression);
        //console.log(this.declaredVariables);
        expression = this.ensureStructuredValue(expression); // Ensure it's structured

        switch (expression.type) {
            case "Expression":
                const left = this.generateExpression(expression.left);
                const operator = expression.operator;
                const right = this.generateExpression(expression.right);
                return `${left} ${operator} ${right}`;

            case "Identifier":
                return expression.value;

            case "NumberLiteral":
                return expression.value;

            case "StringLiteral":
                return `"${expression.value}"`;

            // Exclude ArrayLiteral as per your suggestion, unless needed later
            /*
            case "ArrayLiteral":
                return `[${expression.value
                    .map((v) => this.generateExpression(v))
                    .join(", ")}]`;
            */

            case "FunctionCall":
                const args = expression.arguments
                    .map((arg) => this.generateExpression(arg))
                    .join(", ");
                return `${expression.callee}(${args})`;

            default:
                throw new Error(`Unknown expression type: ${expression.type}`);
        }
    }

    generateCondition(condition) {
        if (typeof condition != "object" && condition !== null) {
            return condition; // Already a structured object
        }
        console.log(condition.left);
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
        console.log(value);
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

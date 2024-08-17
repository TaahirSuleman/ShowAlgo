class JavaScriptGenerator {
    constructor(ir) {
        this.ir = ir;
        this.jsCode = "";
        this.declaredVariables = new Set();
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
        return `${declaration} = ${this.generateExpression(node.value)};`;
    }

    generateFunctionDeclaration(node) {
        const params = node.params.join(", ");
        const body = this.generateNodes(node.body);
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
        const body = this.generateNodes(node.body);
        return `for (const ${iterator} of ${collection}) {\n${body}\n}`;
    }

    generateWhileLoop(node) {
        const condition = this.generateCondition(node.condition);
        const body = this.generateNodes(node.body);
        return `while (${condition}) {\n${body}\n}`;
    }

    generateLoopUntil(node) {
        // New method for handling LoopUntil
        const flippedCondition = this.flipCondition(
            this.generateCondition(node.condition)
        );
        console.log(flippedCondition);
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
        if (expression.type === "Expression") {
            const left = this.generateExpression(expression.left);
            const operator = expression.operator;
            const right = this.generateExpression(expression.right);
            return `${left} ${operator} ${right}`;
        } else if (expression.type === "Identifier") {
            return expression.value;
        } else if (expression.type === "NumberLiteral") {
            return expression.value;
        } else if (expression.type === "StringLiteral") {
            return `"${expression.value}"`;
        } else if (expression.type === "ArrayLiteral") {
            return `[${expression.value
                .map((v) => this.generateExpression(v))
                .join(", ")}]`;
        } else if (expression.type === "FunctionCall") {
            const args = expression.arguments
                .map((arg) => this.generateExpression(arg))
                .join(", ");
            return `${expression.callee}(${args})`;
        } else {
            throw new Error(`Unknown expression type: ${expression.type}`);
        }
    }

    generateCondition(condition) {
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
                return "===";
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
}

export default JavaScriptGenerator;

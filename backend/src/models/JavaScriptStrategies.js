class VariableDeclarationStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const declaration = this.generator.declaredVariables.has(this.node.name)
            ? `${this.node.name}`
            : `let ${this.node.name}`;
        this.generator.declaredVariables.add(this.node.name);
        return `${declaration} = ${this.generator.generateExpression(
            this.node.value
        )};`;
    }
}

class FunctionDeclarationStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const params = this.node.params.join(", ");
        for (const param of this.node.params) {
            this.generator.declaredVariables.add(param);
        }
        const body = this.generator.generateNodes(this.node.body);
        for (const param of this.node.params) {
            this.generator.declaredVariables.delete(param);
        }
        return `function ${this.node.name}(${params}) {\n${body}\n}`;
    }
}

class ReturnStatementStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        return `return ${this.generator.generateExpression(this.node.value)};`;
    }
}

class IfStatementStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const condition = this.generator.generateCondition(this.node.condition);
        const consequent = this.generator.generateNodes(this.node.consequent);
        const alternate = this.node.alternate
            ? `else {\n${this.generator.generateNodes(this.node.alternate)}\n}`
            : "";
        return `if (${condition}) {\n${consequent}\n} ${alternate}`;
    }
}

class ForLoopStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const iterator = this.node.iterator;
        const collection = this.node.collection;
        this.generator.declaredVariables.add(iterator);
        const body = this.generator.generateNodes(this.node.body);
        this.generator.declaredVariables.delete(iterator);
        return `for (const ${iterator} of ${collection}) {\n${body}\n}`;
    }
}

class WhileLoopStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const condition = this.generator.generateCondition(this.node.condition);
        const body = this.generator.generateNodes(this.node.body);
        return `while (${condition}) {\n${body}\n}`;
    }
}

class LoopFromToStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const loopVariable = this.node.loopVariable;
        const startValue = this.generator.generateExpression(
            this.node.range.start
        );
        const endValue = this.generator.generateExpression(this.node.range.end);
        const body = this.generator.generateNodes(this.node.body);

        return `for (let ${loopVariable} = ${startValue}; ${loopVariable} <= ${endValue}; ${loopVariable}++) {\n${body}\n}`;
    }
}

class LoopUntilStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const flippedCondition = this.generator.flipCondition(
            this.generator.generateCondition(this.node.condition)
        );
        return new WhileLoopStrategy(
            { ...this.node, condition: flippedCondition },
            this.generator
        ).generate();
    }
}

class PrintStatementStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        return `console.log(${this.generator.generateExpression(
            this.node.value
        )});`;
    }
}

class ArrayCreationStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const values = this.node.values
            .map((value) => this.generator.generateExpression(value))
            .join(", ");
        return `let ${this.node.varName} = [${values}];`;
    }
}

class ArrayInsertionStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        return `${this.node.varName}.splice(${
            this.node.position
        }, 0, ${this.generator.generateExpression(this.node.value)});`;
    }
}

class SubstringExpressionStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const string = this.generator.generateExpression(this.node.string);
        const start = this.generator.generateExpression(this.node.start);
        const end = this.generator.generateExpression(this.node.end);
        return `${string}.substring(${start} - 1, ${end})`;
    }
}

class LengthExpressionStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const source = this.generator.generateExpression(this.node.source);
        return `${source}.length`;
    }
}

class IndexExpressionStrategy {
    constructor(node, generator) {
        this.node = node;
        this.generator = generator;
    }

    generate() {
        const stringVar = this.generator.generateExpression(this.node.source);
        const index = this.generator.generateExpression(this.node.index);
        return `${stringVar}.charAt(${index} - 1)`;
    }
}

export {
    VariableDeclarationStrategy,
    FunctionDeclarationStrategy,
    ReturnStatementStrategy,
    IfStatementStrategy,
    ForLoopStrategy,
    WhileLoopStrategy,
    LoopFromToStrategy,
    LoopUntilStrategy,
    PrintStatementStrategy,
    ArrayCreationStrategy,
    ArrayInsertionStrategy,
    SubstringExpressionStrategy,
    LengthExpressionStrategy,
    IndexExpressionStrategy,
};

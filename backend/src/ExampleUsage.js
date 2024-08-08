import Transformer from "./helpers/transformer.js";
import Program from "./models/ast/Program.js";
import VariableDeclaration from "./models/ast/VariableDeclaration.js";
import PrintStatement from "./models/ast/PrintStatement.js";
import IfStatement from "./models/ast/IfStatement.js";
import FunctionDeclaration from "./models/ast/FunctionDeclaration.js";
import ReturnStatement from "./models/ast/ReturnStatement.js";
import ForLoop from "./models/ast/ForLoop.js";
import WhileLoop from "./models/ast/WhileLoop.js";
import Expression from "./models/ast/Expression.js";
import NumberLiteral from "./models/ast/NumberLiteral.js";
import StringLiteral from "./models/ast/StringLiteral.js";
import Identifier from "./models/ast/Identifier.js";

class ExampleUsage {
    static runExample() {
        const transformer = new Transformer();

        // Example AST
        const ast = new Program([
            new VariableDeclaration("x", null, new NumberLiteral("10")),
            new FunctionDeclaration(
                "add_numbers",
                ["a", "b"],
                [
                    new ReturnStatement(
                        new Expression(
                            new Identifier("a"),
                            "+",
                            new Identifier("b")
                        )
                    ),
                ]
            ),
            new IfStatement(
                new Expression(
                    new Identifier("x"),
                    "greater",
                    new NumberLiteral("5")
                ),
                [new PrintStatement(new StringLiteral("x is greater than 5"))],
                [
                    new PrintStatement(
                        new StringLiteral("x is not greater than 5")
                    ),
                ]
            ),
            new VariableDeclaration(
                "nums",
                null,
                new StringLiteral("[1, 2, 3]")
            ),
            new ForLoop("num", "nums", [
                new PrintStatement(new Identifier("num")),
            ]),
            new WhileLoop(
                new Expression(
                    new Identifier("x"),
                    ">",
                    new NumberLiteral("0")
                ),
                [
                    new PrintStatement(new Identifier("x")),
                    new VariableDeclaration(
                        "x",
                        null,
                        new Expression(
                            new Identifier("x"),
                            "-",
                            new NumberLiteral("1")
                        )
                    ),
                ]
            ),
        ]);

        // Transform the AST
        const transformed = transformer.transform(ast);

        // Log the results to the console
        console.log(JSON.stringify(transformed, null, 2));
    }
}

// Run the example
ExampleUsage.runExample();

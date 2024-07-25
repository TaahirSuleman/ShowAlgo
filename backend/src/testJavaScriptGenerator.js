import fs from "fs";
import { exec } from "child_process";
import JavaScriptGenerator from "./helpers/JavaScriptGenerator.js";

function writeAndExecuteCode(jsCode, filePath) {
    fs.writeFileSync(filePath, jsCode);
    exec(`node ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing ${filePath}:`, stderr);
        } else {
            console.log(`Output for ${filePath}:`);
            console.log(stdout);
        }
    });
}

// Test cases
const testCases = [
    {
        description: "Basic variable assignment and print",
        ir: {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "a",
                    value: { type: "NumberLiteral", value: "5" },
                },
                {
                    type: "VariableDeclaration",
                    name: "b",
                    value: { type: "NumberLiteral", value: "10" },
                },
                {
                    type: "VariableDeclaration",
                    name: "sum",
                    value: {
                        type: "Expression",
                        left: { type: "Identifier", value: "a" },
                        operator: "+",
                        right: { type: "Identifier", value: "b" },
                    },
                },
                {
                    type: "PrintStatement",
                    value: { type: "Identifier", value: "sum" },
                },
            ],
        },
    },
    {
        description: "If-else statement",
        ir: {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "x",
                    value: { type: "NumberLiteral", value: "20" },
                },
                {
                    type: "IfStatement",
                    condition: {
                        left: { type: "Identifier", value: "x" },
                        operator: ">",
                        right: { type: "NumberLiteral", value: "10" },
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: {
                                type: "StringLiteral",
                                value: "x is greater than 10",
                            },
                        },
                        {
                            type: "IfStatement",
                            condition: {
                                left: { type: "Identifier", value: "x" },
                                operator: ">",
                                right: { type: "NumberLiteral", value: "15" },
                            },
                            consequent: [
                                {
                                    type: "PrintStatement",
                                    value: {
                                        type: "StringLiteral",
                                        value: "x is also greater than 15",
                                    },
                                },
                            ],
                        },
                    ],
                    alternate: [
                        {
                            type: "PrintStatement",
                            value: {
                                type: "StringLiteral",
                                value: "x is less than or equal to 10",
                            },
                        },
                    ],
                },
            ],
        },
    },
    {
        description: "Function definition and call",
        ir: {
            program: [
                {
                    type: "FunctionDeclaration",
                    name: "checkNumber",
                    params: ["num"],
                    body: [
                        {
                            type: "IfStatement",
                            condition: {
                                left: { type: "Identifier", value: "num" },
                                operator: ">",
                                right: { type: "NumberLiteral", value: "0" },
                            },
                            consequent: [
                                {
                                    type: "ReturnStatement",
                                    value: {
                                        type: "StringLiteral",
                                        value: "Positive",
                                    },
                                },
                            ],
                            alternate: [
                                {
                                    type: "ReturnStatement",
                                    value: {
                                        type: "StringLiteral",
                                        value: "Non-positive",
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "PrintStatement",
                    value: {
                        type: "FunctionCall",
                        callee: "checkNumber",
                        arguments: [{ type: "NumberLiteral", value: "-5" }],
                    },
                },
            ],
        },
    },
    {
        description: "Array operations",
        ir: {
            program: [
                {
                    type: "ArrayCreation",
                    varName: "arr",
                    values: [
                        { type: "NumberLiteral", value: "1" },
                        { type: "NumberLiteral", value: "2" },
                        { type: "NumberLiteral", value: "3" },
                    ],
                },
                {
                    type: "ForLoop",
                    iterator: "item",
                    collection: "arr",
                    body: [
                        {
                            type: "PrintStatement",
                            value: { type: "Identifier", value: "item" },
                        },
                    ],
                },
                {
                    type: "ArrayInsertion",
                    varName: "arr",
                    position: 2,
                    value: { type: "NumberLiteral", value: "4" },
                },
                {
                    type: "ForLoop",
                    iterator: "item",
                    collection: "arr",
                    body: [
                        {
                            type: "PrintStatement",
                            value: { type: "Identifier", value: "item" },
                        },
                    ],
                },
            ],
        },
    },
    {
        description: "Complex test case",
        ir: {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "x",
                    value: { type: "NumberLiteral", value: "10" },
                },
                {
                    type: "FunctionDeclaration",
                    name: "add_numbers",
                    params: ["a", "b"],
                    body: [
                        {
                            type: "ReturnStatement",
                            value: {
                                type: "Expression",
                                left: { type: "Identifier", value: "a" },
                                operator: "+",
                                right: { type: "Identifier", value: "b" },
                            },
                        },
                    ],
                },
                {
                    type: "IfStatement",
                    condition: {
                        left: { type: "Identifier", value: "x" },
                        operator: "greater",
                        right: { type: "NumberLiteral", value: "5" },
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: {
                                type: "StringLiteral",
                                value: "x is greater than 5",
                            },
                        },
                    ],
                    alternate: [
                        {
                            type: "PrintStatement",
                            value: {
                                type: "StringLiteral",
                                value: "x is not greater than 5",
                            },
                        },
                    ],
                },
                {
                    type: "ArrayCreation",
                    varName: "nums",
                    values: [
                        { type: "NumberLiteral", value: "1" },
                        { type: "NumberLiteral", value: "2" },
                        { type: "NumberLiteral", value: "3" },
                    ],
                },
                {
                    type: "ForLoop",
                    iterator: "num",
                    collection: "nums",
                    body: [
                        {
                            type: "PrintStatement",
                            value: { type: "Identifier", value: "num" },
                        },
                    ],
                },
                {
                    type: "WhileLoop",
                    condition: {
                        left: { type: "Identifier", value: "x" },
                        operator: ">",
                        right: { type: "NumberLiteral", value: "0" },
                    },
                    body: [
                        {
                            type: "PrintStatement",
                            value: { type: "Identifier", value: "x" },
                        },
                        {
                            type: "VariableDeclaration",
                            name: "x",
                            value: {
                                type: "Expression",
                                left: { type: "Identifier", value: "x" },
                                operator: "-",
                                right: { type: "NumberLiteral", value: "1" },
                            },
                        },
                    ],
                },
            ],
        },
    },
];

// Run test cases
testCases.forEach((testCase, index) => {
    const generator = new JavaScriptGenerator(testCase.ir);
    const jsCode = generator.generate();
    const filePath = `generatedCode${index + 1}.js`;
    console.log(`Generated JavaScript for ${testCase.description}:`);
    console.log(jsCode);

    writeAndExecuteCode(jsCode, filePath);
});

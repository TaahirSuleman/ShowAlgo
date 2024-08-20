import { expect } from "chai";
import JavaScriptGenerator from "../src/helpers/JavaScriptGenerator.js";

describe("JavaScriptGenerator", () => {
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
            expectedJsCode: `
'use strict';
let a = 5;
let b = 10;
let sum = a + b;
console.log(sum);`.trim(),
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
                                    right: {
                                        type: "NumberLiteral",
                                        value: "15",
                                    },
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
            expectedJsCode: `
'use strict';
let x = 20;
if (x > 10) {
console.log("x is greater than 10");
if (x > 15) {
console.log("x is also greater than 15");
} 
} else {
console.log("x is less than or equal to 10");
}`.trim(),
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
                                    right: {
                                        type: "NumberLiteral",
                                        value: "0",
                                    },
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
            expectedJsCode: `
'use strict';
function checkNumber(num) {
if (num > 0) {
return "Positive";
} else {
return "Non-positive";
}
}
console.log(checkNumber(-5));`.trim(),
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
            expectedJsCode: `
'use strict';
let arr = [1, 2, 3];
for (const item of arr) {
console.log(item);
}
arr.splice(2, 0, 4);
for (const item of arr) {
console.log(item);
}`.trim(),
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
                                    right: {
                                        type: "NumberLiteral",
                                        value: "1",
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            expectedJsCode: `
'use strict';
let x = 10;
function add_numbers(a, b) {
return a + b;
}
if (x > 5) {
console.log("x is greater than 5");
} else {
console.log("x is not greater than 5");
}
let nums = [1, 2, 3];
for (const num of nums) {
console.log(num);
}
while (x > 0) {
console.log(x);
x = x - 1;
}`.trim(),
        },
        {
            description: "Simple LoopUntil",
            ir: {
                program: [
                    {
                        type: "VariableDeclaration",
                        name: "x",
                        value: {
                            type: "NumberLiteral",
                            value: "0",
                        },
                    },
                    {
                        type: "LoopUntil",
                        condition: {
                            left: { type: "Identifier", value: "x" },
                            operator: ">",
                            right: { type: "NumberLiteral", value: "5" },
                        },
                        body: [
                            {
                                type: "VariableDeclaration",
                                name: "x",
                                value: {
                                    type: "Expression",
                                    left: { type: "Identifier", value: "x" },
                                    operator: "+",
                                    right: {
                                        type: "NumberLiteral",
                                        value: "1",
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            expectedJsCode: `
'use strict';
let x = 0;
while (x <= 5) {
x = x + 1;
}`.trim(),
        },
        {
            description: "LoopUntil with Print Statement",
            ir: {
                program: [
                    {
                        type: "VariableDeclaration",
                        name: "counter",
                        value: {
                            type: "NumberLiteral",
                            value: "10",
                        },
                    },
                    {
                        type: "LoopUntil",
                        condition: {
                            left: { type: "Identifier", value: "counter" },
                            operator: "==",
                            right: { type: "NumberLiteral", value: "0" },
                        },
                        body: [
                            {
                                type: "PrintStatement",
                                value: "counter",
                            },
                            {
                                type: "VariableDeclaration",
                                name: "counter",
                                value: {
                                    type: "Expression",
                                    left: {
                                        type: "Identifier",
                                        value: "counter",
                                    },
                                    operator: "-",
                                    right: {
                                        type: "NumberLiteral",
                                        value: "1",
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            expectedJsCode: `
'use strict';
let counter = 10;
while (counter != 0) {
console.log(counter);
counter = counter - 1;
}`.trim(),
        },
    ];

    testCases.forEach(({ description, ir, expectedJsCode }) => {
        it(`should correctly generate JavaScript for: ${description}`, () => {
            const generator = new JavaScriptGenerator(ir);
            const jsCode = generator.generate().trim();
            expect(jsCode).to.equal(expectedJsCode);
        });
    });
});

import { expect } from "chai";
import JSGenerator from "../src/models/jsGenerator.js";

describe("JSGenerator", () => {
    it("should convert function declaration pseudocode to JavaScript", () => {
        const pseudocode = `
        DEFINE add_numbers WITH PARAMETERS (a, b)
            RETURN a + b
        END FUNCTION
    `;

        const expectedJavaScript = `
'use strict';
function add_numbers(a, b) {
return a + b;
}
    `.trim();

        const result = JSGenerator.convert(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });
    it("should convert a LoopFromTo pseudocode to JavaScript", () => {
        const pseudocode = `
        SET sum TO 0
        LOOP i FROM 1 TO 3
            PRINT i
            SET sum TO sum + i
        END LOOP
    `;

        const expectedJavaScript = `
        'use strict';
let sum = 0;
for (let i = 1; i <= 3; i++) {
console.log(i);
sum = sum + i;
}
    `.trim();

        const result = JSGenerator.convert(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });
    it("should convert simple variable assignment pseudocode to JavaScript", () => {
        const pseudocode = `
            SET x TO 10
            SET y TO 5
            SET z TO x + y
        `;

        const expectedJavaScript = `
            'use strict';
let x = 10;
let y = 5;
let z = x + y;
        `.trim();

        const result = JSGenerator.convert(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });

    it("should convert a simple loop pseudocode to JavaScript", () => {
        const pseudocode = `
            SET x TO 1
            LOOP UNTIL x >= 5
                SET x TO x + 1
            END LOOP
        `;

        const expectedJavaScript = `
            'use strict';
let x = 1;
while (x < 5) {
x = x + 1;
}
        `.trim();

        const result = JSGenerator.convert(pseudocode);
        expect(result).to.equal(expectedJavaScript);
    });

    it("should convert if-else pseudocode to JavaScript", () => {
        const pseudocode = `
            SET x TO 10
            IF x > 5 THEN
                PRINT "x is greater than 5"
            OTHERWISE
                PRINT "x is 5 or less"
            END IF
        `;

        const expectedJavaScript = `
            'use strict';
let x = 10;
if (x > 5) {
console.log("x is greater than 5");
} else {
console.log("x is 5 or less");
}
        `.trim();

        const result = JSGenerator.convert(pseudocode);
        expect(result).to.equal(expectedJavaScript);
    });

    it("should convert a for loop pseudocode to JavaScript", () => {
        const pseudocode = `
            CREATE number array as nums WITH values [1, 2, 3]
            FOR EACH num IN nums
                PRINT num
            END FOR
        `;

        const expectedJavaScript = `
            'use strict';
let nums = [1, 2, 3];
for (const num of nums) {
console.log(num);
}
        `.trim();

        const result = JSGenerator.convert(pseudocode);
        expect(result).to.equal(expectedJavaScript);
    });
});

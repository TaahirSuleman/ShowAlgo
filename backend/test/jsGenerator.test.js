import { expect } from "chai";
import JavaScriptGenerator from "../src/models/JavaScriptGenerator.js";
import Processor from "../src/models/Processor.js";

describe("Processor with JavaScriptGenerator", () => {
    let processor;

    // Set up the processor with JavaScriptGenerator before each test
    beforeEach(() => {
        const jsGenerator = new JavaScriptGenerator();
        processor = new Processor(jsGenerator);
    });

    it("should correctly process complex nested parentheses with mixed operators", () => {
        const pseudocode = `
            SET result TO 5 * (2 + (3 - 1) / 2) + 4;
        `;

        const expectedJavaScript = `
            'use strict';
    let result = 5 * (2 + (3 - 1) / 2) + 4;
        `.trim();

        const result = processor.process(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });

    it("should correctly process arithmetic with parentheses to force precedence", () => {
        const pseudocode = `
            SET result TO (2 + 3) * 4
        `;

        const expectedJavaScript = `
            'use strict';
let result = (2 + 3) * 4;
        `.trim();

        const result = processor.process(pseudocode);
        expect(result).to.equal(expectedJavaScript);
    });

    it("should correctly process arithmetic with addition and multiplication", () => {
        const pseudocode = `
            SET result TO 2 + 3 * 4
        `;

        const expectedJavaScript = `
            'use strict';
let result = 2 + 3 * 4;
        `.trim();

        const result = processor.process(pseudocode);
        expect(result).to.equal(expectedJavaScript);
    });

    it("should correctly process a substring operation", () => {
        const pseudocode = `
            SET partOfName TO SUBSTRING OF fullName FROM 0 TO 3
        `;

        const expectedJavaScript = `
            'use strict';
let partOfName = fullName.substring(0, 3);
        `.trim();

        const result = processor.process(pseudocode);
        expect(result).to.equal(expectedJavaScript);
    });

    it("should correctly process string indexing", () => {
        const pseudocode = `
            SET firstCharacter TO CHARACTER AT 0 OF fullName
        `;

        const expectedJavaScript = `
            'use strict';
let firstCharacter = fullName[0];
        `.trim(); // Update the test to expect array-like indexing

        const result = processor.process(pseudocode);
        expect(result).to.equal(expectedJavaScript);
    });

    it("should correctly process length of string operation", () => {
        const pseudocode = `
            SET nameLength TO LENGTH OF fullName
        `;

        const expectedJavaScript = `
            'use strict';
let nameLength = fullName.length;
        `.trim();

        const result = processor.process(pseudocode);
        expect(result).to.equal(expectedJavaScript);
    });

    it("should convert array creation pseudocode to JavaScript", () => {
        const pseudocode = `
            CREATE number array AS myArray WITH values [1, 2, 3];
        `;

        const expectedJavaScript = `
'use strict';
let myArray = [1, 2, 3];
        `.trim();

        const result = processor.process(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });

    it("should convert array insertion pseudocode to JavaScript", () => {
        const pseudocode = `
            INSERT 5 TO myArray AT position 2;
        `;

        const expectedJavaScript = `
'use strict';
myArray.splice(2, 0, 5);
        `.trim();

        const result = processor.process(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });

    it("should convert array removal pseudocode to JavaScript", () => {
        const pseudocode = `
            REMOVE element 2 from myArray;
        `;

        const expectedJavaScript = `
'use strict';
myArray.splice(2, 1);
        `.trim();

        const result = processor.process(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });

    it("should convert array set element pseudocode to JavaScript", () => {
        const pseudocode = `
            SET element 1 OF myArray TO 10;
        `;

        const expectedJavaScript = `
'use strict';
myArray[1] = 10;
        `.trim();

        const result = processor.process(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });

    it("should convert array get element pseudocode to JavaScript", () => {
        const pseudocode = `
            SET firstElement TO ELEMENT AT 0 OF myArray;
        `;

        const expectedJavaScript = `
'use strict';
let firstElement = myArray[0];
        `.trim();

        const result = processor.process(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });

    it("should convert array length pseudocode to JavaScript", () => {
        const pseudocode = `
            SET totalLength TO LENGTH OF myArray;
        `;

        const expectedJavaScript = `
'use strict';
let totalLength = myArray.length;
        `.trim();

        const result = processor.process(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });

    it("should convert array swap elements pseudocode to JavaScript", () => {
        const pseudocode = `
            SWAP POSITION 1 WITH POSITION 2 IN myArray;
        `;

        const expectedJavaScript = `
'use strict';
let temp = myArray[1];
myArray[1] = myArray[2];
myArray[2] = temp;
        `.trim();

        const result = processor.process(pseudocode).trim();
        expect(result).to.equal(expectedJavaScript);
    });
});

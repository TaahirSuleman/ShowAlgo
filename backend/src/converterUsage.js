import PseudocodeProcessor from "./models/PseudocodeProcessor.js";

const pseudocode = `
DEFINE add_numbers WITH PARAMETERS (a, b)
RETURN a + b
END FUNCTION
SET x TO 10
PRINT "Hello, World!"
IF x IS greater THAN 5 THEN
    PRINT "x is greater than 5"
OTHERWISE
    PRINT "x is not greater than 5"
END IF
`;

const processor = new PseudocodeProcessor();
const finalJSON = processor.process(pseudocode);

console.log(JSON.stringify(finalJSON, null, 2));

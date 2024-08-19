import JSGenerator from "../models/jsGenerator.js";

function testUserCode(userSPLCode) {
    const userJSCode = JSGenerator.convert(userSPLCode);

    return userJSCode;
}

const exampleUserCode = 
`SET x to number 7
SET name to string "Alice"

DEFINE add_numbers WITH PARAMETERS (a, b)
    RETURN a + b
END FUNCTION
`;

const test = testUserCode(exampleUserCode);

console.log(test);

export default testUserCode;
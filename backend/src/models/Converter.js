/**
 * Interface-like definition for Converter
 * This is a conceptual interface.
 * Implementing classes should have a `convert` method.
 */

/**
 * @interface
 */
class Converter {
    /**
     * Converts the intermediate representation (IR) into the final format.
     * @param {Object} ir - The intermediate representation to convert.
     * @returns {Object} The converted representation.
     */
    convert(ir) {
        throw new Error("Method 'convert()' must be implemented.");
    }
}
export default Converter;

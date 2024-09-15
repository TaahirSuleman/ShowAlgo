/**
 * Conceptual interface for Converter.
 * This serves as a base class for any converter that transforms
 * intermediate representation (IR) into a final format.
 *
 * Classes implementing this interface must define a `convert` method.
 * @author Taahir Suleman
 */

/**
 * @interface
 */
class Converter {
    /**
     * Converts the intermediate representation (IR) into a final format.
     * This method must be implemented by any class extending the Converter interface.
     *
     * @param {Object} ir - The intermediate representation that will be converted.
     * @returns {Object} The converted representation in the final format.
     * @throws {Error} Throws an error if the method is not implemented in the subclass.
     */
    convert(ir) {
        throw new Error("Method 'convert()' must be implemented.");
    }
}

export default Converter;

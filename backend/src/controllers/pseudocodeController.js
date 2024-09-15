import Processor from "../models/Processor.js";
import JsonConverter from "../models/JsonConverter.js";

/**
 * Asynchronous function to handle pseudocode execution requests.
 *
 * This function receives pseudocode from the client through a request,
 * processes it using the Processor class with a JsonConverter instance,
 * and sends back the result as a JSON response. If any errors occur during
 * the processing of pseudocode, it catches the error and responds with an error message.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} res - The response object used to send the result back to the client.
 * @returns {Promise<void>} A promise that resolves when the processing is complete and a response is sent.
 *
 * @author Taahir Suleman
 */
export const runPseudocode = async (req, res) => {
    try {
        const { code } = req.body; // Extract pseudocode from the request body

        // Create an instance of the Processor with the JSONConverter
        const jsonConverter = new JsonConverter();
        const processor = new Processor(jsonConverter);

        // Process the pseudocode
        const result = processor.process(code);

        // Send the result back as a JSON response
        res.status(200).json({ result });
    } catch (error) {
        // Handle errors that occur during pseudocode processing
        res.status(500).json({
            message: "Error processing pseudocode",
            error: error.message,
        });
    }
};

import PseudocodeProcessor from "../models/PseudocodeProcessor.js";

export const runPseudocode = async (req, res) => {
    try {
        const { code } = req.body;
        const result = PseudocodeProcessor.process(code);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({
            message: "Error processing pseudocode",
            error: error.message,
        });
    }
};

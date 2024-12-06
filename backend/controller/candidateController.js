const Candidate = require('../models/candidateModel');
const { parseExcel } = require('../utils/excelParser');

const uploadCandidates = async (req, res) => {
    try {
        // Parse candidates from the uploaded Excel file
        const candidates = await parseExcel(req.file.path);

        const results = await Promise.allSettled(
            candidates.map(async (candidate) => {
                try {
                    // Update or insert candidate based on their email
                    await Candidate.updateOne(
                        { email: candidate.email }, // Match based on email
                        { $set: candidate },        // Update fields
                        { upsert: true }            // Insert if it doesn't exist
                    );
                    return { status: 'fulfilled', email: candidate.email };
                } catch (err) {
                    console.error(`Error processing candidate: ${candidate.email}`, err);
                    throw new Error(`Failed to process candidate: ${candidate.email}`);
                }
            })
        );

        // Collect errors and successful operations
        const errors = results.filter(result => result.status === 'rejected');
        const successes = results.filter(result => result.status === 'fulfilled');

        if (errors.length > 0) {
            return res.status(500).send({
                message: `${errors.length} records failed to process.`,
                errors: errors.map(err => err.reason.message),
                processed: successes.map(success => success.email),
            });
        }

        res.send({
            message: "All records have been successfully uploaded!",
            processed: successes.map(success => success.email),
        });

    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).send({
            message: "Error parsing Excel file",
            error: error.message,
        });
    }
};

module.exports = { uploadCandidates };

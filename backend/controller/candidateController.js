const async = require('async');
const Candidate = require('../models/candidateModel');
const { parseExcel } = require('../excelParser')

const uploadCandidates = async (req, res) => {
    try {
        const candidates = await parseExcel(req.file.path);

        const successes = [];
        const errors = [];

        await new Promise((resolve, reject) => {
            async.eachSeries(
                candidates,
                async (candidate, callback) => {
                    try {
                        const existingCandidate = await Candidate.findOne({ email: candidate.email });

                        if (existingCandidate) {
                            console.log(`Duplicate candidate found: ${candidate.email}`);
                        } else {
                            await Candidate.updateOne(
                                { email: candidate.email },
                                { $set: candidate },
                                { upsert: true }
                            );
                            successes.push(candidate.email);
                        }
                    } catch (err) {
                        console.error(`Error processing candidate: ${candidate.email}`, err);
                        errors.push(`Failed to process candidate: ${candidate.email}`);
                        callback(err);
                    }
                },
                (err) => {
                    if (err) reject(err); 
                    else resolve();
                }
            );
        });

        if (errors.length > 0) {
            return res.status(500).send({
                message: `${errors.length} records failed to process.`,
                errors: errors,
                processed: successes,
            });
        }

        res.send({
            message: "All records have been successfully uploaded!",
            processed: successes,
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

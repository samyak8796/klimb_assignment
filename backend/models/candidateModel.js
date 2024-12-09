const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
    {
        nameOfTheCandidate: {
            type: String,
            required: [true, 'Candidate name is required'],
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'],
        },
        mobileNo: {
            type: String,
            required: [true, 'Mobile number is required'],
            trim: true,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
        },
        dateOfBirth: {
            type: String,
            required: [true, 'Date of birth is required'],
            match: [/^\d{4}-\d{2}-\d{2}$/, 'Please use the format YYYY-MM-DD'],
        },
        workExperience: {
            type: String,
            trim: true,
        },
        resumeTitle: {
            type: String,
            trim: true,
        },
        currentLocation: {
            type: String,
            trim: true,
        },
        postalAddress: {
            type: String,
            trim: true,
        },
        currentEmployer: {
            type: String,
            trim: true,
        },
        currentDesignation: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, 
    }
);

candidateSchema.index({ email: 1 });

module.exports = mongoose.model('Candidate', candidateSchema);

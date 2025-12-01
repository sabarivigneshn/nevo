const Joi = require('joi');
const today = new Date();
const maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

const availabilitySchema = Joi.object({
    vehicleType: Joi.string().max(100).required(),
    startDateTime: Joi.date().iso().min(today).max(maxDate).required(),
    location: Joi.string().required(),
    notes: Joi.string().optional()
});

module.exports = availabilitySchema;

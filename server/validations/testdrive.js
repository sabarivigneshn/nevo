const Joi = require('joi');
const today = new Date();
const maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);


const testDriveSchema = Joi.object({
  vehicleId: Joi.string().required(),
  startDateTime: Joi.date().iso().min(today).max(maxDate).required(),
  durationMins:Joi.string().default(45).optional(),
  customerName: Joi.string().min(3).max(100).required(),
  customerPhone: Joi.string().pattern(/^\+[1-9]\d{7,14}$/).required(),
  customerEmail: Joi.string().email({ tlds: false }).required()
});

module.exports = testDriveSchema;

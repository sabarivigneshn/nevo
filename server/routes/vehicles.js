var express = require('express');
var router = express.Router();

const validate = require('../middlewares/validate');
const availabilitySchema = require('../validations/availability');
const testDriveSchema = require('../validations/testdrive');
const vehicleService = require('../services/vehicleService')

router.get('/', function (req, res, next) {
  try {
    const vehicleList = vehicleService.getAllVehicles()
    res.json(vehicleList)
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      error: 'Server Error',
      message: errorMessage
    });
  }

})

router.post('/availability', validate(availabilitySchema), function (req, res, next) {
  try {
    const isVehicleAvailable = vehicleService.getVehicleAvailability(req.body)
    const availabiltyResponse = {
      ...req.body,
      ...isVehicleAvailable
    }
    res.json(availabiltyResponse)
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      error: 'Server Error',
      message: errorMessage
    });
  }
});

router.post('/test-drive', validate(testDriveSchema), function (req, res, next) {
  try {
    const scheduleResults = vehicleService.scheduleTestDrive(req.body);
    res.json({...req.body, ...scheduleResults})
  } catch(err) {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      error: 'Server Error',
      message: errorMessage
    });
  }
})

module.exports = router;

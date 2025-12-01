// const axios = require('axios').default;
const _axios = require('axios');
const axios = (_axios && _axios.default) || _axios;
const { serverBaseUrl, apiEndpoints } = require('../config/config.json')


async function checkVehicleAvailability(request) {
    try {
        console.log('checkVehicleAvailability request:'); // debug log
        const vehicleAvailablityResponse = await axios.post(apiEndpoints.checkAvailability, request)
         console.log('checkVehicleAvailability request successful'); // debug log
        return { success: true, data: vehicleAvailablityResponse.data }

    } catch (error) {
         console.log('checkVehicleAvailability request error:'); // debug log
        return {
            success: false,
            message: error.response?.data?.message || "Something went wrong",
            status: error.response?.status || 500,
        };
    }
}

module.exports = {
    checkVehicleAvailability
}
import axios from 'axios';
import config from '../config/config.json';
const { serverBaseUrl, apiEndpoints } = config;

const axiosInstance = axios.create({
    baseURL: serverBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

async function checkVehicleAvailability(request) {
    try {
        const vehicleAvailablityResponse = await axiosInstance.post(apiEndpoints.checkAvailability, request)
        return { success: true, data: vehicleAvailablityResponse.data }
    } catch (error) {
        console.log('checkVehicleAvailability error:', error.message || error); // debug log
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Something went wrong",
            status: error.response?.status || 500,
        };
    }
}

async function bookTestDrive(request) {
    try {
        const bookingResponse = await axiosInstance.post(apiEndpoints.bookTestDrive, request)
        return { success: true, data: bookingResponse.data }
    } catch (error) {
        console.log('bookTestDrive request error:', error.message || error); // debug log
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Something went wrong",
            status: error.response?.status || 500,
        };
    }
}

export default {
    checkVehicleAvailability,
    bookTestDrive
}

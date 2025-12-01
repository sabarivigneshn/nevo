var vehicleListData = require('../data/vehicles.json')
var vehicleReservedData = require('../data/reservations.json').reservations;
let vehicleList = { ...vehicleListData }
const utils = require('../common/utils')

console.log(vehicleList.vehicles)

function getAllVehicles() {
    return vehicleList;
}

function getVehicleAvailability(vehicleAvailabilityRequest, searchByVehicleId = false) {
    let vehicleDetails;
    let isVehicleAvailable = false;
    if (searchByVehicleId) {
        vehicleDetails = vehicleList.vehicles.filter(vehicle => vehicle.id == vehicleAvailabilityRequest.vehicleId)
    } else {
        vehicleDetails = vehicleList.vehicles.filter(vehicle => {
            return vehicle.type == vehicleAvailabilityRequest.vehicleType && vehicle.location == vehicleAvailabilityRequest.location
        })
    }


    if (vehicleDetails.length) {
        vehicleDetails = vehicleDetails[0];
        isVehicleAvailable = getVehicleAvailabilityByDateTime(vehicleDetails, vehicleAvailabilityRequest.startDateTime);
        return { vehicleDetails, isVehicleAvailable }
    }
    return isVehicleAvailable;

}

function getVehicleAvailabilityByDateTime(vehicleDetails, scheduledAt) {
    let isVehicleAvailable = true
    const scheduleDate = scheduledAt.split("T")[0];
    const scheduleTime = scheduledAt.split("T")[1].substring(0, 5)
    console.log(scheduleDate, scheduleTime)
    const bookedSlots = vehicleDetails.bookedSlots
    if (Object.keys(bookedSlots).length) {
        console.log('booked', bookedSlots)
        isVehicleAvailable = bookedSlots[scheduleDate]?.some(slot => {
            console.log('slot check', slot, scheduleTime)
            slotStart = slot;
            slotEnd = utils.addMinutes(slot, vehicleDetails.durationMins + vehicleDetails.minimumMinutesBetweenBookings)
            console.log('scheduleTime', scheduleTime)
            console.log('slotStart', slotStart)
            console.log('slotEnd', slotEnd)
            console.log('cond', utils.isBetween(scheduleTime, slotStart, slotEnd))
            return slot == scheduleTime || utils.isBetween(scheduleTime, slotStart, slotEnd)
        })
        console.log(isVehicleAvailable)
        return !isVehicleAvailable
    }

    return isVehicleAvailable
}

function scheduleTestDrive(testDriveRequest) {
    let vehicleDetails = getVehicleAvailability(testDriveRequest, true)
    vehicleDetails = { ...vehicleDetails.vehicleDetails, isVehicleAvailable: vehicleDetails.isVehicleAvailable }
    console.log(vehicleDetails)
    if (vehicleDetails.isVehicleAvailable) {
        const reservedVehicleId = vehicleReservedData.length ? vehicleReservedData[vehicleReservedData.length - 1]?.id + 1 : 1;
        const reservedData = { id: reservedVehicleId, ...testDriveRequest, isScheduled: true }
        vehicleReservedData.push(reservedData);
        // update booking slots
        const vehicleIndex = vehicleList.vehicles.findIndex(vehicle => vehicle.id = vehicleDetails.id);
        const scheduleDate = testDriveRequest.startDateTime.split("T")[0];
        const scheduleTime = testDriveRequest.startDateTime.split("T")[1].substring(0, 5)
        let bookedSlots = vehicleList.vehicles[vehicleIndex].bookedSlots;
        if (!bookedSlots[scheduleDate]) {
            bookedSlots[scheduleDate] = [];
        }
        bookedSlots[scheduleDate].push(scheduleTime);
        vehicleList.vehicles[vehicleIndex].bookedSlots = bookedSlots;
        return reservedData;
    }
    return { message: "Vehicle not available", isScheduled: false }
}

module.exports = {
    getAllVehicles,
    getVehicleAvailability,
    getVehicleAvailabilityByDateTime,
    scheduleTestDrive
}
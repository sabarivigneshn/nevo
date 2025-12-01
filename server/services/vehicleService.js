var vehicleListData = require('../data/vehicles.json')
let vehicleList = { ...vehicleListData }
const utils = require('../common/utils')



function getAllVehicles() {
    return vehicleList;
}

function getVehicleAvailability(vehicleAvailabilityRequest) {
    let vehicleDetails = vehicleList.vehicles.filter(vehicle => {
        return vehicle.id == vehicleAvailabilityRequest.vehicleId && vehicle.location == vehicleAvailabilityRequest.location
    })
    if (vehicleDetails.length) {
        vehicleDetails = vehicleDetails[0]
        return getVehicleAvailabilityByDateTime(vehicleDetails, vehicleAvailabilityRequest.startDateTime)
    }
    return false;

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

module.exports = {
    getAllVehicles,
    getVehicleAvailability,
    getVehicleAvailabilityByDateTime
}
var vehicleListData = require('../data/vehicles.json')
var vehicleReservedData = require('../data/reservations.json').reservations;
let vehicleList = { ...vehicleListData }
const utils = require('../common/utils')

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
        const availableVehicles = [];
        vehicleDetails.forEach(vehicle => {
            isVehicleAvailable = getVehicleAvailabilityByDateTime(vehicle, vehicleAvailabilityRequest.startDateTime);
            if (isVehicleAvailable) {
                availableVehicles.push(vehicle);
            }
        })
        // distribute requests evenly
        if (availableVehicles.length) {
            const dayKey = vehicleAvailabilityRequest.startDateTime.split("T")[0];
            availableVehicles.sort((a, b) => countBookingsOnDate(a, dayKey) - countBookingsOnDate(b, dayKey))
            const chosen = availableVehicles[0]
            return { vehicleDetails: chosen, isVehicleAvailable: true }
        }
    }
    return isVehicleAvailable;
}

function countBookingsOnDate(vehicle, dateKey) {
     const booked = vehicle.bookedSlots && vehicle.bookedSlots[dateKey]
  return Array.isArray(booked) ? booked.length : 0
}

function getVehicleAvailabilityByDateTime(vehicleDetails, scheduledAt) {
    let isVehicleAvailable = true
    const scheduleDate = scheduledAt.split("T")[0];
    const scheduleTime = scheduledAt.split("T")[1].substring(0, 5)
    const bookedSlots = vehicleDetails.bookedSlots
    if (Object.keys(bookedSlots).length) {
        isVehicleAvailable = bookedSlots[scheduleDate]?.some(slot => {
            slotStart = slot;
            slotEnd = utils.addMinutes(slot, vehicleDetails.durationMins + vehicleDetails.minimumMinutesBetweenBookings)
            return slot == scheduleTime || utils.isBetween(scheduleTime, slotStart, slotEnd)
        })
        return !isVehicleAvailable
    }

    return isVehicleAvailable
}

function scheduleTestDrive(testDriveRequest) {
    let vehicleDetails = getVehicleAvailability(testDriveRequest, true)
    vehicleDetails = { ...vehicleDetails.vehicleDetails, isVehicleAvailable: vehicleDetails.isVehicleAvailable }
    if (vehicleDetails.isVehicleAvailable) {
        const reservedVehicleId = vehicleReservedData.length ? vehicleReservedData[vehicleReservedData.length - 1]?.id + 1 : 1;
        const reservedData = { id: reservedVehicleId, ...testDriveRequest, isScheduled: true }
        vehicleReservedData.push(reservedData);
        // update booking slots
        const vehicleIndex = vehicleList.vehicles.findIndex(vehicle => vehicle.id == vehicleDetails.id);
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

import React, { useEffect, useState } from 'react';
import vehicleAvailabilityService from '../services/vehicleAvailability';

const locations = [{ 'locationId': 1, 'location': "Dublin" }, { 'locationId': 2, 'location': "Cork" }]

const BookTestDrive = () => {
    const [formData, setFormData] = useState({
        location: 'dublin',
        date: '',
        time: '09:00',
        customerName: '',
        customerPhone: '',
        customerEmail: ''
    })

    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1);
    const [availabilityResult, setAvailabilityResult] = useState(null)
    const [bookingResult, setBookingResult] = useState(null)

    function formatLocalDateYMD(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const today = formatLocalDateYMD(new Date());
    const maxDate = formatLocalDateYMD(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCheckAvailability = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAvailabilityResult(null);
        setBookingResult(null);

        const startDateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString()

        const request = {
            location: formData.location,
            startDateTime,
            vehicleType: 'tesla_model3'
        }

        const availabilityResponse = await vehicleAvailabilityService.checkVehicleAvailability(request)
        if (availabilityResponse.success && availabilityResponse.data.isVehicleAvailable) {
            setAvailabilityResult(availabilityResponse.data);
            setStep(2);
            setLoading(false);
        } else {
            console.error("Error:", availabilityResponse.message);
            setAvailabilityResult({ success: false, message: availabilityResponse.message });
            setLoading(false);
        }
    }

    const handleBookTestDrive = async (e) => {
        e.preventDefault();
        setLoading(true);
        setBookingResult(null);

        const startDateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString()
        const request = {
            vehicleId: availabilityResult.vehicleDetails.id,
            startDateTime,
            durationMins: "45",
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            customerEmail: formData.customerEmail
        }

        const bookingResponse = await vehicleAvailabilityService.bookTestDrive(request)
        if (bookingResponse.success) {
            setBookingResult({ success: true, data: bookingResponse.data });
            setLoading(false);
            setTimeout(() => {
                setStep(1);
                setFormData({
                    location: 'dublin',
                    date: '',
                    time: '09:00',
                    customerName: '',
                    customerPhone: '',
                    customerEmail: ''
                });
                setAvailabilityResult(null);
                setBookingResult(null);
            }, 5000);
        } else {
            console.error("Error:", bookingResponse.message);
            setBookingResult({ success: false, message: bookingResponse.message });
            setLoading(false);
        }
    }

    const handleReset = () => {
        setStep(1);
        setAvailabilityResult(null);
        setBookingResult(null);
    }

    return (
        <div className='ev-test-drive-container'>
            <div className='ev-test-drive-header'>
                <h1>Book Your EV Test Drive</h1>
            </div>

            {step === 1 && (
                <form onSubmit={handleCheckAvailability} className='booking-form'>
                    <h2>Step1: Check availability</h2>

                    <div className='form-group'>
                        <label htmlFor='location'>Location</label>
                        <select
                            id="location"
                            name='location'
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                        >
                            {locations.map(location => {
                                return <option key={location.id}>{location.location}</option>
                            })}

                        </select>
                    </div>

                    <div className='form-row'>
                        <div className='form-group'>
                            <label htmlFor='date'>Date</label>
                            <input
                                type='date'
                                id='date'
                                name='date'
                                value={formData.date}
                                onChange={handleInputChange}
                                min={today}
                                max={maxDate}

                                required
                            />
                            <small>Available up to 14 days in advance</small>
                        </div>

                        <div className='form-group'>
                            <label htmlFor='time'>Time</label>
                            <input
                                type='time'
                                name='time'
                                id='time'
                                value={formData.time}
                                min='08:00'
                                max='20:00'
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <button type='submit' className='btn-primary' disabled={loading}>
                        {loading ? 'Checking...' : 'Check Availability'}
                    </button>

                    {availabilityResult && !availabilityResult.isVehicleAvailable && (
                        <div className="message error">
                            <strong>Vehicle is not available for the selected date and time.</strong>
                        </div>
                    )}

                    {availabilityResult && availabilityResult.isVehicleAvailable && (
                        <div className="message success">
                            <strong>Great News! </strong>
                            Vehicle is available. Please provide your details to book the test drive.
                        </div>
                    )}
                </form>
            )}

            {step === 2 && availabilityResult && availabilityResult.isVehicleAvailable && (
                <form className='booking-form' onSubmit={handleBookTestDrive}>
                    <h2>Step 2: Confirm your booking</h2>
                    <div className='booking-summary'>
                        <h3>Booking Details</h3>
                        <p><strong>Vehicle ID:</strong> {availabilityResult.vehicleDetails.id}</p>
                        <p><strong>Location:</strong> {formData.location}</p>
                        <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {formData.time}</p>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='customerName'>Full Name</label>
                        <input type='text' id='customerName' name='customerName' value={formData.customerName} onChange={handleInputChange} required />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='customerPhone'>Phone Number</label>
                        <input type='tel' id='customerPhone' name='customerPhone' value={formData.customerPhone} onChange={handleInputChange} required />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='customerEmail'>Email Address</label>
                        <input type='email' id='customerEmail' name='customerEmail' value={formData.customerEmail} onChange={handleInputChange} required />
                    </div>
                    <div className='button-group'>
                        <button type='button' className='btn-secondary' onClick={handleReset} disabled={loading}>
                            Back
                        </button>

                        <button type='submit' className='btn-primary' disabled={loading}>
                            {loading ? 'Booking...' : 'Book Test Drive'}
                        </button>
                    </div>

                    {bookingResult && bookingResult.success && (
                        <div className="message success">
                            <strong>Booking Confirmed! </strong>
                            Your test drive has been booked successfully.
                            <p>We've sent a confirmation email to {formData.customerEmail}.</p>
                            <p className="redirect-notice">Redirecting to homepage in 5 seconds...</p>
                        </div>
                    )}

                    {bookingResult && !bookingResult.success && (
                        <div className="message error">
                            <strong>Booking Failed! </strong>
                            Please try again later. {bookingResult.message}
                        </div>
                    )}
                </form>
            )}

        </div>
    );
}

export default BookTestDrive;
import React, { useEffect, useState } from 'react';
const vehicleAvailabilityService = require('../services/vehicleAvailability')

const locations = [{'locationId': 1, 'location': "Dublin"}, {'locationId': 2, 'location': "Cork"}]

const BookTestDrive = () => {
    const [formData, setFormData] = useState({
        location: 'dublin',
        date: '',
        time: '09:00',
        customerName: '',
        customerPhone: '',
        customerEmail: ''
    })
    
    const [allVehicleData, setAllVehicleData] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('dublin')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1);
    const [availabilityResult, setAvailabilityResult] = useState(null)
    const [bookingResult, setBookingResult] = useState(null)
    const today = new Date().toISOString().split('T')[0]
    const maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    useEffect(() => {

    }, [])

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}))
    }

    const handleCheckAvailability = async (e) => {
        console.log('Checking availability with formData:', formData); // debug log
        e.preventDefault();
        setLoading(true);
        setAvailabilityResult(null);
        setBookingResult(null);

        const startDateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString()

        const request = {
            location: formData.location,
            startDateTime,
            duration: '45',
            vehicleType: 'tesla_model3'
        }

        const availabilityResponse = await vehicleAvailabilityService.checkVehicleAvailability(request)
        if (availabilityResponse.success) {
            setLoading(false);
            setAvailabilityResult(availabilityResponse.data);
        } else {
            console.error("Error:", availabilityResponse.message);
            setLoading(false);
        }
        
        
    }
    return (
        <div  className='ev-test-drive-container'>
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
                </form>
            )}
        </div>
        
    )
    
}

export default BookTestDrive;
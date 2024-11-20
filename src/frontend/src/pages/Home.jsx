import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_MASTER_DATA_URL } from '../utils/constants';

const Home = () => {
  const [locations, setLocations] = useState([]);
  const [bookingClasses, setBookingClasses] = useState([]);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [selectedBookingClass, setSelectedBookingClass] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_MASTER_DATA_URL);
        const data = await response.json();
        setLocations(data.locations);
        setBookingClasses(data.bookingClass);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBooking = () => {
    if (fromLocation && toLocation && selectedBookingClass) {
      if (fromLocation === toLocation) {
        alert('From and To locations cannot be the same.');
        return;
      }
      navigate('/booking', {
        state: {
          fromLocation,
          toLocation,
          bookingClass: selectedBookingClass
        }
      });
    } else {
      alert('Please select both locations and a booking class.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Delivery background"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-36">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Swift Parcel Delivery</span>{' '}
              <span className="block text-indigo-400 xl:inline">Across Ireland</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Fast, secure, and reliable parcel delivery service connecting all major cities in Ireland.
            </p>
          </div>

          <div className="mt-12 sm:max-w-xl sm:mx-auto md:mt-16">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden backdrop-blur-lg bg-opacity-90">
              <div className="px-6 py-8">
                <div className="mb-4">
                  <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-700">From Location</label>
                  <select
                    id="fromLocation"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">--Select From Location--</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="toLocation" className="block text-sm font-medium text-gray-700">To Location</label>
                  <select
                    id="toLocation"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">--Select To Location--</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="bookingClass" className="block text-lg">Select Booking Class:</label>
                  <select
                    id="bookingClass"
                    value={selectedBookingClass}
                    onChange={(e) => setSelectedBookingClass(e.target.value)}
                    className="mt-2 p-2 border border-gray-300 rounded"
                  >
                    <option value="">--Select Booking Class--</option>
                    {bookingClasses.map((bookingClass) => (
                      <option key={bookingClass} value={bookingClass}>{bookingClass}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleBooking}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
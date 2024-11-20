import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BOOKING_URL, API_MASTER_DATA_URL } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { getAuthToken } from '../utils/cookies';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fromLocation, toLocation, bookingClass } = location.state || {};
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const { user } = useAuth();

    const [bookingDetails, setBookingDetails] = useState({
        fromLocation: fromLocation || '',
        toLocation: toLocation || '',
        bookingClass: bookingClass || '',
        pickupAddress: '',
        deliveryAddress: '',
        receiverName: '',
        price: 0,
        estimatedDeliveryDate: ''
    });

    const [locations, setLocations] = useState([]);
    const [bookingClasses, setBookingClasses] = useState([]);

    useEffect(() => {
        // Fetch locations and booking classes from the API
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

    useEffect(() => {
        // Calculate price and delivery date based on booking class
        calculatePriceAndDelivery();
    }, [bookingDetails.bookingClass]);

    const calculatePriceAndDelivery = () => {
        const basePrice = 10; // Base price in euros
        const today = new Date();
        let price = basePrice;
        let deliveryDays = 3; // Default delivery days

        switch (bookingDetails.bookingClass) {
            case 'ONE-DAY':
                price = basePrice * 3;
                deliveryDays = 1;
                break;
            case 'EXPRESS':
                price = basePrice * 2;
                deliveryDays = 2;
                break;
            case 'STANDARD':
                price = basePrice * 1.5;
                deliveryDays = 3;
                break;
            case 'CHEAPER':
                price = basePrice;
                deliveryDays = 5;
                break;
            default:
                break;
        }

        const estimatedDate = new Date(today.setDate(today.getDate() + deliveryDays));

        setBookingDetails(prev => ({
            ...prev,
            price: price.toFixed(2),
            estimatedDeliveryDate: estimatedDate.toLocaleDateString('en-IE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        setShowConfirmModal(true);
    };

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await fetch(API_BOOKING_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    fromLocation: bookingDetails.fromLocation,
                    toLocation: bookingDetails.toLocation,
                    price: parseFloat(bookingDetails.price),
                    bookingClass: bookingDetails.bookingClass,
                    pickupAddress: bookingDetails.pickupAddress,
                    deliveryAddress: bookingDetails.deliveryAddress,
                    receiverName: bookingDetails.receiverName,
                    estimatedDeliveryDate: bookingDetails.estimatedDeliveryDate
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create booking');
            }

            navigate('/my-bookings', {
                state: { message: 'Booking created successfully!' }
            });
        } catch (error) {
            setSubmitError('Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const ConfirmationModal = () => {
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowConfirmModal(false)}></div>

                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Confirm Booking Details</h3>

                            <div className="mt-4 space-y-3">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">From Location</p>
                                            <p className="font-medium">{bookingDetails.fromLocation}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">To Location</p>
                                            <p className="font-medium">{bookingDetails.toLocation}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Booking Class</p>
                                            <p className="font-medium">{bookingDetails.bookingClass}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Price</p>
                                            <p className="font-medium">€{bookingDetails.price}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Pickup Address</p>
                                    <p className="font-medium">{bookingDetails.pickupAddress}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Delivery Address</p>
                                    <p className="font-medium">{bookingDetails.deliveryAddress}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Receiver's Name</p>
                                    <p className="font-medium">{bookingDetails.receiverName}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Estimated Delivery Date</p>
                                    <p className="font-medium">{bookingDetails.estimatedDeliveryDate}</p>
                                </div>
                            </div>

                            {submitError && (
                                <div className="mt-4 text-sm text-red-600">
                                    {submitError}
                                </div>
                            )}

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmBooking}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!fromLocation || !toLocation || !bookingClass) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Booking Summary */}
                        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Booking Summary</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Price</p>
                                    <p className="font-bold text-lg">€{bookingDetails.price}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                                    <p className="font-bold">{bookingDetails.estimatedDeliveryDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">From Location</label>
                                <select
                                    name="fromLocation"
                                    value={bookingDetails.fromLocation}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">--Select From Location--</option>
                                    {locations.map((location) => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">To Location</label>
                                <select
                                    name="toLocation"
                                    value={bookingDetails.toLocation}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">--Select To Location--</option>
                                    {locations.map((location) => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Booking Class */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Booking Class</label>
                            <select
                                name="bookingClass"
                                value={bookingDetails.bookingClass}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">--Select Booking Class--</option>
                                {bookingClasses.map((classType) => (
                                    <option key={classType} value={classType}>{classType}</option>
                                ))}
                            </select>
                        </div>

                        {/* Editable Fields */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
                                <textarea
                                    name="pickupAddress"
                                    rows="3"
                                    value={bookingDetails.pickupAddress}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter complete pickup address"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                                <textarea
                                    name="deliveryAddress"
                                    rows="3"
                                    value={bookingDetails.deliveryAddress}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter complete delivery address"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Receiver's Name</label>
                                <input
                                    type="text"
                                    name="receiverName"
                                    value={bookingDetails.receiverName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter receiver's full name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showConfirmModal && <ConfirmationModal />}
        </div>
    );
};

export default Booking; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_REGISTER_URL, APP_NAME } from '../utils/constants';
import Logo from "../assets/fastex.png"

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
        if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(API_REGISTER_URL, {
                firstname: formData.firstname,
                lastname: formData.lastname,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.data) {
                navigate('/login', {
                    state: { message: 'Registration successful! Please login to continue.' }
                });
            }
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || 'Registration failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <img src={Logo} alt="Logo" className="h-8 w-8" />
                        <span className="text-xl font-semibold text-gray-800">{APP_NAME}</span>
                    </div>
                    <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                        Already have an account?
                    </a>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column - Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">Join {APP_NAME}</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        value={formData.firstname}
                                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0"
                                    />
                                    {errors.firstname && <p className="mt-1 text-sm text-red-500">{errors.firstname}</p>}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0"
                                    />
                                    {errors.lastname && <p className="mt-1 text-sm text-red-500">{errors.lastname}</p>}
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0"
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}

                            <input
                                type="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0"
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="password"
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0"
                                    />
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Features */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-gray-900">Why choose {APP_NAME}?</h2>
                            <p className="text-gray-600">Join millions of users who trust us for their business needs.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: 'Fast Setup', desc: 'Get started in minutes' },
                                { title: 'Secure', desc: 'Enterprise-grade security' },
                                { title: '24/7 Support', desc: 'Always here to help' },
                                { title: 'Updates', desc: 'Regular feature updates' }
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500 text-center">
                                By creating an account, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

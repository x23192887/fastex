import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuthToken } from '../utils/cookies';
import { useAuth } from '../context/AuthContext';
import { API_LOGIN_URL, APP_NAME } from '../utils/constants';
import Logo from "../assets/fastex.png"

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await axios.post(API_LOGIN_URL, formData);

            if (response.data.token) {
                setAuthToken(response.data.token);
                setUser({ name: formData.username, username: formData.username });
                navigate('/');
            } else if (response.data.message === "Bad credentials") {
                setErrors({
                    submit: 'Invalid username or password. Please try again.'
                });
            } else {
                setErrors({
                    submit: 'Login failed. Please try again.'
                });
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        setErrors({
                            submit: 'Your account has been locked. Please contact support.'
                        });
                        break;
                    case 404:
                        setErrors({
                            submit: 'Service not available. Please try again later.'
                        });
                        break;
                    default:
                        setErrors({
                            submit: 'An error occurred during login. Please try again later.'
                        });
                }
            } else if (error.request) {
                setErrors({
                    submit: 'Unable to connect to the server. Please check your internet connection.'
                });
            } else {
                setErrors({
                    submit: 'An unexpected error occurred. Please try again.'
                });
            }
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
                    <a href="/register" className="text-sm text-gray-600 hover:text-gray-900">
                        Need an account?
                    </a>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column - Features */}
                    <div className="flex flex-col justify-center space-y-8 order-2 md:order-1">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
                            <p className="text-gray-600">Access your account and continue your journey with {APP_NAME}.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-black rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Secure Access</h3>
                                    <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-black rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Fast Performance</h3>
                                    <p className="text-sm text-gray-600">Lightning-fast access to all your resources</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-200">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-black">99.9%</div>
                                    <div className="text-sm text-gray-600">Uptime</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-black">24/7</div>
                                    <div className="text-sm text-gray-600">Support</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-black">100K+</div>
                                    <div className="text-sm text-gray-600">Users</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 order-1 md:order-2">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">Sign in to your account</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0"
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}

                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}

                            {errors.submit && (
                                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">
                                    {errors.submit}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {['google', 'facebook', 'linkedin'].map((provider) => (
                                    <button
                                        key={provider}
                                        type="button"
                                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={`https://www.svgrepo.com/show/475${provider === 'google' ? '656' : provider === 'facebook' ? '647' : '669'}/${provider}-color.svg`}
                                            alt={provider}
                                        />
                                    </button>
                                ))}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

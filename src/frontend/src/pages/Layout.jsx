import React from "react";
import { Outlet, Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import avatar from '../assets/clipart.png';
import webicon from '../assets/fastex.png';
import { APP_NAME } from '../utils/constants';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  if (user && (currentPath === '/login' || currentPath === '/register')) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Navigation */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto">
          {/* Top Bar */}
          <div className="border-b border-slate-200 py-2 px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <span>📞 24/7 Support: +1 234 567 890</span>
                <span>📍 Track your parcel</span>
              </div>
              {!user ? (
                <div className="flex items-center space-x-4 text-sm">
                  <Link to="/login" className="text-slate-600 hover:text-slate-900">Sign In</Link>
                  <Link to="/register" className="bg-orange-500 text-white px-4 py-1 rounded-full hover:bg-orange-600">
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img src={avatar} alt="Profile" className="w-8 h-8 rounded-full" />
                    <span className="text-sm text-slate-600">{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Navigation Bar */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-12">
                <Link to="/" className="flex items-center space-x-2">
                  <img src={webicon} alt="Logo" className="h-10 w-10" />
                  <span className="text-xl font-bold text-slate-900">{APP_NAME}</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-8">
                  <Link to="/" className="nav-link group">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Home</span>
                    </span>
                    <div className="h-0.5 w-0 group-hover:w-full bg-orange-500 transition-all duration-300"></div>
                  </Link>

                  {user && (
                    <Link to="/my-bookings" className="nav-link group">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>My Shipments</span>
                      </span>
                      <div className="h-0.5 w-0 group-hover:w-full bg-orange-500 transition-all duration-300"></div>
                    </Link>
                  )}
                </nav>
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-lg hover:bg-slate-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-16 6h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src={webicon} alt="Logo" className="h-10 w-10 brightness-200" />
                <span className="text-xl font-bold text-white">{APP_NAME}</span>
              </div>
              <p className="text-sm">
                Your trusted partner in global logistics and parcel delivery services.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/track" className="hover:text-white transition-colors">Track Package</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services/international" className="hover:text-white transition-colors">International Shipping</Link></li>
                <li><Link to="/services/express" className="hover:text-white transition-colors">Express Delivery</Link></li>
                <li><Link to="/services/cargo" className="hover:text-white transition-colors">Cargo Services</Link></li>
                <li><Link to="/services/warehousing" className="hover:text-white transition-colors">Warehousing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 234 567 890</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@{APP_NAME.toLowerCase()}.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

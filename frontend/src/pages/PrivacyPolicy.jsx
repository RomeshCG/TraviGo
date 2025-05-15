import React from 'react';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <SimpleHeader />
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-8">Privacy Policy</h1>
          <p className="text-gray-700 mb-4">At TraviGo, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform.</p>
          <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2">Information We Collect</h2>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>Personal details (name, email, contact number) provided during registration or booking</li>
            <li>Booking and payment information</li>
            <li>Usage data and cookies to improve our services</li>
          </ul>
          <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2">How We Use Your Information</h2>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>To process bookings and payments</li>
            <li>To personalize your experience</li>
            <li>To communicate important updates and offers</li>
            <li>To improve our platform and services</li>
          </ul>
          <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2">Your Rights</h2>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>You can access, update, or delete your personal information at any time</li>
            <li>You can opt out of marketing communications</li>
          </ul>
          <p className="text-gray-700 mt-8">For any questions about our privacy practices, please contact us via our Contact Us page.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;

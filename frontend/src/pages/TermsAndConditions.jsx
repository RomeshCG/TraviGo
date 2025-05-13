import React from 'react';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';

function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <SimpleHeader />
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-8">Terms &amp; Conditions</h1>
          <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">By using TraviGo, you agree to comply with and be bound by these terms. Please read them carefully before using our services.</p>
          <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2">2. Bookings &amp; Payments</h2>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>All bookings are subject to availability and confirmation.</li>
            <li>Payments must be made through our secure payment gateway.</li>
            <li>Cancellations and refunds are subject to our policies and those of our partners.</li>
          </ul>
          <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2">3. User Responsibilities</h2>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>Provide accurate information during registration and booking.</li>
            <li>Respect local laws and customs while traveling.</li>
            <li>Do not misuse the platform or engage in fraudulent activities.</li>
          </ul>
          <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2">4. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">TraviGo is not liable for any direct or indirect damages arising from the use of our platform or services provided by third parties.</p>
          <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2">5. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">We reserve the right to update these terms at any time. Continued use of TraviGo constitutes acceptance of the revised terms.</p>
          <p className="text-gray-700 mt-8">For questions regarding these terms, please contact us via our Contact Us page.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TermsAndConditions;

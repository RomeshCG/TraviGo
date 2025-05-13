import React from 'react';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';

const faqs = [
  {
    question: 'How do I book a hotel, vehicle, or tour guide with TraviGo?',
    answer: 'Simply browse our listings, select your preferred hotel, vehicle, or guide, and follow the easy booking steps. Our platform ensures a secure and seamless experience from start to finish.'
  },
  {
    question: 'Is it safe to travel in Sri Lanka in 2025?',
    answer: 'Absolutely! Sri Lanka is welcoming travelers with open arms in 2025, offering enhanced safety, vibrant festivals, and world-class hospitality. TraviGo partners only with trusted providers for your peace of mind.'
  },
  {
    question: 'Can I customize my travel package?',
    answer: 'Yes! TraviGo lets you tailor your trip—choose your hotels, vehicles, and guides to create a personalized Sri Lankan adventure that fits your style and budget.'
  },
  {
    question: 'How do I book a vehicle for my trip?',
    answer: 'You can easily book a vehicle by visiting our Vehicles section, choosing your preferred car, van, or SUV, and completing the booking process online. All vehicles are provided by trusted partners for your safety and comfort.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit/debit cards and secure online payment methods for your convenience.'
  },
  {
    question: 'Can I cancel or modify my booking?',
    answer: 'Yes, you can manage your bookings through your TraviGo account. Please check the cancellation policy for each service.'
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach our support team via the Contact Us page for any assistance or inquiries.'
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No, TraviGo is transparent with all pricing. You will see the full cost before confirming your booking.'
  },
];

function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <SimpleHeader />
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-12">Frequently Asked Questions</h1>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-gray-200 rounded-xl shadow-md p-6 cursor-pointer transition-all border-l-4 border-blue-600">
                <summary className="flex items-center justify-between text-lg font-semibold text-blue-700 group-open:text-blue-800">
                  {faq.question}
                  <span className="ml-2 text-2xl transition-transform group-open:rotate-90">›</span>
                </summary>
                <p className="mt-4 text-blue-900">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FAQPage;

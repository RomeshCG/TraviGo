import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51R5p0rL5p81dKEBAlFjgRGsGvCObzc5dvjqVLaIUloW2qiqf4uwZAAarGdjRFqpBTPcHeJZyAZ1eEgtVWBoENjji00jjNCT5m5');

const CheckoutForm = ({ bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      setLoading(false);
      return;
    }

    try {
      const { clientSecret } = await fetch('http://localhost:5000/api/hotel-payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingData.bookingId,
          amount: bookingData.amount
        }),
      }).then((res) => res.json());

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: nameOnCard,
            email: bookingData.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccessMessage('Payment successful! Redirecting to receipt...');
        setTimeout(() => {
          navigate('/receipt', {
            state: {
              bookingId: bookingData.bookingId,
              totalPrice: bookingData.amount,
              firstName: bookingData.firstName,
              lastName: bookingData.lastName,
              email: bookingData.email,
              checkInDate: bookingData.checkInDate,
              checkOutDate: bookingData.checkOutDate,
            },
          });
        }, 3000);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 justify-center items-start py-10">
      {/* Payment Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 max-w-lg bg-white border border-gray-200 rounded-2xl shadow-lg p-8"
        style={{ minWidth: 340 }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-800">
          <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2">
            <svg className="inline w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/></svg>
          </span>
          Card Payment
        </h2>
        {successMessage && (
          <div className="bg-green-100 text-green-800 text-center py-2 px-4 rounded mb-4">
            {successMessage}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name on Card</label>
          <input
            type="text"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter name on the card"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Card Number</label>
          <div className="p-2 border rounded bg-gray-50">
            <CardNumberElement className="w-full" />
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-2">Expiry date</label>
            <div className="p-2 border rounded bg-gray-50">
              <CardExpiryElement className="w-full" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-2">CVC</label>
            <div className="p-2 border rounded bg-gray-50">
              <CardCvcElement className="w-full" />
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center gap-2 mb-2">
            <img src="https://img.icons8.com/color/28/000000/apple-pay.png" alt="Apple Pay" className="h-7" />
            <span className="font-semibold text-gray-700">Apple Pay</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <img src="https://img.icons8.com/color/28/000000/google-pay-india.png" alt="Google Pay" className="h-7" />
            <span className="font-semibold text-gray-700">Google Pay</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <img src="https://img.icons8.com/color/28/000000/ideal.png" alt="iDeal" className="h-7" />
            <span className="font-semibold text-gray-700">iDeal</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="https://img.icons8.com/ios-filled/28/000000/sofort.png" alt="Sofort" className="h-7" />
            <span className="font-semibold text-gray-700">Sofort</span>
          </div>
        </div>
      </form>

      {/* Booking Summary */}
      <div className="w-full md:w-96 bg-white border border-gray-200 rounded-2xl shadow-lg p-8 mt-10 md:mt-0">
        <h3 className="text-xl font-bold mb-4 text-blue-800">Booking Summary</h3>
        <div className="space-y-2 text-gray-700">
          <div>
            <span className="font-semibold">Name:</span> {bookingData.firstName} {bookingData.lastName}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {bookingData.email}
          </div>
          <div>
            <span className="font-semibold">Check-in:</span> {bookingData.checkInDate}
          </div>
          <div>
            <span className="font-semibold">Check-out:</span> {bookingData.checkOutDate}
          </div>
          <div>
            <span className="font-semibold">Total Price:</span>{" "}
            <span className="text-blue-700 font-bold text-lg">${bookingData.amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HotelPaymentPage = () => {
  const location = useLocation();
  const bookingData = location.state;

  if (!bookingData) {
    return <div className="text-center text-red-500">No booking data found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-24 pb-12">
      <Elements stripe={stripePromise}>
        <CheckoutForm bookingData={bookingData} />
      </Elements>
    </div>
  );
};

export default HotelPaymentPage;
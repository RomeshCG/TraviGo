import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Header from '../components/Header';

const stripePromise = loadStripe('pk_test_51R5p0rL5p81dKEBAlFjgRGsGvCObzc5dvjqVLaIUloW2qiqf4uwZAAarGdjRFqpBTPcHeJZyAZ1eEgtVWBoENjji00jjNCT5m5');

const MessageBox = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Status</h2>
        <p className="text-gray-700 text-lg">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const CheckoutForm = ({ totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: Math.round(totalPrice * 100) }),
        });
        const data = await response.json();
        if (data.success) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || 'Failed to initialize payment');
        }
      } catch (err) {
        setError('Network error: Could not connect to payment server');
        console.error('Fetch Client Secret Error:', err);
      }
    };

    if (totalPrice > 0) fetchClientSecret();
    else setError('Invalid total price');
  }, [totalPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system is not fully loaded. Please try again.');
      setProcessing(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: {
          address: {
            postal_code: postalCode,
          },
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      setShowMessageBox(true);
    }
  };

  const handleCloseMessageBox = () => {
    setShowMessageBox(false);
    navigate('/tour-guide/confirmation');
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '18px',
        color: '#1a202c',
        '::placeholder': {
          color: '#a0aec0',
        },
        padding: '12px',
      },
      invalid: {
        color: '#e53e3e',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Secure Payment</h2>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Card Number</label>
        <div className="p-3 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
          <CardNumberElement options={elementOptions} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Expiration Date (MM/YY)</label>
          <div className="p-3 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">CVC</label>
          <div className="p-3 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-gray-700 font-semibold mb-2">Postal Code</label>
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Enter postal code"
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 mb-6 text-center font-medium bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {processing ? 'Processing...' : `Pay $${totalPrice?.toFixed(2) || '0.00'}`}
      </button>

      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm mb-2">Powered by Stripe</p>
        <div className="flex justify-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
            alt="Visa"
            className="h-8 object-contain"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className="h-8 object-contain"
          />
        </div>
      </div>

      {showMessageBox && (
        <MessageBox
          message="Payment succeeded! Thank you for your purchase."
          onClose={handleCloseMessageBox}
        />
      )}
    </form>
  );
};

const TourGuidePaymentPage = () => {
  const { state } = useLocation();
  const { totalPrice } = state || {};

  return (
    <div className="min-h-screen bg-gray-800">
      <Header />
      <div className="pt-20 p-8 flex items-center justify-center">
        <Elements stripe={stripePromise}>
          <CheckoutForm totalPrice={totalPrice} />
        </Elements>
      </div>
    </div>
  );
};

export default TourGuidePaymentPage;
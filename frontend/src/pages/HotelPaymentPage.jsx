import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51R5p0rL5p81dKEBAlFjgRGsGvCObzc5dvjqVLaIUloW2qiqf4uwZAAarGdjRFqpBTPcHeJZyAZ1eEgtVWBoENjji00jjNCT5m5');

const CheckoutForm = ({ bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
        body: JSON.stringify({ bookingId: bookingData.bookingId, amount: bookingData.amount }),
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
        // Redirect to ReceiptPage with receipt data
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
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
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
        <div className="p-2 border rounded">
          <CardNumberElement className="w-full" />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Expiration Date</label>
        <div className="p-2 border rounded">
          <CardExpiryElement className="w-full" />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">CVC</label>
        <div className="p-2 border rounded">
          <CardCvcElement className="w-full" />
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const HotelPaymentPage = () => {
  const location = useLocation();
  const bookingData = location.state;

  if (!bookingData) {
    return <div className="text-center text-red-500">No booking data found.</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm bookingData={bookingData} />
    </Elements>
  );
};

export default HotelPaymentPage;
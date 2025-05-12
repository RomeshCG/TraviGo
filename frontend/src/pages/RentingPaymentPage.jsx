import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import SimpleHeader from '../components/SimpleHeader';

const stripePromise = loadStripe('pk_test_51R5p0rL5p81dKEBAlFjgRGsGvCObzc5dvjqVLaIUloW2qiqf4uwZAAarGdjRFqpBTPcHeJZyAZ1eEgtVWBoENjji00jjNCT5m5');

const stripeElementStyles = {
  base: {
    fontSize: '16px',
    color: '#374151',
    '::placeholder': { color: '#9CA3AF' },
  },
  invalid: { color: '#EF4444' },
};

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state?.vehicle;
  const formData = location.state?.formData;
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [postalCode, setPostalCode] = React.useState('');
  const [cardName, setCardName] = React.useState('');

  if (!vehicle || !formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <h2 className="text-2xl font-bold text-red-600 mb-4">No vehicle or rental info found.</h2>
        <Link to="/user/vehicles" className="text-blue-600 underline">Back to Vehicles</Link>
      </div>
    );
  }

  const price = vehicle.pricePerDay || vehicle.price || 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      setProcessing(false);
      return;
    }

    if (!cardName.trim()) {
      setError('Please enter the name on the card.');
      setProcessing(false);
      return;
    }

    try {
      // Create payment intent on backend
      const res = await fetch('http://localhost:5000/api/renting-vehicles/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price * 100 }), // Stripe expects cents
      });
      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error('Payment intent failed');

      // Confirm card payment
      const cardNumberElement = elements.getElement(CardNumberElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: cardName,
            email: formData.email,
            address: { postal_code: postalCode },
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('Payment successful! Vehicle rented.');
        navigate('/user/vehicles');
      }
    } catch (err) {
      setError(err.message || 'Payment failed.');
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-8">
      {/* Order Summary Section */}
      <div className="lg:w-1/3 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-[#203c8c] mb-4">Order Summary</h3>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Name:</p>
            <p>{formData.fullName}</p>
          </div>
          <div>
            <p className="font-semibold">Vehicle:</p>
            <p>{vehicle.vehicleName || vehicle.name}</p>
          </div>
          <div>
            <p className="font-semibold">Rental Dates:</p>
            <p>
              {formData.startDate} to {formData.endDate}
            </p>
          </div>
          <div>
            <p className="font-semibold">Total Price:</p>
            <p className="text-lg font-bold">${price}</p>
          </div>
        </div>
      </div>

      {/* Payment Form Section */}
      <form
        onSubmit={handleSubmit}
        className="lg:w-2/3 space-y-6 bg-white p-8 rounded-xl shadow-lg mt-12 lg:mt-0"
      >
        <h2 className="text-2xl font-bold text-[#203c8c] mb-4">Pay for {vehicle.vehicleName || vehicle.name}</h2>
        <p className="mb-2">Amount: <span className="font-semibold">${price}</span></p>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name on the Card</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Card Number</label>
          <div className="p-3 border border-gray-300 rounded-lg bg-white">
            <CardNumberElement options={{ style: stripeElementStyles, placeholder: '1234 1234 1234 1234' }} className="w-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Expiry Date</label>
            <div className="p-3 border border-gray-300 rounded-lg bg-white">
              <CardExpiryElement options={stripeElementStyles} />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">CVC</label>
            <div className="p-3 border border-gray-300 rounded-lg bg-white">
              <CardCvcElement options={stripeElementStyles} />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Postal Code</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="12345"
            required
          />
        </div>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 mt-4"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

const RentingPaymentPage = () => (
  <>
    <SimpleHeader />
    <div className="pt-28 pb-12 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  </>
);

export default RentingPaymentPage;

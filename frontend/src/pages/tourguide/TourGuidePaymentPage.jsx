import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51R5p0rL5p81dKEBAlFjgRGsGvCObzc5dvjqVLaIUloW2qiqf4uwZAAarGdjRFqpBTPcHeJZyAZ1eEgtVWBoENjji00jjNCT5m5");

const CheckoutForm = ({ bookingId, totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/payments/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ amount: Math.round(totalPrice * 100) }),
        });
        const data = await response.json();
        if (data.success) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Failed to initialize payment");
        }
      } catch (err) {
        setError("Network error: Could not connect to payment server");
        console.error("Fetch Client Secret Error:", err);
      }
    };

    if (totalPrice > 0) fetchClientSecret();
    else setError("Invalid total price");
  }, [totalPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements || !clientSecret) {
      setError("Payment system is not fully loaded. Please try again.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Tour Guide Booking",
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      navigate("/tour-guide/confirmation", { state: { bookingId } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h2>
      <p className="mb-4 text-center">Total Price: ${totalPrice.toFixed(2)}</p>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Card Details</label>
        <div className="p-3 border border-gray-200 rounded-lg">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
      </div>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const TourGuidePaymentPage = () => {
  const { state } = useLocation();
  const { bookingId, totalPrice } = state || {};

  if (!bookingId || !totalPrice) {
    return <p className="text-center text-red-600">Invalid booking details. Please try again.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Elements stripe={stripePromise}>
        <CheckoutForm bookingId={bookingId} totalPrice={totalPrice} />
      </Elements>
    </div>
  );
};

export default TourGuidePaymentPage;
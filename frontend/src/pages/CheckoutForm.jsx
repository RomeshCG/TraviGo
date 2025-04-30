import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MessageModal from "../components/MessageModal";
import { Loader2 } from "lucide-react";

const visaLogo = "https://www.logo.wine/a/logo/Visa_Inc./Visa_Inc.-Logo.wine.svg";
const mastercardLogo = "https://www.logo.wine/a/logo/Mastercard/Mastercard-Logo.wine.svg";
const stripeLogo = "https://stripe.com/img/v3/logo/black.png";

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: "", type: "" });
  const [postalCode, setPostalCode] = useState("");

  const { bookingData, amount } = location.state || {};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      setModal({ isOpen: true, message: "Payment system not ready.", type: "error" });
      setLoading(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: { address: { postal_code: postalCode } },
      },
    });

    if (error) {
      setModal({ isOpen: true, message: error.message, type: "error" });
    } else if (paymentIntent.status === "succeeded") {
      setModal({
        isOpen: true,
        message: "Payment Successful! Your booking is confirmed.",
        type: "success",
      });
    }
    setLoading(false);
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === "success") navigate("/hotels");
  };

  const stripeElementStyles = {
    base: {
      fontSize: "16px",
      color: "#374151",
      "::placeholder": { color: "#9CA3AF" },
    },
    invalid: { color: "#EF4444" },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Payment</h1>
          <button
            onClick={() => navigate(`/hotels/booking/${bookingData?.hotelId}/${bookingData?.roomType.toLowerCase().replace(" ", "")}`)}
            className="text-blue-600 hover:underline font-semibold"
          >
            ← Back to Booking
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Payment Summary</h2>
          <p className="text-gray-700 mt-2">
            <strong>Hotel:</strong> {bookingData?.hotelId === "H01" ? "Grand Horizons Hotel" : "Unknown Hotel"}
          </p>
          <p className="text-gray-700">
            <strong>Room Type:</strong> {bookingData?.roomType || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Check-In:</strong> {bookingData?.checkInDate || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Check-Out:</strong> {bookingData?.checkOutDate || "N/A"}
          </p>
          <p className="text-gray-700 font-semibold">
            <strong>Total Amount:</strong> ${amount || "N/A"}
          </p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          {/* Payment Method Branding */}
          <div className="flex justify-center gap-4 mb-6">
            <img src={visaLogo} alt="Visa" className="h-10" onError={(e) => (e.target.src = "https://via.placeholder.com/40?text=Visa")} />
            <img src={mastercardLogo} alt="Mastercard" className="h-10" onError={(e) => (e.target.src = "https://via.placeholder.com/40?text=Mastercard")} />
          </div>

          <div className="grid gap-6">
            <div>
              <label htmlFor="cardNumber" className="block text-gray-700 font-medium mb-1">
                Card Number
              </label>
              <div className="p-3 border border-gray-300 rounded-md bg-white">
                <CardNumberElement options={{ style: stripeElementStyles }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-gray-700 font-medium mb-1">
                  Expiry Date
                </label>
                <div className="p-3 border border-gray-300 rounded-md bg-white">
                  <CardExpiryElement options={{ style: stripeElementStyles }} />
                </div>
              </div>
              <div>
                <label htmlFor="cvc" className="block text-gray-700 font-medium mb-1">
                  CVC
                </label>
                <div className="p-3 border border-gray-300 rounded-md bg-white">
                  <CardCvcElement options={{ style: stripeElementStyles }} />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-gray-700 font-medium mb-1">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Enter postal code"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 bg-blue-600 text-white py-3 px-8 rounded-md w-full font-semibold hover:bg-blue-700 transition shadow-md flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !stripe || !clientSecret}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
            {loading ? "Processing..." : `Pay $${amount || "0"}`}
          </button>

          {/* Powered by Stripe */}
          <div className="flex justify-center items-center mt-4">
            <span className="text-gray-600 text-sm mr-2">Powered by</span>
            <img src={stripeLogo} alt="Stripe" className="h-6" onError={(e) => (e.target.src = "https://via.placeholder.com/24?text=Stripe")} />
          </div>
        </form>
      </div>
      {modal.isOpen && (
        <MessageModal message={modal.message} type={modal.type} onClose={closeModal} showContinue={modal.type === "success"} />
      )}
    </div>
  );
};

export default CheckoutForm;
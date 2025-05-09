import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MessageModal from "../components/MessageModal";
import { FaSpinner, FaLock, FaShieldAlt, FaCreditCard } from "react-icons/fa";

const visaLogo = "https://www.logo.wine/a/logo/Visa_Inc./Visa_Inc.-Logo.wine.svg";
const mastercardLogo = "https://www.logo.wine/a/logo/Mastercard/Mastercard-Logo.wine.svg";
const amexLogo = "https://www.logo.wine/a/logo/American_Express/American_Express-Logo.wine.svg";
const unionpayLogo = "https://www.logo.wine/a/logo/UnionPay/UnionPay-Logo.wine.svg";

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: "", type: "" });
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [clientSecret, setClientSecret] = useState("");

  const { bookingData, amount, bookingId } = location.state || {};

  // Fetch Payment Intent client secret
  useEffect(() => {
    if (bookingData && amount && bookingId) {
      const fetchClientSecret = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:5000/api/payments/create-payment-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount, bookingId }),
          });
          const data = await response.json();
          if (data.success) {
            setClientSecret(data.clientSecret);
          } else {
            setModal({
              isOpen: true,
              message: data.message || "Failed to initialize payment.",
              type: "error",
            });
            setTimeout(() => navigate("/hotels"), 2000);
          }
        } catch (error) {
          setModal({
            isOpen: true,
            message: `Network error: ${error.message}`,
            type: "error",
          });
          setTimeout(() => navigate("/hotels"), 2000);
        }
      };
      fetchClientSecret();
    } else {
      setModal({
        isOpen: true,
        message: "Invalid booking data. Redirecting to hotels.",
        type: "error",
      });
      setTimeout(() => navigate("/hotels"), 2000);
    }
  }, [bookingData, amount, bookingId, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      setModal({ isOpen: true, message: "Payment system not ready.", type: "error" });
      setLoading(false);
      return;
    }

    if (paymentMethod !== "card") {
      setModal({ isOpen: true, message: "Only card payments are supported at this time.", type: "error" });
      setLoading(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: { address: { postal_code: postalCode, country: country } },
      },
    });

    if (error) {
      setModal({ isOpen: true, message: error.message, type: "error" });
      setLoading(false);
    } else if (paymentIntent.status === "succeeded") {
      // Confirm payment with backend
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/payments/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId, paymentIntentId: paymentIntent.id }),
        });
        const data = await response.json();
        if (data.success) {
          setModal({
            isOpen: true,
            message: "Payment Successful! Your booking is confirmed.",
            type: "success",
          });
        } else {
          setModal({
            isOpen: true,
            message: data.message || "Failed to confirm booking.",
            type: "error",
          });
        }
      } catch (error) {
        setModal({
          isOpen: true,
          message: `Network error: ${error.message}`,
          type: "error",
        });
      }
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === "success") {
      navigate("/user/my-booking");
    }
  };

  const stripeElementStyles = {
    base: {
      fontSize: "16px",
      color: "#374151",
      "::placeholder": { color: "#9CA3AF" },
    },
    invalid: { color: "#EF4444" },
  };

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Netherlands",
    "Belgium",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Payment Form Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Payment Details</h1>
                <button
                  onClick={() => navigate(`/hotels/booking/${bookingData?.hotelId}/${bookingData?.roomType.toLowerCase().replace(" ", "")}`)}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  ← Back
                </button>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Payment Method</h2>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      paymentMethod === "card" 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <FaCreditCard className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Credit Card</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      paymentMethod === "paypal" 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal" className="h-6 mb-2" />
                      <span className="text-sm font-medium">PayPal</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("apple")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      paymentMethod === "apple" 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_pay.svg" alt="Apple Pay" className="h-6 mb-2" />
                      <span className="text-sm font-medium">Apple Pay</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Card Details Form */}
              {paymentMethod === "card" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Card Number</label>
                    <div className="p-3 border border-gray-300 rounded-lg bg-white">
                      <CardNumberElement 
                        options={{ 
                          style: stripeElementStyles,
                          placeholder: '1234 1234 1234 1234'
                        }} 
                        className="w-full"
                      />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !clientSecret}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaLock className="w-5 h-5" />
                        Pay ${amount?.toFixed(2) || '0.00'}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Room Type</span>
                  <span>{bookingData?.roomType}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Check-in</span>
                  <span>{bookingData?.checkInDate}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Check-out</span>
                  <span>{bookingData?.checkOutDate}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Nights</span>
                  <span>{bookingData?.nights || 1}</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${amount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaShieldAlt className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaLock className="w-5 h-5 text-green-500" />
                  <span className="text-sm">SSL Encrypted</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <img src={visaLogo} alt="Visa" className="h-8" />
                <img src={mastercardLogo} alt="Mastercard" className="h-8" />
                <img src={amexLogo} alt="American Express" className="h-8" />
                <img src={unionpayLogo} alt="UnionPay" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal.isOpen && <MessageModal message={modal.message} type={modal.type} onClose={closeModal} />}
    </div>
  );
};

export default PaymentPage;
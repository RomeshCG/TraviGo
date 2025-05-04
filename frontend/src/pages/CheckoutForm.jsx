import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MessageModal from "../components/MessageModal";
import { Loader2 } from "lucide-react";

const visaLogo = "https://www.logo.wine/a/logo/Visa_Inc./Visa_Inc.-Logo.wine.svg";
const mastercardLogo = "https://www.logo.wine/a/logo/Mastercard/Mastercard-Logo.wine.svg";
const amexLogo = "https://www.logo.wine/a/logo/American_Express/American_Express-Logo.wine.svg";
const unionpayLogo = "https://www.logo.wine/a/logo/UnionPay/UnionPay-Logo.wine.svg";

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: "", type: "" });
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [email, setEmail] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const { bookingData, amount } = location.state || {};

  // Prefill email and verification status from bookingData
  useEffect(() => {
    if (bookingData?.email) {
      setEmail(bookingData.email);
      if (bookingData.emailVerified) {
        setEmailVerified(true); // Skip re-verification if already verified
      }
    }
  }, [bookingData]);

  const handleSendVerificationCode = () => {
    if (!email) {
      setModal({ isOpen: true, message: "Please enter a valid email address.", type: "error" });
      return;
    }
    // Mock email sending: Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('verificationCode_' + email, code); // Store code locally
    localStorage.setItem('codeExpiry_' + email, Date.now() + 15 * 60 * 1000); // Expires in 15 minutes
    setIsVerifyingEmail(true);
    setModal({
      isOpen: true,
      message: `A verification code has been sent to ${email}. Code (for demo): ${code}`,
      type: "success",
    });
  };

  const handleVerifyCode = () => {
    const storedCode = localStorage.getItem('verificationCode_' + email);
    const expiry = localStorage.getItem('codeExpiry_' + email);
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem('verificationCode_' + email);
      localStorage.removeItem('codeExpiry_' + email);
      setModal({ isOpen: true, message: "Verification code has expired.", type: "error" });
      return;
    }
    if (verificationCode === storedCode) {
      setEmailVerified(true);
      setIsVerifyingEmail(false);
      setModal({ isOpen: true, message: "Email verified successfully!", type: "success" });
    } else {
      setModal({ isOpen: true, message: "Invalid verification code.", type: "error" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailVerified) {
      setModal({ isOpen: true, message: "Please verify your email before proceeding with payment.", type: "error" });
      return;
    }

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
    if (modal.type === "success" && !isVerifyingEmail) {
      navigate("/hotels");
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
    // Add more countries as needed
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payment</h1>
          <button
            onClick={() => navigate(`/hotels/booking/${bookingData?.hotelId}/${bookingData?.roomType.toLowerCase().replace(" ", "")}`)}
            className="text-blue-600 hover:underline font-semibold"
          >
            ← Back
          </button>
        </div>

        {/* Email Verification Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Verify Your Email</h2>
          <div className="flex items-center space-x-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
              disabled={emailVerified || bookingData?.emailVerified}
            />
            {!emailVerified && !isVerifyingEmail && !bookingData?.emailVerified && (
              <button
                type="button"
                onClick={handleSendVerificationCode}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Verify Email
              </button>
            )}
          </div>
          {isVerifyingEmail && (
            <div className="mt-4">
              <label htmlFor="verificationCode" className="block text-gray-700 font-medium mb-1">
                Verification Code
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter the 6-digit code"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                >
                  Submit Code
                </button>
              </div>
            </div>
          )}
          {emailVerified && (
            <p className="text-green-600 mt-2">Email Verified ✓</p>
          )}
        </div>

        {/* Payment Method Tabs */}
        {emailVerified && (
          <>
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm border-2 transition-all duration-200 ${
                  paymentMethod === "card" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700"
                }`}
              >
                Card
              </button>
              <button
                onClick={() => setPaymentMethod("bancontact")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm border-2 transition-all duration-200 ${
                  paymentMethod === "bancontact" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700"
                }`}
              >
                Bancontact
              </button>
              <button
                onClick={() => setPaymentMethod("ideal")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm border-2 transition-all duration-200 ${
                  paymentMethod === "ideal" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700"
                }`}
              >
                iDEAL
              </button>
            </div>

            {/* Payment Form */}
            {paymentMethod === "card" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Card Number */}
                <div>
                  <label htmlFor="cardNumber" className="block text-gray-700 font-medium mb-1">
                    Card Number
                  </label>
                  <div className="p-3 border border-gray-300 rounded-md bg-white flex items-center justify-between">
                    <CardNumberElement options={{ style: stripeElementStyles }} className="flex-1" />
                    <div className="flex space-x-2">
                      <img src={visaLogo} alt="Visa" className="h-5" />
                      <img src={mastercardLogo} alt="Mastercard" className="h-5" />
                      <img src={amexLogo} alt="Amex" className="h-5" />
                      <img src={unionpayLogo} alt="UnionPay" className="h-5" />
                    </div>
                  </div>
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-gray-700 font-medium mb-1">
                      Expiry MM / YY
                    </label>
                    <div className="p-3 border border-gray-300 rounded-md bg-white">
                      <CardExpiryElement options={{ style: stripeElementStyles }} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-gray-700 font-medium mb-1">
                      CVC
                    </label>
                    <div className="p-3 border border-gray-300 rounded-md bg-white flex items-center justify-between">
                      <CardCvcElement options={{ style: stripeElementStyles }} className="flex-1" />
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 6h18M3 14h18M3 18h18"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Country and ZIP */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-gray-700 font-medium mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-gray-700 font-medium mb-1">
                      ZIP
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="90210"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Terms */}
                <p className="text-gray-500 text-sm mt-4">
                  By providing your card information, you allow Techfolia to charge your card for future payments in accordance with their terms.
                </p>

                {/* Pay Button */}
                <button
                  type="submit"
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !stripe || !clientSecret}
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                  {loading ? "Processing..." : `Pay Now $${amount || "0"}`}
                </button>
              </form>
            )}

            {/* Placeholder for other payment methods */}
            {paymentMethod !== "card" && (
              <div className="text-center text-gray-600">
                <p>This payment method is not supported yet. Please select "Card" to proceed.</p>
              </div>
            )}
          </>
        )}
      </div>
      {modal.isOpen && (
        <MessageModal message={modal.message} type={modal.type} onClose={closeModal} showContinue={modal.type === "success" && !isVerifyingEmail} />
      )}
    </div>
  );
};

export default CheckoutForm;
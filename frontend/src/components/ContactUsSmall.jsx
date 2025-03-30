import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,}$/;

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number must be at least 10 digits";
    if (!formData.message) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    // Mock backend simulation
    const mockApiCall = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate a successful response 80% of the time
        if (Math.random() > 0.2) {
          resolve({ message: "Message sent successfully!" });
        } else {
          reject({ message: "Failed to send message" });
        }
      }, 1000); // 1-second delay to mimic network request
    });

    mockApiCall
      .then((data) => {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
      })
      .catch((error) => {
        toast.error(error.message || "Failed to connect to the server", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      });
  };

  return (
    <section className="bg-blue-50 py-16">
      <ToastContainer />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="md:w-1/2 mb-8 md:mb-0 bg-blue-50">
            <p className="text-gray-600 mb-6">
              Have questions, comments, or suggestions? We'd love to hear from
              you! Whether you're planning your next adventure, need assistance
              with an existing booking, or simply want to share your feedback,
              our team is here to help. Simply fill out the form below, and
              we'll get back to you as soon as possible. At TraviGo, we believe
              that great travel experiences start with great communication. Your
              input is invaluable to us, and we're committed to providing you
              with the best possible service. Let us know how we can make your
              journey even better!
            </p>
            <div className="space-y-4">
              <p className="flex items-center text-gray-700">
                <span className="mr-2">📍</span>
                10/A Kandy, Sri Lanka.
              </p>
              <p className="flex items-center text-gray-700">
                <span className="mr-2">📞</span>
                +94 81 249 0001
              </p>
              <p className="flex items-center text-gray-700">
                <span className="mr-2">✉️</span>
                contact@travigo.com
              </p>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-4xl font-bold text-blue-900 mb-6 text-left">
                Let's talk with us
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name*"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email*"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number*"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                >
                  Send Message
                  <span className="ml-2">➔</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
import React, { useState } from "react";

const ContactUs = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to send the form data to a backend or API
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      message: "",
    });
  };

  return (
    <section className="bg-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Left Side: Image and Contact Info */}
          <div className="md:w-1/2 mb-8 md:mb-0 bg-blue-50 ">
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

          {/* Right Side: Form with Title */}
          <div className="md:w-1/2">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              {/* Title aligned with the form box */}
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name*"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email*"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number*"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                    required
                  />
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
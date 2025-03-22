// src/pages/vehicleProviderRegister.jsx
import React from "react";
import { useForm } from "react-hook-form";

function VehicleProviderRegister() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password"); // Watch the password field to compare with confirm password

  const onSubmit = (data) => {
    console.log("Registration data:", data);
    alert("Registration successful! Check the console for form data.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Form Title */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Vehicle Provider Registration
        </h2>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters long",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Company Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Company
            </label>
            <input
              type="text"
              placeholder="Enter your company name"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.company ? "border-red-500" : "border-gray-300"
              }`}
              {...register("company", {
                required: "Company name is required",
                minLength: {
                  value: 2,
                  message: "Company name must be at least 2 characters long",
                },
              })}
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
            )}
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter your location"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
              {...register("location", {
                required: "Location is required",
              })}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default VehicleProviderRegister;
// src/pages/login.jsx
import React from "react";
import { useForm } from "react-hook-form";
import BackgroundImage from '../assets/carRental.jpg';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login data:", data);
    // Add your login logic here (e.g., API call to authenticate the user)
    alert("Login successful! Check the console for form data.");
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${BackgroundImage})` }}>
       
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Travigo</h1>
          <a href="/register" className="text-orange-500 hover:underline">
            Register
          </a>
        </div>

        {/* Form Title */}
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Vehicle Provider Login
        </h2>

       

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
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
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Login
          </button>
        </form>

        {/* Link to Register */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-orange-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
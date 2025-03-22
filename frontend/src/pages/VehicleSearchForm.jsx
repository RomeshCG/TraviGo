import React from "react";
import { useForm } from "react-hook-form";
import BackgroundImage from '../assets/carRental.jpg'; // Ensure this path is correct

const VehicleSearchForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${BackgroundImage})` }} // Use the imported image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Form Container */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4 text-center">Search Vehicles</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-semibold">Vehicle Type</label>
            <select
              {...register("vehicleType", { required: "Vehicle Type is required" })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
              
            </select>
            {errors.vehicleType && <p className="text-red-500">{errors.vehicleType.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Location</label>
            <input
              type="text"
              {...register("location", { required: "Location is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.location && <p className="text-red-500">{errors.location.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-semibold">From</label>
            <input
              type="date"
              {...register("from", { required: "Start date is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.from && <p className="text-red-500">{errors.from.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-semibold">To</label>
            <input
              type="date"
              {...register("to", { required: "End date is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.to && <p className="text-red-500">{errors.to.message}</p>}
          </div>

          <button className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default VehicleSearchForm;
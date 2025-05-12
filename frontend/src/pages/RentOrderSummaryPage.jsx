import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';

const RentOrderSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, formData } = location.state || {};

  if (!vehicle || !formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <h2 className="text-2xl font-bold text-red-600 mb-4">No rental information found.</h2>
        <Link to="/user/vehicles" className="text-blue-600 underline">Back to Vehicles</Link>
      </div>
    );
  }

  // Calculate rental days and total price
  const startDate = new Date(formData.startDate);
  const endDate = new Date(formData.endDate);
  const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const pricePerDay = vehicle.pricePerDay || vehicle.price || 100;
  const totalPrice = rentalDays * pricePerDay;

  const handlePaymentChoice = async (paymentMethod) => {
    if (paymentMethod === 'card') {
      navigate('/user/vehicles/payment', { state: { vehicle, formData } });
    } else {
      const confirm = window.confirm('Do you wish to place your order?');
      if (confirm) {
        try {
          const res = await fetch('http://localhost:5000/api/renting-vehicles/place-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vehicleId: vehicle._id,
              userName: formData.fullName,
              startDate: formData.startDate,
              endDate: formData.endDate,
              totalPrice,
              paymentMethod: 'Pay Upon Arrival',
            }),
          });
          if (res.ok) {
            alert('Your order has been placed successfully!');
            navigate('/user/vehicles');
          } else {
            alert('Failed to place the order. Please try again.');
          }
        } catch (err) {
          alert('An error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <>
      <SimpleHeader />
      <div className="pt-28 pb-12 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#203c8c] mb-6">Order Summary</h2>
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
                {formData.startDate} to {formData.endDate} ({rentalDays} days)
              </p>
            </div>
            <div>
              <p className="font-semibold">Price Per Day:</p>
              <p>${pricePerDay}</p>
            </div>
            <div>
              <p className="font-semibold">Total Price:</p>
              <p className="text-lg font-bold">${totalPrice}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Choose Payment Method:</h3>
            <div className="space-y-4">
              <button
                onClick={() => handlePaymentChoice('cash')}
                className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-all duration-300"
              >
                Pay Upon Arrival
              </button>
              <button
                onClick={() => handlePaymentChoice('card')}
                className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300"
              >
                Pay with Card
              </button>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link to="/user/vehicles" className="text-blue-600 underline">&larr; Back to Vehicles</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentOrderSummaryPage;


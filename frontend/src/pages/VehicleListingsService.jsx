import SimpleHeader from '../components/SimpleHeader'; 
import Footer from '../components/Footer'; 
import backgroundImage from "../assets/Herosec3.jpg";
import Vehicle1 from "../assets/Vehicle1.jpg";
import Vehicle2 from "../assets/Vehicle2.jpg";
import Vehicle3 from "../assets/Vehicle3.jpg";
import Vehicle4 from "../assets/Vehicle4.jpg";
import { useNavigate } from 'react-router-dom';

const VehicleListingsService = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <SimpleHeader />
      {/* Hero Section */}
      <section
        className="relative bg-teal-100 py-20 px-4"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-15"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Rent Vehicles with Ease
          </h1>
          <p className="text-lg text-white mb-6">
            Choose from a wide range of vehicles for your travel needs – from sedans to SUVs. Enjoy flexible rental options and a seamless booking experience.
          </p>
          <button className="bg-white text-teal-500 px-6 py-3 rounded-full hover:bg-gray-100" onClick={() => navigate('/user/vehicles')}>
            Let’s Talk
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-20 px-4 space-y-12">
        {/* Feature 1: Image on Left */}
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-16 space-y-4 md:space-y-0">
          <img
            src={Vehicle1}
            alt="Variety of vehicles including sedans and SUVs"
            className="w-full md:w-1/3 rounded-lg shadow-md"
            loading="lazy"
          />
          <div className="flex-1 flex items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Vehicle Variety</h3>
              <p className="text-gray-600">
                Find the perfect ride for every adventure with our extensive fleet. Whether you need a compact sedan for city exploring, a rugged SUV for mountain getaways, or a spacious van for group trips, we offer well-maintained vehicles equipped with modern amenities for maximum comfort and safety.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 2: Image on Right (Aligned to Far Right) */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
          <div className="flex-1 max-w-7xl mx-auto flex items-center md:mr-16">
            <div>
              <h3 className="text-xl font-bold mb-2">Flexible Rentals</h3>
              <p className="text-gray-600">
                Tailor your rental to match your travel plans with our stress-free options. Whether you need a vehicle for a quick 4-hour city tour, a week-long road trip, or an extended monthly rental, we offer customizable durations with transparent pricing.
              </p>
            </div>
          </div>
          <img
            src={Vehicle2}
            alt="Flexible vehicle rental options"
            className="w-full md:w-1/3 rounded-lg shadow-md md:ml-auto"
            loading="lazy"
          />
        </div>

        {/* Feature 3: Image on Left */}
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-16 space-y-4 md:space-y-0">
          <img
            src={Vehicle3}
            alt="Affordable vehicle rental rates"
            className="w-full md:w-1/3 rounded-lg shadow-md"
            loading="lazy"
          />
          <div className="flex-1 flex items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Affordable Rates</h3>
              <p className="text-gray-600">
                Get unbeatable value with transparent pricing that fits your budget. We guarantee no hidden fees – just straightforward rates that include insurance, mileage, and 24/7 support. Whether you need a budget-friendly option or premium ride, our Best Price Guarantee ensures you always get the most competitive deal.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 4: Image on Right (Aligned to Far Right) */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
          <div className="flex-1 max-w-7xl mx-auto flex items-center md:mr-16">
            <div>
              <h3 className="text-xl font-bold mb-2">Reliable Service</h3>
              <p className="text-gray-600">
                Travel with confidence in our meticulously maintained vehicles, each undergoing 150-point inspections before every rental. Our 24/7 support team is just a call away for emergencies, route advice, or last-minute changes – ensuring your journey is smooth from start to finish.
              </p>
            </div>
          </div>
          <img
            src={Vehicle4}
            alt="Reliable vehicle rental service"
            className="w-full md:w-1/3 rounded-lg shadow-md md:ml-auto"
            loading="lazy"
          />
        </div>
      </section>
      <Footer /> {/* Footer added here */}
    </div>
  );
};

export default VehicleListingsService;
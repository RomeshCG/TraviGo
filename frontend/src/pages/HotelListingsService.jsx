import SimpleHeader from '../components/SimpleHeader'; // Adjust path if needed
import Footer from '../components/Footer'; // Adjust path based on your project structure
import backgroundImage from "../assets/Herosec11.jpg";
import Hotel1 from "../assets/Hotel1.png";
import Hotel2 from "../assets/Hotel2.jpg";
import Hotel3 from "../assets/Hotel3.jpg";
import Hotel4 from "../assets/Hotel4.jpg";

const HotelListingsService = () => {
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
            Find Your Perfect Hotel with TraviGO
          </h1>
          <p className="text-lg text-white mb-6">
            Discover a wide range of hotels tailored to your needs – from luxury resorts to budget stays. Book easily and explore thousands of options to make your stay unforgettable.
          </p>
          <button className="bg-white text-teal-500 px-6 py-3 rounded-full hover:bg-gray-100">
            Let’s Talk
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-20 px-4 space-y-12">
        {/* Feature 1: Image on Left */}
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-16 space-y-4 md:space-y-0">
          <img
            src={Hotel1}
            alt="Variety of hotels including luxury resorts and budget stays"
            className="w-full md:w-1/3 rounded-lg shadow-md"
            loading="lazy"
          />
          <div className="flex-1 flex items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Wide Variety</h3>
              <p className="text-gray-600">
                From lavish 5-star resorts with private beaches and infinity pools to charming boutique stays brimming with local character, and budget-friendly hotels offering comfort without compromise—we provide every type of accommodation to match your travel style. Whether you need a business-ready hotel with premium workspaces, a family-friendly resort with kids’ clubs, or a cozy eco-lodge for a nature retreat, our carefully curated selection ensures quality, verified options worldwide. Backed by real traveler reviews and a best-price guarantee, your perfect stay is just a click away.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 2: Image on Right (Aligned to Far Right) */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
          <div className="flex-1 max-w-7xl mx-auto flex items-center md:mr-16">
            <div>
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Experience the simplest way to secure your perfect stay with our seamless booking system. Designed for modern travelers, our intuitive platform lets you complete reservations in just a few taps - no complicated forms or waiting for confirmations. Get instant booking confirmations sent directly to your email, with the freedom to modify or cancel most reservations when plans change. Our 24/7 customer support team is always ready to assist, ensuring your travel plans stay stress-free from the first click to check-in.
              </p>
            </div>
          </div>
          <img
            src={Hotel2}
            alt="Easy hotel booking process"
            className="w-full md:w-1/3 rounded-lg shadow-md md:ml-auto"
            loading="lazy"
          />
        </div>

        {/* Feature 3: Image on Left */}
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-16 space-y-4 md:space-y-0">
          <img
            src={Hotel3}
            alt="Best hotel deals and discounts"
            className="w-full md:w-1/3 rounded-lg shadow-md"
            loading="lazy"
          />
          <div className="flex-1 flex items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Best Deals</h3>
              <p className="text-gray-600">
                Enjoy exclusive discounts and special offers tailored just for you. We partner directly with hotels worldwide to bring you unbeatable rates, seasonal promotions, and last-minute deals you won’t find elsewhere. With our price-match guarantee, you’re always assured of getting the best value for your stay - whether it’s a luxury resort or budget accommodation. Plus, our members get access to extra savings and early-bird specials, making every trip more affordable without compromising on quality.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 4: Image on Right (Aligned to Far Right) */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
          <div className="flex-1 max-w-7xl mx-auto flex items-center md:mr-16">
            <div>
              <h3 className="text-xl font-bold mb-2">Trusted Reviews</h3>
              <p className="text-gray-600">
                Book with confidence using genuine guest reviews that highlight real experiences. We verify every review so you get honest insights about cleanliness, service quality, and amenities—helping you choose the perfect stay for your needs. Our transparent system shows recent feedback from travelers like you, ensuring you make informed decisions with up-to-date information.
              </p>
            </div>
          </div>
          <img
            src={Hotel4}
            alt="Trusted hotel reviews from travelers"
            className="w-full md:w-1/3 rounded-lg shadow-md md:ml-auto"
            loading="lazy"
          />
        </div>
      </section>
      <Footer /> {/* Footer added here */}
    </div>
  );
};

export default HotelListingsService;
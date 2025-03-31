import SimpleHeader from '../components/SimpleHeader'; 
import Footer from '../components/Footer'; 
import backgroundImage from "../assets/Herosec2.jpg";
import TourGuide1 from "../assets/TourGuide1.png";
import TourGuide2 from "../assets/TourGuide2.jpg";
import TourGuide3 from "../assets/TourGuide3.jpg";
import TourGuide4 from "../assets/TourGuide4.jpg";

const TourGuidesService = () => {
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
            Explore with Expert Tour Guides
          </h1>
          <p className="text-lg text-white mb-6">
            Connect with experienced tour guides to make your travel unforgettable. Enjoy personalized tours and gain local insights for a truly immersive experience.
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
            src={TourGuide1}
            alt="Local tour guide sharing expertise"
            className="w-full md:w-1/3 rounded-lg shadow-md"
            loading="lazy"
          />
          <div className="flex-1 flex items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Discover the heart of your destination with our passionate local guides. These carefully vetted experts offer more than just tours—they provide immersive experiences filled with authentic cultural insights, hidden neighborhood gems, and personal stories that bring each location to life. Whether you want to explore off-the-beaten-path cafes, understand ancient traditions, or find the perfect spot to watch the sunset, our guides connect you to the true spirit of the place.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 2: Image on Right (Aligned to Far Right) */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
          <div className="flex-1 max-w-7xl mx-auto flex items-center md:mr-16">
            <div>
              <h3 className="text-xl font-bold mb-2">Personalized Tours</h3>
              <p className="text-gray-600">
                Craft your perfect experience with tours tailored to your passions. Whether you're a history buff craving behind-the-scenes access to ancient sites, a foodie hunting hidden culinary gems, or an adventurer seeking off-the-beaten-path thrills—we'll design an itinerary that matches your travel style. Share your interests, and let our local experts create a one-of-a-kind journey just for you.
              </p>
            </div>
          </div>
          <img
            src={TourGuide2}
            alt="Personalized tour experience"
            className="w-full md:w-1/3 rounded-lg shadow-md md:ml-auto"
            loading="lazy"
          />
        </div>

        {/* Feature 3: Image on Left */}
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-16 space-y-4 md:space-y-0">
          <img
            src={TourGuide3}
            alt="Safe travel with tour guides"
            className="w-full md:w-1/3 rounded-lg shadow-md"
            loading="lazy"
          />
          <div className="flex-1 flex items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Safe Travel</h3>
              <p className="text-gray-600">
                Explore with peace of mind—our guides are trained in safety protocols and first aid, ensuring your adventure is as secure as it is unforgettable. From vetted transportation to emergency-ready itineraries, every detail is designed for your wellbeing.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 4: Image on Right (Aligned to Far Right) */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
          <div className="flex-1 max-w-7xl mx-auto flex items-center md:mr-16">
            <div>
              <h3 className="text-xl font-bold mb-2">Memorable Experiences</h3>
              <p className="text-gray-600">
                Go beyond the guidebook and discover what truly makes your destination special. Our handcrafted experiences – from sunrise temple ceremonies to secret local dining spots – are designed to create authentic connections and stories you'll cherish forever.
              </p>
            </div>
          </div>
          <img
            src={TourGuide4}
            alt="Memorable tour experiences"
            className="w-full md:w-1/3 rounded-lg shadow-md md:ml-auto"
            loading="lazy"
          />
        </div>
      </section>
      <Footer /> {/* Footer added here */}
    </div>
  );
};

export default TourGuidesService;
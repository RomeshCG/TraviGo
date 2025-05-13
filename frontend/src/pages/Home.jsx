import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowRight } from 'react-icons/fa';
import HotelsImg from '../assets/Hotels.jpg';
import TourGuide from '../assets/Tour_Guide.jpg';
import CarRental from '../assets/Car_Rentals.jpg';
import poolImg from '../assets/Beach.jpg';
import beachImg from '../assets/Sigiriya.jpg';
import Heroimg1 from '../assets/heroimg1.png';
import Heroimg2 from '../assets/TraviGoHero.jpg';
import Heroimg3 from '../assets/heroimg3.png';

const BASE_URL = 'http://localhost:5000';

// Define your slider images here
const sliderImages = [
  Heroimg1,
  Heroimg2,
  Heroimg3,
];

function Home() {
  const guidesRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topHotels, setTopHotels] = useState([]);
  const [topGuides, setTopGuides] = useState([]);
  const [guideReviews, setGuideReviews] = useState({});
  const navigate = useNavigate();

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch all hotels and show top 3
    axios.get('/api/hotels')
      .then(res => setTopHotels(Array.isArray(res.data) ? res.data.slice(0, 3) : []))
      .catch(() => setTopHotels([]));
    // Fetch all tour guides, sort by rating, show top 3
    axios.get('/api/tour-guides')
      .then(async (res) => {
        const guides = Array.isArray(res.data) ? res.data : [];
        guides.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const top = guides.slice(0, 3);
        setTopGuides(top);
        // Fetch reviews for each top guide
        const reviewsObj = {};
        await Promise.all(top.map(async (guide) => {
          try {
            const resp = await axios.get(`/api/tour-guide/${guide._id}/reviews`);
            if (resp.data && Array.isArray(resp.data.reviews)) {
              // Only reviews by tourists
              reviewsObj[guide._id] = resp.data.reviews.filter(r => r.reviewerType === 'tourist');
            } else {
              reviewsObj[guide._id] = [];
            }
          } catch {
            reviewsObj[guide._id] = [];
          }
        }));
        setGuideReviews(reviewsObj);
      })
      .catch(() => setTopGuides([]));
  }, []);

  return (
    <div className="bg-white">
      <Header />
      {/* Hero Section with Image Slider */}
      <div className="relative min-h-screen bg-white flex flex-col">
        <div className="absolute top-0 left-0 w-full z-50 bg-opacity-90">
          {/* Hide Header if on dashboard */}
          {/* Header is now always SimpleHeader above */}
        </div>
        <div className="relative flex flex-col items-center justify-center flex-grow text-blue-900 text-center px-4">
          <div className="absolute inset-0 w-full h-full">
            {sliderImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          <div className="relative z-10">
            <h1 className="text-6xl font-extrabold text-white animate-pulse">
              Discover Your Perfect Stay
            </h1>
            <p className="text-xl mt-6 max-w-2xl leading-relaxed animate-fade-in text-blue-800">
              Where Your Dream Vacation Becomes a Reality. Customize your travel
              experience with our exclusive packages.
            </p>
            <button className="mt-8 bg-blue-600 px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition text-white" onClick={() => navigate('/about')}>
              More About <FaArrowRight className="ml-2 inline" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-6 bg-white p-4 rounded-lg shadow-lg">
          {[
            {
              title: 'Hotels',
              link: '/hotels',
              desc: 'Find the best hotels for your stay.',
            },
            {
              title: 'Vehicles',
              link: '/user/vehicles',
              desc: 'Rent vehicles for your travel needs.',
            },
            {
              title: 'Guides',
              ref: guidesRef,
              desc: 'Hire experienced tour guides.',
              link: '/tour-guides',
            },
          ].map((service, index) => (
            <div key={index} className="p-4 text-center rounded-lg">
              {service.link ? (
                <Link
                  to={service.link}
                  className="block cursor-pointer hover:bg-gray-200 transition p-2 rounded-lg"
                >
                  <h3 className="text-2xl font-bold text-blue-600">{service.title}</h3>
                  <p className="text-gray-700 mt-2">{service.desc}</p>
                </Link>
              ) : (
                <div
                  className="cursor-pointer hover:bg-gray-200 transition p-2 rounded-lg"
                  onClick={() => scrollToSection(service.ref)}
                >
                  <h3 className="text-2xl font-bold text-blue-600">{service.title}</h3>
                  <p className="text-gray-700 mt-2">{service.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Welcome to TraviGo Section */}
      <div className="bg-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                Welcome to <span>TraviGo</span>
              </h2>
              <p className="mt-6 text-lg text-gray-800 leading-relaxed">
                Welcome to TraviGo, your ultimate travel companion for exploring
                the breathtaking beauty of Sri Lanka. At TraviGo, we believe that
                every journey should be as unique as the traveler. Whether you're
                planning a serene beach getaway, an adventurous trek through lush
                mountains, or a cultural exploration of ancient cities, we are
                here to make your travel dreams come true.
                <br />
                <br />
                Our platform offers a seamless experience, connecting you with
                the best hotels, reliable vehicle rentals, and experienced tour
                guides tailored to your preferences. With TraviGo, you can
                effortlessly plan your entire trip, from accommodation to
                transportation, ensuring a hassle-free and memorable adventure.
              </p>
              <button
                className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                onClick={() => navigate('/about')}
              >
                Read More <FaArrowRight className="ml-2 inline" />
              </button>
            </div>

            <div className="md:w-1/2 flex flex-wrap justify-center gap-4">
              <img
                src={beachImg}
                alt="Beach"
                className="w-full md:w-[48%] h-[300px] object-cover rounded-lg shadow-md"
              />
              <img
                src={poolImg}
                alt="Pool"
                className="w-full md:w-[48%] h-[300px] object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Luxury Stays',
                img: HotelsImg,
                desc: 'Discover the perfect stay with TraviGo. From luxury resorts to cozy boutique hotels, we offer a wide range of accommodations to suit every traveler’s needs.',
                link: '/services/hotel-listings',
              },
              {
                title: 'Tour Packages',
                img: TourGuide,
                desc: 'Explore Sri Lanka with ease. Rent reliable vehicles, from compact cars to spacious SUVs, and enjoy seamless travel experiences tailored to your preferences.',
                link: '/services/tour-guides',
              },
              {
                title: 'Vehicle Rentals',
                img: CarRental,
                desc: 'Experience Sri Lanka like a local. Hire expert tour guides who will take you on unforgettable journeys through the island’s rich culture and stunning landscapes.',
                link: '/services/vehicle-listings',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden text-center p-6"
              >
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h3 className="text-2xl font-semibold mt-6 text-blue-600">
                  {service.title}
                </h3>
                <p className="text-gray-700 mt-4">{service.desc}</p>
                <Link to={service.link}>
                  <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    Explore
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Hotels Section */}
      <div className="py-12 bg-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-800 mb-10">
            Top Hotels
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
            Discover the best hotels for your stay with TraviGo. From luxury resorts to cozy boutique hotels, we offer a wide range of accommodations to suit every traveler’s needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topHotels.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400">No hotels found.</div>
            ) : (
              topHotels.map((hotel, idx) => (
                <div key={hotel._id || idx} className="bg-gray-50 rounded-xl shadow-md overflow-hidden text-center p-6 border border-gray-100">
                  <img src={hotel.image || HotelsImg} alt={hotel.name} className="w-full h-56 object-cover rounded-lg mb-4" onError={e => {e.target.onerror=null;e.target.src=HotelsImg;}} />
                  <h3 className="text-xl font-semibold text-blue-700">{hotel.name}</h3>
                  <p className="text-gray-500 mt-2">{hotel.location}</p>
                  <p className="text-gray-600 mt-2 text-sm">{hotel.description?.slice(0, 80)}...</p>
                  <Link to={`/hotels/${hotel._id}`}>
                    <button className="mt-6 bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-900 transition font-medium">
                      View Details
                    </button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Tour Guides Section */}
      <div ref={guidesRef} className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-800 mb-10">
            Expert Tour Guides
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
            Experience Sri Lanka like a local. Hire expert tour guides who will take you on unforgettable journeys through the island’s rich culture and stunning landscapes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topGuides.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400">No tour guides found.</div>
            ) : (
              topGuides.map((guide, idx) => {
                let profilePic = guide.profilePicture;
                if (profilePic && !/^https?:\/\//.test(profilePic)) {
                  profilePic = `${BASE_URL}/${profilePic.replace(/^\/+/, '')}`;
                }
                // Get reviews for this guide
                const reviews = guideReviews[guide._id] || [];
                // Pick the latest review by a tourist
                const reviewRating = reviews.length > 0 ? reviews[0].rating : null;
                return (
                  <div key={guide._id || idx} className="bg-white rounded-xl shadow-md overflow-hidden text-center p-6 border border-gray-100">
                    <img src={profilePic || TourGuide} alt={guide.name} className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-2 border-blue-200" onError={e => {e.target.onerror=null;e.target.src=TourGuide;}} />
                    <h3 className="text-xl font-semibold text-blue-700">{guide.name}</h3>
                    <p className="text-gray-500 mt-2">{guide.location}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < (reviewRating != null ? reviewRating : (guide.rating || 0)) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                      <span className="ml-2 text-blue-700">{reviewRating != null ? reviewRating.toFixed(1) : (guide.rating ? guide.rating.toFixed(1) : 'N/A')}</span>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">{guide.bio?.slice(0, 80)}...</p>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex justify-center mt-10">
            <Link to="/tour-guides">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md text-base font-semibold shadow hover:bg-blue-700 transition">
                View All Tour Guides
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Did You Know Section */}
      <div className="py-16 bg-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight">
            Did You Know?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col border-t-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-700 mb-3">Sri Lanka is home to 8 UNESCO World Heritage Sites</h3>
              <p className="text-gray-700">From the ancient city of Sigiriya to the sacred city of Kandy, Sri Lanka boasts a rich cultural heritage recognized globally.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col border-t-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-700 mb-3">World’s Best Train Journey</h3>
              <p className="text-gray-700">The train ride from Kandy to Ella is often ranked among the most scenic in the world, passing through lush tea plantations and misty mountains.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col border-t-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-700 mb-3">A Biodiversity Hotspot</h3>
              <p className="text-gray-700">Sri Lanka is one of the world’s top biodiversity hotspots, with many unique species of flora and fauna found nowhere else on Earth.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {/* FAQ 1 */}
            <details className="group bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all border-l-4 border-blue-500">
              <summary className="flex items-center justify-between text-lg font-semibold text-blue-700 group-open:text-blue-800">
                How do I book a hotel, vehicle, or tour guide with TraviGo?
                <span className="ml-2 text-2xl transition-transform group-open:rotate-90">›</span>
              </summary>
              <p className="mt-4 text-gray-700">Simply browse our listings, select your preferred hotel, vehicle, or guide, and follow the easy booking steps. Our platform ensures a secure and seamless experience from start to finish.</p>
            </details>
            {/* FAQ 2 */}
            <details className="group bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all border-l-4 border-blue-500">
              <summary className="flex items-center justify-between text-lg font-semibold text-blue-700 group-open:text-blue-800">
                Is it safe to travel in Sri Lanka in 2025?
                <span className="ml-2 text-2xl transition-transform group-open:rotate-90">›</span>
              </summary>
              <p className="mt-4 text-gray-700">Absolutely! Sri Lanka is welcoming travelers with open arms in 2025, offering enhanced safety, vibrant festivals, and world-class hospitality. TraviGo partners only with trusted providers for your peace of mind.</p>
            </details>
            {/* FAQ 3 */}
            <details className="group bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all border-l-4 border-blue-500">
              <summary className="flex items-center justify-between text-lg font-semibold text-blue-700 group-open:text-blue-800">
                Can I customize my travel package?
                <span className="ml-2 text-2xl transition-transform group-open:rotate-90">›</span>
              </summary>
              <p className="mt-4 text-gray-700">Yes! TraviGo lets you tailor your trip—choose your hotels, vehicles, and guides to create a personalized Sri Lankan adventure that fits your style and budget.</p>
            </details>
            {/* FAQ 4 */}
            <details className="group bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all border-l-4 border-blue-500">
              <summary className="flex items-center justify-between text-lg font-semibold text-blue-700 group-open:text-blue-800">
                How do I book a vehicle for my trip?
                <span className="ml-2 text-2xl transition-transform group-open:rotate-90">›</span>
              </summary>
              <p className="mt-4 text-gray-700">You can easily book a vehicle by visiting our Vehicles section, choosing your preferred car, van, or SUV, and completing the booking process online. All vehicles are provided by trusted partners for your safety and comfort.</p>
            </details>
            <div className="text-center pt-8">
              <Link to="/faq" className="text-blue-700 font-semibold underline hover:text-blue-900 transition">View All FAQs</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="py-12 bg-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Have Questions or Need Help?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">Contact our team for travel advice, booking support, or any inquiries. We’re here to help make your journey seamless.</p>
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-lg"
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
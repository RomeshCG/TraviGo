import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SimpleHeader from "../components/SimpleHeader";
import Footer from "../components/Footer";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/hotels/${id}`);
        if (!response.ok) {
          throw new Error(`Accommodation not found: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Fetched hotel ID: ${data._id}`);
        setAccommodation(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodation();
  }, [id]);

  const handleRoomSelect = (roomIndex) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Token present: ${!!token}`);
      setSelectedRoomIndex(roomIndex);
      const bookingPath = `/hotels/booking/${id}/room${roomIndex}`;
      console.log(`Navigating to: ${bookingPath}`);
      navigate(bookingPath);
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  // Slider settings for image carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (loading) {
    return (
      <>
        <SimpleHeader />
        <div className="pt-24 text-center text-gray-600 text-2xl font-semibold py-10">Loading...</div>
        <Footer />
      </>
    );
  }

  if (error || !accommodation) {
    return (
      <>
        <SimpleHeader />
        <div className="pt-24 text-center text-red-600 text-2xl font-semibold py-10">{error || "Accommodation Not Found"}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {accommodation.name}
            </h1>
            <p className="text-blue-100 mt-2">{accommodation.location}</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image Carousel */}
              <div className="lg:col-span-2">
                <Slider {...sliderSettings}>
                  <div>
                    <img
                      src={accommodation.image || '/images/placeholder.jpg'}
                      alt={accommodation.name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                  {accommodation.imageArray.map((img, index) => (
                    <div key={index}>
                      <img
                        src={img || '/images/placeholder.jpg'}
                        alt={`Additional view ${index + 1}`}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </Slider>
              </div>

              {/* Details */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Details</h2>
                <div className="space-y-3">
                  <p className="text-gray-700"><strong>Name:</strong> {accommodation.name}</p>
                  <p className="text-gray-700"><strong>Price:</strong> ${accommodation.price}/night</p>
                  <p className="text-gray-700"><strong>Description:</strong> {accommodation.description}</p>
                  {accommodation.phone && (
                    <p className="text-gray-700"><strong>Phone:</strong> {accommodation.phone}</p>
                  )}
                  {accommodation.email && (
                    <p className="text-gray-700"><strong>Email:</strong> {accommodation.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Rooms */}
            <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-6">Available Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accommodation.rooms.map((room, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold text-gray-800">{room.type}</h3>
                  <p className="text-gray-600 mt-2"><strong>Price:</strong> ${room.price}/night</p>
                  <p className="text-gray-600 mt-1"><strong>Features:</strong> {room.features}</p>
                  <p className="text-gray-600 mt-1"><strong>Amenities:</strong> {room.amenities}</p>
                  {room.size && <p className="text-gray-600 mt-1"><strong>Size:</strong> {room.size}</p>}
                  {room.occupancy && <p className="text-gray-600 mt-1"><strong>Occupancy:</strong> {room.occupancy}</p>}
                  {room.perks && <p className="text-gray-600 mt-1"><strong>Perks:</strong> {room.perks}</p>}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {room.images.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img || '/images/placeholder.jpg'}
                        alt={`Room view ${imgIndex + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleRoomSelect(index)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-semibold"
                  >
                    Book This Room
                  </button>
                </div>
              ))}
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/hotels')}
              className="mt-8 text-blue-600 hover:underline font-semibold flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Accommodations
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default HotelDetails;
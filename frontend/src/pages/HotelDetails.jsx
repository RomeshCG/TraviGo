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
  const [reviews, setReviews] = useState([]);

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/hotel-reviews/hotel/${id}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
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

  // Slider settings for main image carousel
  const mainSliderSettings = {
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
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {accommodation.name}
            </h1>
            <p className="text-blue-100 mt-2">{accommodation.location}</p>
          </div>

          <div className="p-8">
            {/* Back Button */}
            <button
              onClick={() => navigate('/hotels')}
              className="mb-6 text-blue-600 hover:underline font-semibold flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Accommodations
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image Carousel */}
              <div className="lg:col-span-2">
                <Slider {...mainSliderSettings}>
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
            <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-6 text-center">Available Rooms</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
              {accommodation.rooms.map((room, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-7 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{room.type}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {room.images.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img || '/images/placeholder.jpg'}
                        alt={`${room.type} view ${imgIndex + 1}`}
                        className="w-full h-40 object-cover rounded-md cursor-pointer"
                        onClick={() => handleRoomSelect(index)}
                      />
                    ))}
                  </div>
                  <ul className="text-gray-600 text-sm space-y-2 mb-4">
                    <li><strong>Price:</strong> ${room.price}/night</li>
                    <li><strong>Features:</strong> {room.features}</li>
                    <li><strong>Amenities:</strong> {room.amenities}</li>
                    {room.size && <li><strong>Size:</strong> {room.size}</li>}
                    {room.occupancy && <li><strong>Occupancy:</strong> {room.occupancy}</li>}
                    {room.perks && <li><strong>Perks:</strong> {room.perks}</li>}
                  </ul>
                  <button
                    onClick={() => handleRoomSelect(index)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2.5 px-4 rounded-md hover:from-blue-700 hover:to-blue-900 transition font-semibold mt-auto"
                  >
                    Book This Room
                  </button>
                </div>
              ))}
            </div>

            {/* User Reviews */}
            <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-6 text-center">User Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-600 text-center">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-gray-50 p-6 rounded-lg shadow-md mb-4">
                  <p className="text-gray-800 font-semibold">{review.userId.name}</p>
                  <p className="text-yellow-500">{'⭐'.repeat(review.rating)}</p>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default HotelDetails;
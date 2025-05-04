import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SimpleHeader from "../components/SimpleHeader";
import Footer from "../components/Footer";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoomImages, setSelectedRoomImages] = useState([]);
  const [reviews] = useState([
    { id: 1, user: "John D.", rating: 5, comment: "Stunning views and excellent service!" },
    { id: 2, user: "Sarah M.", rating: 4, comment: "Great ambiance, Wi-Fi could improve." },
  ]);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels/${id}`);
        if (!response.ok) {
          throw new Error(`Hotel not found (status: ${response.status})`);
        }
        const data = await response.json();
        setHotel(data);
        setSelectedRoomImages(data.rooms?.map((room) => room.images?.[0] || "") || []);
      } catch (error) {
        console.error("Error fetching hotel:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) {
    return <h2 className="text-center text-gray-600 text-2xl font-semibold py-10">Loading...</h2>;
  }

  if (error || !hotel) {
    return <h2 className="text-center text-red-600 text-2xl font-semibold py-10">{error || "Hotel Not Found"}</h2>;
  }

  const {
    name: Name,
    image: Image,
    imageArray: ImageArray = [],
    location: Location,
    description: desc,
    rooms = [],
  } = hotel;

  const allImages = [Image, ...(ImageArray || [])];
  const mainImage = allImages[currentImageIndex] || Image;

  const handleBooking = (roomIndex) => {
    navigate(`/hotels/booking/${id}/room${roomIndex}`);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev >= allImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev <= 0 ? allImages.length - 1 : prev - 1));
  };

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Image Gallery */}
          <div className="relative mb-10 rounded-xl overflow-hidden shadow-lg">
            <img src={mainImage} alt={Name} className="w-full h-[500px] object-cover" />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition"
                >
                  ←
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition"
                >
                  →
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {allImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-3 h-3 rounded-full ${idx === currentImageIndex ? "bg-white" : "bg-gray-400"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Hotel Name and Location */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800">{Name}</h1>
            <p className="text-gray-600 text-lg mt-2">{Location}</p>
          </div>

          {/* Hotel Description */}
          <div className="mb-16 text-center">
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">{desc}</p>
          </div>

          {/* Room Details Section */}
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Rooms & Suites</h2>
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <div key={index} className="mb-12 bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">{room.type || "Unnamed Room"}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    {room.images?.length > 0 ? (
                      <>
                        <img
                          src={selectedRoomImages[index] || room.images[0]}
                          alt={room.type}
                          className="w-full h-[450px] object-cover rounded-lg mb-6 shadow-md"
                        />
                        <div className="flex gap-3 overflow-x-auto">
                          {room.images.map((img, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={img}
                              alt={`${room.type} - ${imgIndex + 1}`}
                              className={`w-24 h-24 object-cover rounded-md cursor-pointer ${
                                selectedRoomImages[index] === img ? "border-2 border-blue-600" : "border border-gray-300"
                              } hover:border-blue-500 transition`}
                              onClick={() =>
                                setSelectedRoomImages((prev) => {
                                  const newImages = [...prev];
                                  newImages[index] = img;
                                  return newImages;
                                })
                              }
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600">No images available</p>
                    )}
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-gray-700 mb-3">
                        <strong>Features:</strong> {room.features || "N/A"}
                      </p>
                      <p className="text-gray-700 mb-3">
                        <strong>Amenities:</strong> {room.amenities || "N/A"}
                      </p>
                      <p className="text-gray-700 mb-3">
                        <strong>Size:</strong> {room.size || "N/A"}
                      </p>
                      <p className="text-gray-700 mb-3">
                        <strong>Occupancy:</strong> {room.occupancy || "N/A"}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <strong>Perks:</strong> {room.perks || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-gray-800 font-semibold text-xl">${room.price || "N/A"}/night</p>
                      <button
                        onClick={() => handleBooking(index)}
                        className="bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No rooms available for this hotel.</p>
          )}

          {/* Hotel Facilities */}
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Hotel Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Swimming Pool</h3>
              <p className="text-gray-600">Enjoy our infinity pool with ocean views.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Spa & Wellness</h3>
              <p className="text-gray-600">Relax with a range of spa treatments.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dining</h3>
              <p className="text-gray-600">Savor local and international cuisine.</p>
            </div>
          </div>

          {/* Why Choose Us */}
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-gray-700">
                <strong>Prime Location:</strong> Steps away from Galle’s historic fort and beaches.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-gray-700">
                <strong>Exceptional Service:</strong> 24/7 concierge and personalized attention.
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Guest Reviews</h2>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            {reviews.map((review) => (
              <div key={review.id} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center mb-3">
                  <span className="text-gray-800 font-semibold text-lg">{review.user}</span>
                  <span className="ml-3 text-yellow-500 text-lg">{Array(review.rating).fill("★").join("")}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HotelDetails;
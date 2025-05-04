import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    phone: "",
    email: "",
    image: "",
    imageArray: [],
    rooms: [],
  });
  const [newImage, setNewImage] = useState(null);
  const [newImageArray, setNewImageArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!id) {
        setError("No hotel ID provided");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/hotels/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch hotel details (status: ${response.status})`);
        }
        const data = await response.json();
        setHotel({
          name: data.name || "",
          location: data.location || "",
          price: data.price || "",
          description: data.description || "",
          phone: data.phone || "",
          email: data.email || "",
          image: data.image || "",
          imageArray: data.imageArray || [],
          rooms: data.rooms || [],
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelDetails();
  }, [id]);

  const handleChange = (e, roomIndex = null) => {
    const { name, value } = e.target;
    if (roomIndex !== null) {
      const updatedRooms = [...hotel.rooms];
      updatedRooms[roomIndex][name] = value;
      setHotel({ ...hotel, rooms: updatedRooms });
    } else {
      setHotel({ ...hotel, [name]: value });
    }
  };

  const handleFileChange = (e, type, roomIndex = null) => {
    const files = Array.from(e.target.files);
    if (type === "main") {
      setNewImage(files[0]);
    } else if (type === "array") {
      setNewImageArray(files);
    } else if (type === "room" && roomIndex !== null) {
      const updatedRooms = [...hotel.rooms];
      updatedRooms[roomIndex].images = [...updatedRooms[roomIndex].images, ...files];
      setHotel({ ...hotel, rooms: updatedRooms });
    }
  };

  const addRoom = () => {
    setHotel({
      ...hotel,
      rooms: [
        ...hotel.rooms,
        {
          type: "",
          features: "",
          amenities: "",
          images: [],
          price: "",
          size: "",
          occupancy: "",
          perks: "",
        },
      ],
    });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setError("No hotel ID provided for update");
      return;
    }
    try {
      const payload = {
        name: hotel.name,
        location: hotel.location,
        price: Number(hotel.price),
        description: hotel.description,
        phone: hotel.phone,
        email: hotel.email,
        image: newImage ? await toBase64(newImage) : hotel.image,
        imageArray: newImageArray.length
          ? await Promise.all(newImageArray.map((img) => toBase64(img)))
          : hotel.imageArray,
        rooms: await Promise.all(
          hotel.rooms.map(async (room) => ({
            ...room,
            images: room.images.length
              ? await Promise.all(
                  room.images.map((img) => (typeof img === "string" ? img : toBase64(img)))
                )
              : [],
            price: Number(room.price),
          }))
        ),
      };

      const response = await fetch(`http://localhost:5000/api/hotels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update hotel: ${errorData.message || response.status}`);
      }

      alert("Hotel updated successfully!");
    } catch (error) {
      console.error("Error updating hotel:", error);
      setError(error.message);
    }
  };

  if (loading) return <div className="text-center text-gray-600 text-xl font-semibold py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 text-xl font-semibold py-10">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Hotel Details</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
            <input
              type="text"
              name="name"
              value={hotel.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={hotel.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price ($)</label>
            <input
              type="number"
              name="price"
              value={hotel.price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={hotel.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={hotel.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={hotel.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition min-h-[100px]"
            required
          />
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Images</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
            {hotel.image && (
              <img src={hotel.image} alt="Main" className="w-32 h-32 object-cover rounded-lg mb-2" />
            )}
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "main")}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {hotel.imageArray.map((img, index) => (
                <img key={index} src={img} alt={`Additional ${index}`} className="w-24 h-24 object-cover dibattito-lg" />
              ))}
            </div>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, "array")}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Room Types</h3>
          {hotel.rooms.map((room, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <input
                    type="text"
                    name="type"
                    value={room.type}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($/night)</label>
                  <input
                    type="number"
                    name="price"
                    value={room.price}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  <textarea
                    name="features"
                    value={room.features}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition min-h-[100px]"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                  <textarea
                    name="amenities"
                    value={room.amenities}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition min-h-[100px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={room.size}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupancy</label>
                  <input
                    type="text"
                    name="occupancy"
                    value={room.occupancy}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perks</label>
                  <input
                    type="text"
                    name="perks"
                    value={room.perks}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Images</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {room.images.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={`Room ${index} ${imgIndex}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(e, "room", index)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addRoom}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Add Room Type
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Update Hotel
        </button>
      </form>
    </div>
  );
}

export default HotelDetails;
import { useState } from "react";

function AddHotel() {
  const [hotelData, setHotelData] = useState({
    name: "",
    location: "",
    accommodationType: "Villa",
    price: "",
    description: "",
    image: null,
    imageArray: [],
    rooms: [
      { type: "", features: "", amenities: "", images: [], price: "", size: "", occupancy: "", perks: "" },
    ],
  });

  const accommodationTypes = [
    "Villa",
    "Cabana",
    "Cottage",
    "Bungalow",
    "Pod Hotel",
    "Chalet",
    "Treehouse",
  ];

  const handleInputChange = (e, roomIndex = null) => {
    const { name, value } = e.target;
    if (roomIndex !== null) {
      const updatedRooms = [...hotelData.rooms];
      updatedRooms[roomIndex][name] = value;
      setHotelData({ ...hotelData, rooms: updatedRooms });
    } else {
      setHotelData({ ...hotelData, [name]: value });
    }
  };

  const handleFileChange = (e, type, roomIndex = null) => {
    const files = Array.from(e.target.files);
    if (type === "main") {
      setHotelData({ ...hotelData, image: files[0] });
    } else if (type === "array") {
      setHotelData({ ...hotelData, imageArray: files });
    } else if (type === "room" && roomIndex !== null) {
      const updatedRooms = [...hotelData.rooms];
      updatedRooms[roomIndex].images = files;
      setHotelData({ ...hotelData, rooms: updatedRooms });
    }
  };

  const addRoomType = () => {
    setHotelData({
      ...hotelData,
      rooms: [
        ...hotelData.rooms,
        { type: "", features: "", amenities: "", images: [], price: "", size: "", occupancy: "", perks: "" },
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

    if (!hotelData.name || !hotelData.location || !hotelData.accommodationType || !hotelData.price || !hotelData.description || !hotelData.image) {
      alert("Please fill all required fields and upload a main image.");
      return;
    }

    try {
      const token = localStorage.getItem("providerToken");
      if (!token) {
        alert("You are not authenticated. Please log in as a Hotel Provider.");
        return;
      }

      const payload = {
        name: hotelData.name,
        location: hotelData.location,
        accommodationType: hotelData.accommodationType,
        price: hotelData.price,
        description: hotelData.description,
        image: await toBase64(hotelData.image),
        imageArray: hotelData.imageArray.length
          ? await Promise.all(hotelData.imageArray.map((img) => toBase64(img)))
          : [],
        rooms: await Promise.all(
          hotelData.rooms.map(async (room) => {
            if (!room.type || !room.features || !room.amenities || !room.price) {
              throw new Error(`Missing required fields in room: ${room.type || "Unnamed"}`);
            }
            return {
              ...room,
              images: room.images.length ? await Promise.all(room.images.map((img) => toBase64(img))) : [],
            };
          })
        ),
      };

      const response = await fetch("http://localhost:5000/api/hotels/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${data.message || 'Unknown error'}`);
      }

      alert("Accommodation added successfully!");
      setHotelData({
        name: "",
        location: "",
        accommodationType: "Villa",
        price: "",
        description: "",
        image: null,
        imageArray: [],
        rooms: [
          { type: "", features: "", amenities: "", images: [], price: "", size: "", occupancy: "", perks: "" },
        ],
      });
    } catch (error) {
      console.error("Error adding accommodation:", error);
      alert(`Error adding accommodation: ${error.message}`);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Add New Accommodation</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Accommodation Name</label>
            <input
              type="text"
              name="name"
              value={hotelData.name}
              onChange={handleInputChange}
              placeholder="e.g., Sunset Villa"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={hotelData.location}
              onChange={handleInputChange}
              placeholder="e.g., Galle, Sri Lanka"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Accommodation Type</label>
            <select
              name="accommodationType"
              value={hotelData.accommodationType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            >
              {accommodationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Base Price ($)</label>
            <input
              type="number"
              name="price"
              value={hotelData.price}
              onChange={handleInputChange}
              placeholder="e.g., 150"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Main Image</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "main")}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Additional Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, "array")}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={hotelData.description}
              onChange={handleInputChange}
              placeholder="e.g., A luxurious beachfront villa with stunning ocean views."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition min-h-[100px]"
              required
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Room Types</h3>
        {hotelData.rooms.map((room, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Room Type</label>
                <input
                  type="text"
                  name="type"
                  value={room.type}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="e.g., Deluxe Suite"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Price ($/night)</label>
                <input
                  type="number"
                  name="price"
                  value={room.price}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="e.g., 200"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Features</label>
                <textarea
                  name="features"
                  value={room.features}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="e.g., Ocean view\nKing-sized bed\nPrivate balcony"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition min-h-[100px]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Amenities</label>
                <textarea
                  name="amenities"
                  value={room.amenities}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="e.g., Flat-screen TV\nAir conditioning\nRoom service"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition min-h-[100px]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Size</label>
                <input
                  type="text"
                  name="size"
                  value={room.size}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="e.g., 400 sq ft"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Occupancy</label>
                <input
                  type="text"
                  name="occupancy"
                  value={room.occupancy}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="e.g., 2 adults, 1 child"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Perks</label>
                <input
                  type="text"
                  name="perks"
                  value={room.perks}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="e.g., Free spa access, Late checkout"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Room Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(e, "room", index)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addRoomType}
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition font-semibold"
        >
          Add More Room Types
        </button>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition font-semibold"
        >
          Add Accommodation
        </button>
      </form>
    </div>
  );
}

export default AddHotel;
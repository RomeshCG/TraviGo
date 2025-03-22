import React from 'react';
import { FaGasPump, FaCog, FaCarSide, FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa';

const CarRentalSection = () => {
  // Define reviews data in an array for better scalability
  const reviews = [
    {
      name: 'Emily T',
      location: 'California',
      flag: 'https://flagcdn.com/16x12/us.png',
      comment:
        'TravoGo made our weekend getaway so much better! We rented a petrol-powered 2-door convertible, and it was the perfect choice for cruising along the coast with my friends. The car was spotless, and the staff at TravoGo were incredibly friendly, giving us tips on scenic routes to explore. The vehicle handled beautifully, and we had no issues with it during our trip. Returning the car was quick and hassle-free, and I loved how transparent their pricing was—no hidden fees! Can’t wait to rent from TravoGo again for our next adventure.',
    },
    {
      name: 'Jhone Doe',
      location: 'United States',
      flag: 'https://flagcdn.com/16x12/us.png',
      comment:
        'I rented a 2-door automatic SUV from TravoGo for a family road trip, and it was an absolute delight! The booking process was seamless, and the vehicle was in pristine condition when we picked it up. It had enough space for our luggage, and the air conditioning kept us comfortable during the long drives. The petrol efficiency was impressive, which saved us some money on fuel. TravoGo’s customer support was also super helpful when we had a question about extending our rental period. Highly recommend them for anyone looking for a reliable rental experience!',
    },
    {
      name: 'Jhone Doe',
      location: 'United States',
      flag: 'https://flagcdn.com/16x12/us.png',
      comment:
        'I used TravoGo to rent a sedan for a business trip, and overall, it was a great experience. The car was clean, and the 1197 cc engine provided a smooth ride for my daily commutes. I appreciated the automatic transmission since I was navigating unfamiliar city roads. The only reason I’m giving 4 stars instead of 5 is that the pickup location was a bit crowded, and it took longer than expected to get the keys. But once I was on the road, everything was perfect. TravoGo’s app made managing my booking easy, and I’ll definitely use them again for my next trip.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Options Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <div className="flex space-x-4">
          <button className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
            <FaGasPump className="mr-2" />
            <span>Petrol</span>
          </button>
          <button className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
            <FaCog className="mr-2" />
            <span>Automatic</span>
          </button>
          <button className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
            <FaCarSide className="mr-2" />
            <span>2-Door</span>
          </button>
          <button className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
            <span>1197 cc</span>
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div
        className="relative bg-cover bg-center py-16"
        style={{
          backgroundImage: "url('https://via.placeholder.com/1200x400')", // Replace with your background image URL
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-black">Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index} // Add key prop for each review card
                className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src="https://via.placeholder.com/50"
                    alt={review.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <div className="flex items-center">
                      <span className="text-sm">{review.location}</span>
                      <img
                        src={review.flag}
                        alt={`${review.location} Flag`}
                        className="ml-2"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <a href="#" className="text-blue-500 mt-2 inline-block">
                  Read More
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-orange-500 text-white py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* TravoGo Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">TravoGo</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare
              cursus sed nunc eget dictum. Sed ornare cursus sed nunc eget dictum
              sed nunc eget dictum.
            </p>
            <div className="flex space-x-4 mt-4">
              {/* Social Media Icons */}
              <a href="#" className="text-white">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-white">
                <FaTiktok size={24} />
              </a>
              <a href="#" className="text-white">
                <FaFacebook size={24} />
              </a>
            </div>
          </div>

          {/* Customer Support Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Button
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Button
                </a>
              </li>
            </ul>
          </div>

          {/* Header Text Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Header Text</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Button
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Button
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarRentalSection;
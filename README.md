# 🌐 TraviGo – All-in-One Tourism Management System

TraviGo is a full-stack web application designed to simplify tourism in Sri Lanka by integrating **tour guide bookings**, **hotel reservations**, and **vehicle rentals** into a single, user-friendly platform.

Built with the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**, TraviGo empowers tourists, service providers, and admins to manage their travel needs efficiently and securely.

---

## 🚀 Features

### 🧳 Tourists
- Browse and book:
  - Tour guides
  - Hotels
  - Vehicles
- Make secure online payments
- View booking history and status
- Receive automated confirmation emails
- Contact tour guides for custom packages

### 👨‍💼 Tour Guides
- Register and manage profile
- Add, update, and delete tour packages
- Accept or reject bookings
- Track earnings and request payouts
- View booking details and contact tourists

### 🏨 Hotel & 🚗 Vehicle Providers *(in progress or extendable)*
- Add and manage listings
- Accept tourist bookings
- View booking calendar (optional enhancement)

### 🛠️ Admin Panel
- Manage all bookings across modules
- Approve or reject guide booking requests
- Process payments and cashout requests
- View guide bank details for payouts
- Manage user reports and feedback

---

## 📸 Screenshots

> _Coming soon..._  
> Add screenshots for:
> - Home Page
> - Booking Interface
> - Admin Dashboard
> - Tour Guide Dashboard
> - Contact Forms

---

## 💻 Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Email Service**: Brevo (Sendinblue)
- **Payment Handling**: Stripe (Manual payout model)

---

## 📂 Folder Structure (Simplified)

```bash
TraviGo/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── README.md

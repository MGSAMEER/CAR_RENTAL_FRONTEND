# CAR_RENTAL_FRONTEND
A full-stack Car Rental Web Application with user authentication, car booking, payment integration, admin dashboard, vehicle management, booking management, and responsive UI. Built using modern web technologies for a seamless vehicle rental experience.

<div align="center">

# 🚗 CAR RENTAL FRONTEND

### Premium Full Stack Car Rental Web Application

<img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/Zustand-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" />
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />

<br/>

<img src="https://img.shields.io/github/license/MGSAMEER/CAR_RENTAL_FRONTEND?style=flat-square" />
<img src="https://img.shields.io/github/stars/MGSAMEER/CAR_RENTAL_FRONTEND?style=flat-square" />
<img src="https://img.shields.io/github/forks/MGSAMEER/CAR_RENTAL_FRONTEND?style=flat-square" />

</div>

---

# 📌 About The Project

`CAR_RENTAL_FRONTEND` is a state-of-the-art vehicle rental platform designed for a seamless customer experience. Users can browse available cars, view detailed specifications, make secure bookings with live pricing, pay online via Stripe, and track their rentals in real-time.

The application also features a comprehensive Admin Dashboard to manage vehicles, monitor bookings, handle user reviews, and track system analytics.

---

# ✨ Features

## 👤 User Features
* **Modern Dashboard**: Responsive and beautiful landing page with dark/light mode toggle.
* **Car Listings & Details**: Live filtering, sorting, and rich detail cards featuring dynamic parameters.
* **Driver License Verification**: Secure upload flow to authorize drivers before rental.
* **Stripe Booking Flow**: Fully-secured Stripe integration for immediate, safe online payments.
* **Google OAuth & JWT**: Single sign-on using Google or standard credentials with email verification.
* **Profile Management**: View rental history, manage reviews, and update personal account profiles.

## 🛠️ Admin Features
* **Resource Management**: Add, update, and remove vehicles with image assets and pricing models.
* **Order Tracking**: Complete overview of active, completed, and pending bookings.
* **Customer Verification**: Inspect uploaded driver documents to verify eligibility.
* **Analytics**: Business intelligence stats showing popular vehicles, revenue, and active bookings.

---

# 🖥️ Tech Stack

<div align="center">

| Core Frontend | Core Backend | Databases & Tools |
|---------------|--------------|-------------------|
| **Next.js 14** (App Router) | **Node.js** & **Express** | **MongoDB Atlas** (Mongoose) |
| **TypeScript** & **Tailwind CSS** | **JWT** & **Google OAuth** | **Git** & **GitHub** |
| **Zustand** (State Management) | **Brevo REST API** (Emails) | **Render** (Production Deployment) |
| **Stripe React SDK** | **Winston** & **Morgan** | **ESLint** & **Prettier** |

</div>

---

# 📂 Folder Structure

```bash
CAR_RENTAL_FRONTEND/
├── public/             # Static assets, logos, and illustrations
├── app/                # Next.js App Router (Pages, Layouts, and Actions)
│   ├── admin/          # Admin Dashboard views
│   ├── bookings/       # Customer Booking logs and tracking
│   ├── cars/           # Vehicle browsing and dynamic catalog pages
│   ├── login/          # User login portals
│   ├── profile/        # Customer settings and booking history
│   ├── register/       # User sign up pages
│   └── verify-email/   # Registration verification handler
├── components/         # Reusable UI widgets and layout views
├── lib/                # API client configuration, Zustand stores, and hooks
├── package.json        # Dependencies and build scripts
├── tsconfig.json       # TypeScript compiler settings
└── README.md           # Documentation
```

---

# 🔑 Environment Setup

Create `frontend/.env.local` inside the frontend directory and define the following variables:

```env
NEXT_PUBLIC_API_URL=https://car-rental-avtw.onrender.com/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
```

> [!IMPORTANT]
> Next.js embeds `NEXT_PUBLIC_*` environment variables at build time. Ensure they are correctly configured in your hosting dashboard before building for production.

---

# 🚀 Getting Started

## 1️⃣ Clone Repository
```bash
git clone https://github.com/MGSAMEER/CAR_RENTAL_FRONTEND.git
cd CAR_RENTAL_FRONTEND
```

## 2️⃣ Install Dependencies
```bash
npm install
```

## 3️⃣ Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your app running.

## 4️⃣ Build for Production
```bash
npm run build
npm run start
```

---

# 🤝 Contributing
Contributions are highly welcome!
1. Fork the Repository.
2. Create a Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

# 📜 License
This project is licensed under the MIT License.

---

# 👨‍💻 Developer
**Sameer Kanade**  
Full Stack Developer  
GitHub: [@MGSAMEER](https://github.com/MGSAMEER)

# TaxiEase Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/taxiease
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/taxiease

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Brevo)
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=noreply@taxiease.com
SENDER_NAME=TaxiEase

# SMS Configuration (Brevo)
SMS_SENDER=TAXIEASE

# Base URL for tracking links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Setup Steps

### 1. Database Setup
- Install MongoDB locally or use MongoDB Atlas
- Update `MONGODB_URI` in your `.env.local` file

### 2. Razorpay Setup
- Create a Razorpay account at https://razorpay.com
- Get your API keys from the dashboard
- Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your `.env.local` file

### 3. Email/SMS Setup (Optional)
- Create a Brevo account at https://brevo.com
- Get your API key from the dashboard
- Update `BREVO_API_KEY` in your `.env.local` file
- Configure sender email and SMS sender name

### 4. Admin Panel
- Default admin credentials:
  - Username: `admin`
  - Password: `admin123`
- Change these in your `.env.local` file for security

### 5. Install Dependencies
```bash
npm install
```

### 6. Run the Application
```bash
npm run dev
```

## Features Implemented

### ✅ Booking System
- Complete booking form with customer details
- Route selection (Delhi ↔ Ludhiana/Chandigarh)
- Vehicle selection (Sedan, Ertiga, Crysta)
- Dynamic pricing based on route and vehicle

### ✅ Payment Integration
- Razorpay payment gateway integration
- Secure payment verification
- Payment status tracking

### ✅ Database Integration
- MongoDB with Mongoose
- Booking model with all necessary fields
- Automatic booking ID generation

### ✅ Admin Panel
- Secure admin authentication
- Dashboard with booking statistics
- Booking management (view, update status)
- Real-time booking updates

### ✅ Notifications
- Email confirmations for bookings
- SMS notifications with tracking links (if Brevo is configured)
- Status update notifications via email and SMS
- Customized for TaxiEase one-way trip service

## API Endpoints

### Bookings
- `GET /api/bookings` - Fetch all bookings (with pagination)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[id]` - Fetch single booking
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Payments
- `POST /api/payments/verify` - Verify Razorpay payment

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify admin token
- `POST /api/admin/send-status-update` - Send status update notifications

### Tracking
- `GET /track/[bookingId]` - Customer booking tracking page

## Admin Panel Access

1. Go to `/admin`
2. Login with your admin credentials
3. Access dashboard at `/admin/dashboard`

## Booking Flow

1. Customer selects route and vehicle
2. Fills booking form
3. Payment through Razorpay
4. Booking stored in MongoDB
5. Confirmation email/SMS sent with tracking link
6. Customer can track booking status via SMS link
7. Admin can manage booking from dashboard
8. Status updates trigger notifications to customer

## Security Features

- JWT-based admin authentication
- Secure payment verification
- Input validation and sanitization
- Environment variable protection

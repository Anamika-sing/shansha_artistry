# Shansha Artistry

A full-stack e-commerce website for handmade Lippan art. Customers can browse products, add them to a cart and pay by Cash on Delivery or online (Razorpay). An admin dashboard manages products and orders.

> Live demo: _coming soon_

## Features

**Customers**
- Sign up and log in (JWT authentication, passwords hashed with bcrypt)
- Browse products with Size and Price filters, and a View Details popup
- Cart with quantity controls and a WhatsApp order link
- Checkout with **Cash on Delivery** or **online payment (Razorpay, test mode)**
- My Orders page showing order history and payment status

**Admin**
- Separate admin login
- Add products (with category) and delete products
- View all customer orders
- Update an order's payment status (Pending, Paid, Cancelled)

**Security**
- Role-based access: product and order management routes are admin-only
- Prices are calculated on the server from the database, never trusted from the browser
- Razorpay payment signature is verified on the server before an order is marked as Paid
- Secrets are kept in environment variables (`.env`), not in the code

## Tech stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas with Mongoose
- **Auth:** JSON Web Tokens, bcryptjs
- **Payments:** Razorpay

## Project structure

```
shansha_artistry/
├── BACKEND/
│   ├── Server.js            # Express app entry point
│   ├── authMiddleware.js    # JWT checks (protect, adminOnly)
│   ├── userRoutes.js        # signup, login
│   ├── adminRoutes.js       # admin login
│   ├── productRoutes.js     # list, add, delete products
│   ├── orderRoutes.js       # create, my orders, all orders, update status
│   ├── paymentRoutes.js     # Razorpay create-order and verify
│   ├── user.js, admin.js, product.js, order.js   # Mongoose models
│   ├── seed.js              # adds sample products once
│   └── .env.example
└── FRONTEND/
    ├── index.html, shop.html, cart.html, cod.html, online_payment.html
    ├── my_orders.html, user_login.html, admin_login.html, admin_dashboard.html
    ├── about.html, contact.html
    ├── style.css
    └── IMAGES/
```

## Getting started

**Prerequisites:** Node.js, a MongoDB Atlas database, and a Razorpay account (test mode keys).

1. **Install backend packages**
   ```bash
   cd BACKEND
   npm install
   ```

2. **Create `BACKEND/.env`** by copying `.env.example` and filling in your own values:
   ```
   MONGO_URI=...
   JWT_SECRET=...
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   ```

3. **Add sample products (once)**
   ```bash
   node seed.js
   ```

4. **Create an admin account.** In MongoDB Atlas, insert one document into the `admins` collection:
   ```json
   { "email": "admin@example.com", "password": "choose-a-password" }
   ```
   The password is converted to a bcrypt hash automatically the first time you log in.

5. **Start the server** (runs on port 5000)
   ```bash
   node Server.js
   ```

6. **Open the frontend.** Open `FRONTEND/index.html` with the VS Code Live Server extension (usually `http://127.0.0.1:5500`).

## Testing payments

Online payments run in Razorpay **test mode**, so no real money is charged. Use the test card and UPI details from Razorpay's documentation, and choose **Success** on the demo bank page.

## Author

Built by Anamika Singh.
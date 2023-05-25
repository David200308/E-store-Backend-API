# E-store-Backend-API
The Backend REST API use for E-store write by Node.JS + MySQL + Stripe Payment API

## Programming Language & Framework

- Node.JS --- Backend API
- MySQL --- Database

## Payment Gateway

- Stripe Payment API (Test Mode)

## Code Usage

```bash
## Backend - initial API (Fill the info in .env)
cd Backend
npm install
node index.js

## Backend - initial payment service
cd backend/payment
node server.js
```

## Structure

- Login & Signup & Logout API - use MySQL database to handle data
- Product & Cart - use database to connect the user and their cart with order
- Payment & Order - use database to connect the payment and order by user

## Creator

- Guanlin Jiang

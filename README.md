# Secure Login & Authentication System

A complete, production-ready full-stack authentication system built with Next.js 14, MongoDB, and Tailwind CSS. It features a premium Dark Navy aesthetic, secure HTTP-only cookies, and robust server-side route protection.

**Live Demo**: [https://your-vercel-demo-link.vercel.app](https://your-vercel-demo-link.vercel.app) *(Replace with your actual Vercel link once deployed)*

## Features

- **Next.js App Router**: Utilizing the latest React Server Components and fast edge routing.
- **Secure Sessions**: Authentication is handled purely through `HTTP-only` cookies to prevent XSS attacks.
- **Route Protection**: Next.js Server Middleware automatically intercepts and redirects unauthorized requests.
- **Account Security**: Includes account lockout (after 5 failed attempts for 30 minutes) and bcrypt password hashing.
- **Email Verification**: Integration with Nodemailer for OTP-based email verification and secure password resets.
- **Premium UI**: Custom-built Dark Navy / White color scheme with smooth animations and minimal layout.

## 🚀 Local Setup Instructions

1. **Clone the repository** (or download the source code):
   ```bash
   git clone https://github.com/africasimo5-cyber/secure-login-system.git
   cd secure-login-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and configure the variables (see below).

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚙️ Environment Variables Guide

Your `.env.local` file must contain the following keys:

```env
# MongoDB Connection String (e.g., from MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/secure-auth?retryWrites=true&w=majority

# JWT Secret Key (Generate a strong, random 64-character string)
JWT_SECRET=your_super_secure_random_string_here

# Gmail SMTP Credentials (Must use a 16-character App Password, not your real password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password

# Authentication URL (Points to your domain, use localhost for dev)
NEXTAUTH_URL=http://localhost:3000
```

> **Note on Gmail SMTP**: If you have 2-Step Verification enabled on Gmail, you must generate an [App Password](https://myaccount.google.com/apppasswords) to use as your `EMAIL_PASS`.

## 🌐 Deployment to Vercel

If you'd like to deploy this application to the Vercel free tier, follow these manual steps:

### Step 1: Push to GitHub
1. Go to [GitHub](https://github.com/new) and create a new empty repository (e.g., `secure-login-system`).
2. Open your terminal in the project folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Secure Auth System"
   git branch -M main
   git remote add origin https://github.com/africasimo5-cyber/secure-login-system.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel
1. Log in to [Vercel](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import your newly created `secure-login-system` GitHub repository.
4. Open the **Environment Variables** section before clicking "Deploy".
5. Add all 4 variables (`MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`) copying the values from your `.env.local`.
   - *Note: Don't use `localhost:3000` for `NEXTAUTH_URL` on production, use the vercel domain provided.*
6. Click **Deploy**. Vercel will automatically build and launch your application!

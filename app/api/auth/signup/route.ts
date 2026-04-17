import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { sendOTPEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Basic Validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    await connectToDatabase();

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Generate 6-digit OTP and set expiry (10 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // 5. Create and save user (isVerified: false by default)
    const newUser = new User({
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    await newUser.save();

    // 6. Send OTP via email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // We still return success since the user was created, but add a note
      return NextResponse.json({ 
        message: 'Account created, but verification email failed to send. Please try resending later.', 
        success: true 
      }, { status: 201 });
    }

    return NextResponse.json({ 
      message: 'Signup successful! Please check your email for the verification code.', 
      success: true 
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

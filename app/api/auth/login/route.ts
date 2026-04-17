import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: 'Please verify your email before logging in' }, { status: 403 });
    }

    if (user.isLocked()) {
      return NextResponse.json({ error: 'Account is locked. Please try again later.' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.password!);

    if (!isMatch) {
      user.loginAttempts += 1;
      
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }
      
      await user.save();
      
      if (user.isLocked()) {
        return NextResponse.json({ error: 'Account locked due to too many failed attempts' }, { status: 403 });
      }

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success - reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = await signToken({ userId: user._id, email: user.email });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token
    }, { status: 200 });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

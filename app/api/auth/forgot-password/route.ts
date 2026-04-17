import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { sendResetEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    // Important security practice: Return success even if user doesn't exist
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      }, { status: 200 });
    }

    // Generate a reset token valid for 1 hour
    const token = signToken({ userId: user._id, email: user.email }, '1h');
    const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${NEXTAUTH_URL}/reset-password?token=${token}`;

    try {
      await sendResetEmail(email, resetUrl);
    } catch (emailError) {
      console.error('Password reset email failed:', emailError);
      return NextResponse.json({ error: 'Failed to send reset email. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'If an account with that email exists, we have sent a password reset link.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

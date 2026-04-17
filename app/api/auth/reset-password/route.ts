import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Verify the token
    const decoded: any = await verifyToken(token);

    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user
    user.password = hashedPassword;
    
    // Optionally unlock the account if it was locked
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

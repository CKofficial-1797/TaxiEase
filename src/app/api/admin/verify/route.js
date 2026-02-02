import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';

// GET - Verify admin token
export async function GET(request) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }
    
    const isValid = verifyAdminToken(token);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Token is valid'
    });
    
  } catch (error) {
    console.error('❌ Admin token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Token verification failed' },
      { status: 500 }
    );
  }
}

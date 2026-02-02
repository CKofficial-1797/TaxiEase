import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/lib/adminAuth';

// POST - Admin logout
export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });
    
    // Clear admin cookie
    clearAdminCookie(response);
    
    return response;
    
  } catch (error) {
    console.error('❌ Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}

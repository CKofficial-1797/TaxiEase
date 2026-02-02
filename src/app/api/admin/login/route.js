import { NextResponse } from 'next/server';
import { verifyAdminCredentials, generateAdminToken, setAdminCookie } from '@/lib/adminAuth';

// POST - Admin login
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Verify credentials
    const isValid = verifyAdminCredentials(username, password);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate token
    const token = generateAdminToken();
    
    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful'
    });
    
    // Set admin cookie
    setAdminCookie(response, token);
    
    return response;
    
  } catch (error) {
    console.error('❌ Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}

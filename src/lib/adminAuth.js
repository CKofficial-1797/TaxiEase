import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export function verifyAdminCredentials(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function generateAdminToken() {
  return jwt.sign(
    { 
      role: 'admin',
      username: ADMIN_USERNAME,
      timestamp: Date.now()
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.role === 'admin' && decoded.username === ADMIN_USERNAME;
  } catch {
    return false;
  }
}

export function adminAuthMiddleware(request, handler) {
  return async () => {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    return await handler(request);
  };
}

export function setAdminCookie(response, token) {
  response.cookies.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  return response;
}

export function clearAdminCookie(response) {
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0
  });
  return response;
}

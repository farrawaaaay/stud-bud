// app/api/valid-token/route.js
import jwt from 'jsonwebtoken';

export async function GET(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return new Response(JSON.stringify({ message: 'Token is missing' }), { status: 400 });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is valid, respond with a success message
    return new Response(JSON.stringify({ valid: true, user: decoded }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
  }
}

import jwt from 'jsonwebtoken';
import { getUserFromDB } from '../../lib/database'; // Function to fetch user from the database

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user data from database using the decoded user ID
      const user = await getUserFromDB(decoded.userId); // Assuming decoded.userId is available

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send user data as response
      res.status(200).json({
        name: user.name,
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

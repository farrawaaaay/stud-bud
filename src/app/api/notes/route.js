import { NextResponse } from 'next/server';
import Note from '@/models/Note'; // Adjust the path as per your Next.js structure
import connectDB from '@/lib/mongodb'; // Ensure MongoDB connection is established
import { verifyToken } from '@/lib/auth'; // Path to your auth.js file

// Connect to the database before handling requests
connectDB();

// Helper function to get the token from the request
function getTokenFromHeader(req) {
    const authorizationHeader = req.headers.get('Authorization');
    if (!authorizationHeader) return null;

    const token = authorizationHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    return token;
}

// GET: Fetch notes for the logged-in student
export async function GET(req) {
    try {
        const token = getTokenFromHeader(req);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized, token missing' }, { status: 401 });
        }

        const decoded = verifyToken(token); // Verify the token
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized, invalid token' }, { status: 401 });
        }

        const studentId = decoded.id; // The student's ID is embedded in the token
        const notes = await Note.find({ studentId }); // Fetch notes for the logged-in student
        return NextResponse.json(notes, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to fetch notes', message: err.message },
            { status: 500 }
        );
    }
}

// POST: Create a new note for the logged-in student
export async function POST(req) {
    try {
        const token = getTokenFromHeader(req);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized, token missing' }, { status: 401 });
        }

        const decoded = verifyToken(token); // Verify the token
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized, invalid token' }, { status: 401 });
        }

        const { title, content, category } = await req.json();
        const studentId = decoded.id; // The student's ID is embedded in the token

        const newNote = new Note({ title, content, category, studentId });
        const savedNote = await newNote.save();
        return NextResponse.json(savedNote, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to create note', message: err.message },
            { status: 500 }
        );
    }
}

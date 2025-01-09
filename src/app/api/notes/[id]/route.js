import { NextResponse } from 'next/server';
import Note from '@/models/Note';
import connectDB from '@/lib/mongodb';

connectDB();

// GET: Fetch a single note by ID
export async function GET(req, { params }) {
    try {
        const { id } = params;
        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json(note, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to fetch note', message: err.message },
            { status: 500 }
        );
    }
}

// PUT: Update a note by ID
export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const { title, content, category } = await req.json();
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content, category },
            { new: true, runValidators: true }
        );
        if (!updatedNote) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json(updatedNote, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to update note', message: err.message },
            { status: 500 }
        );
    }
}

// DELETE: Delete a note by ID
export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to delete note', message: err.message },
            { status: 500 }
        );
    }
}

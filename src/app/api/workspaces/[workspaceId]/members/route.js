import Workspace from '@/models/Workspace'; // Adjust path as needed
import connectDB from '@/lib/mongodb'; // If you're using a db utility to handle MongoDB connections

export async function GET(req, { params }) {
  const { workspaceId } = params; // Extract workspaceId from the URL

  try {
    await connectDB(); // Make sure to connect to the database

    // Find the workspace and populate the members (assuming members is an array of user references)
    const workspace = await Workspace.findById(workspaceId).populate('members', 'name email');

    if (!workspace) {
      return new Response(JSON.stringify({ message: 'Workspace not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(workspace.members), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

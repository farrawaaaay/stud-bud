import connectDB from "@/lib/mongodb"; // Assuming you have a dbConnect utility
import Workspace from "@/models/Workspace"; // Assuming you have a Workspace model

export async function GET(req) {
  try {
    // Extract userId from the query string
    const url = new URL(req.url, `http://${req.headers.host}`); // Create a URL object to parse the query string
    const userId = url.searchParams.get("userId"); // Get the userId from the query parameters

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "User ID is missing" }),
        { status: 400 }
      );
    }

    await connectDB(); // Connect to your database

    // Find the workspace for the given userId
    const workspace = await Workspace.findOne({ owner: userId });

    if (!workspace) {
      return new Response(
        JSON.stringify({ message: "Workspace not found" }),
        { status: 404 }
      );
    }

    // Response with the workspace details
    return new Response(
      JSON.stringify({
        id: workspace._id,
        title: workspace.title,
        owner: workspace.owner,
        isDefault: workspace.isDefault || true,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching workspace" }),
      { status: 500 }
    );
  }
}

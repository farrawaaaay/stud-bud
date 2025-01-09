// app/api/quotes/route.js
export async function GET() {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
  
    return new Response(JSON.stringify(data[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
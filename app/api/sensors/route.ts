import { NextResponse } from 'next/server';

export async function GET() {
    const SERVER_URL = process.env.SERVER_URL;

    if (SERVER_URL) {
        try {
            // User path: /api/temperature (GET request)
            const res = await fetch(`${SERVER_URL}/api/temperature`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            });

            if (!res.ok) {
                // Return fallback data or error if upstream fails
                console.error(`Upstream error: ${res.status}`);
                return NextResponse.json({
                    message: "Upstream error",
                    temperature: 0,
                    status: "error"
                });
            }

            const data = await res.json();
            return NextResponse.json(data);
        } catch (error) {
            console.error("Proxy Error:", error);
            return NextResponse.json(
                { message: "Failed to fetch from external server", error: String(error) },
                { status: 502 }
            );
        }
    }

    // Fallback for dev without env var (Mock)
    return NextResponse.json({
        message: "No SERVER_URL configured",
        temperature: 0
    });
}

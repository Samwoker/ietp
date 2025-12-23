import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { message, context, history } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key is not configured." },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `
                You are a Sterilization Expert AI assistant. 
                You are monitoring a real-time sterilization system.
                
                Current System Context:
                - Temperature: ${context.temperature}°C
                - Pressure: ${context.pressure} kPa
                - Germ Kill Percentage: ${context.killPercentage.toFixed(1)}%
                
                Instructions:
                1. Provide concise, professional, and helpful advice.
                2. If the temperature is below 121°C, note that effective sterilization usually happens above that point.
                3. If pathogen elimination is 100%, congratulate the user on a successful cycle.
                4. Answer questions about the system status based on the provided context.
                5. If you don't know something, be honest.
            `
        });

        // Gemini requires the first message in history to be from the 'user'
        const firstUserIndex = history.findIndex((msg: any) => msg.role === 'user');
        const sanitizedHistory = firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

        const chat = model.startChat({
            history: sanitizedHistory.map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            })),
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ content: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Failed to process AI request" },
            { status: 500 }
        );
    }
}

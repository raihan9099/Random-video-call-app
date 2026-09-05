import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || "" }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: "You are a helpful AI assistant for FUNKEY, a platform for random video calls and meeting new people online. FUNKEY is the best alternative to Monkey app and Omegle, especially in India (India ka fastest random video chat). Users can enjoy free stranger video calls without login, 1-on-1 random video calls, and a safe environment with AI moderation. Answer questions about the platform, how it works, safety features, and provide a fun, engaging experience for users. Keep your answers concise and friendly. If users ask about specific topics like 'Monkey app jaisa experience' or 'Omegle alternatives', explain why FUNKEY is the best choice."
      }
    });

    const text = response.text || "";

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const processChatMessage = async (
    query: string,
    context: { temperature: number; pressure: number; killPercentage: number },
    history: ChatMessage[] = []
): Promise<string> => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: query,
                context,
                history
            })
        });

        if (!response.ok) {
            const data = await response.json();
            return `AI Error: ${data.error || 'Failed to connect to Gemini'}`;
        }

        const data = await response.json();
        return data.content;
    } catch (e) {
        console.error("Chat service error:", e);
        return "I'm having trouble connecting to the AI brain right now. Please check your internet or API configuration.";
    }
};

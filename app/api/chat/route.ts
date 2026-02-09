import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    transcript,
  }: { messages: UIMessage[]; transcript?: string } = await req.json();

  // Build system prompt with transcript context
  const systemPrompt = `You are a helpful AI assistant for a training video platform called Pulse. 
You help users understand video content by answering their questions based on the video transcript.

Here is the video transcript for context:
---
${transcript || 'No transcript available.'}
---

Answer questions about the video content clearly and concisely. If the question is not related to the video content, 
you can still help but mention that it's outside the scope of the current video.`;

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, transcript } = await req.json();

  const systemPrompt = `You are a knowledgeable AI assistant for Ujjivan Small Finance Bank's "Two Wheeler Loan" product.
Your goal is to answer user questions accurately based *only* on the provided product program document.

Here is the "Two Wheeler Loan – Product Program" document for context:
---
${transcript || 'No context available.'}
---

Guidelines:
1. Answer clearly and concisely.
2. If the answer is not in the provided document, politely state that you don't have that information in the current context.
3. Use a professional and helpful tone.
4. If the user asks about something unrelated to the Two Wheeler Loan, guide them back to the topic or mention your scope is limited to this product.`;

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

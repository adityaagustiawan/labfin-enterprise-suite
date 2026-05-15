import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY_2 || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const result = await streamText({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: google('gemini-1.5-flash') as any,
    messages: [
      {
        role: 'system',
        content: `You are the LabFin Enterprise AI Agent. 
        Current Date: May 15, 2026. 
        Project ID: sound-splicer-490504-p1.
        Location: https://labfin-enterprise-suite-mfk0j2bbo-adityaagustiawans-projects.vercel.app. 
        
        CRITICAL RULES: 
        1. Use $$...$$ for ALL math and numbers (e.g., $$45.2\%$$). 
        2. Provide expert-level enterprise analytics and market data. 
        3. Use formulas like ROI: $$ROI = \\frac{(T_{man} - T_{auto}) \\times C}{I}$$`
      },
      ...messages,
    ],
  });

  return result.toDataStreamResponse();
}

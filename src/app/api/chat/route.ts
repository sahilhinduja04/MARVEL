import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MARVEL_CHARACTERS, CharacterId } from '@/types/marvel';
import { generateCharacterFallbackResponse } from '@/utils/characterAi';

function extractFinalDialogue(text: string, userQuery: string): string {
  if (!text) return '';

  const cleanUserQuery = userQuery.toLowerCase().trim();

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const candidateLines = lines.filter((line) => {
    const lower = line.toLowerCase().replace(/^["']|["']$/g, '').trim();
    
    // Reject prompt echoes
    if (lower === cleanUserQuery) return false;
    if (cleanUserQuery.length > 5 && lower.includes(cleanUserQuery) && lower.length < cleanUserQuery.length + 20) return false;
    
    // Reject bullet points, reasoning notes, and instruction headers
    if (line.startsWith('*') || line.startsWith('-') || line.startsWith('#')) return false;
    if (/^(Role|Task|Constraint|Option|Draft|Persona|Tone|Self-Correction|Check|Final|RULES|Search|User Question):/i.test(line)) return false;
    if (line.includes('? Yes') || line.includes('? No')) return false;
    
    return true;
  });

  if (candidateLines.length > 0) {
    let result = candidateLines.join(' ').replace(/^["']|["']$/g, '').trim();
    if (result.length > 3 && result.toLowerCase() !== cleanUserQuery) {
      return result;
    }
  }

  return text.replace(/^["']|["']$/g, '').trim();
}

export async function POST(req: Request) {
  try {
    const { characterId, messages } = (await req.json()) as {
      characterId: CharacterId;
      messages: Array<{ role: 'user' | 'model'; content: string }>;
    };

    const character = MARVEL_CHARACTERS[characterId];
    if (!character) {
      return NextResponse.json(
        { error: 'Invalid Marvel hero specified.' },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content || 'Hello!';
    const apiKey = process.env.GEMINI_API_KEY;

    let formattedHistory = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    const systemInstructionText = `You are roleplaying strictly as Marvel superhero ${character.name}. ${character.systemPrompt}.

RESPONSE GUIDELINES:
- Provide a complete, engaging, in-character response in 2 to 3 clear, complete sentences (around 35 to 60 words).
- Be concise and to the point while giving a sufficient, satisfying answer. Do not cut off mid-thought or give 1-word answers.
- Output ONLY your spoken hero dialogue. Do NOT include bullet points (*), reasoning steps, or prompt echoes.`;

    if (apiKey && apiKey.trim().length > 5 && !apiKey.includes('your_gemini_api_key')) {
      const cleanKey = apiKey.trim();
      const modelCandidates = [
        'gemini-3.5-flash',
        'gemini-3.6-flash',
        'gemini-3.5-flash-lite',
        'gemma-4-26b-a4b-it',
        'gemma-4-31b-it',
        'gemma-2-27b-it',
        'gemma-2-9b-it',
      ];

      for (const modelName of modelCandidates) {
        try {
          const genAI = new GoogleGenerativeAI(cleanKey);
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstructionText,
          });

          const result = await model.generateContent({
            contents: [
              ...formattedHistory,
              {
                role: 'user',
                parts: [{ text: lastUserMessage }],
              },
            ],
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens: 250, // Ample tokens for complete 2-3 sentence responses
            },
          });

          const rawText = result.response.text();
          const cleanReply = extractFinalDialogue(rawText, lastUserMessage);

          if (cleanReply && cleanReply.length > 5) {
            return NextResponse.json({ reply: cleanReply });
          }
        } catch (geminiError: unknown) {
          console.warn(`Model [${modelName}] warning:`, geminiError);
        }
      }
    }

    // Dynamic lore-accurate fallback if API is unavailable
    const fallbackReply = generateCharacterFallbackResponse(characterId, lastUserMessage);
    return NextResponse.json({ reply: fallbackReply });

  } catch (error: unknown) {
    console.error('Error in /api/chat route:', error);
    return NextResponse.json({
      reply: "S.H.I.E.L.D. Neural Link active! I am online and ready to assist you on your mission."
    });
  }
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query, language = 'English', subject = 'Computer Science', educationLevel = 'Undergraduate' } =
      await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ ok: false, error: 'Query is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ok: false,
        configured: false,
        error:
          'GEMINI_API_KEY is not configured on the server. Please add GEMINI_API_KEY to your .env.local file to enable live Gemini AI educational generations.',
      });
    }

    // Call real Gemini API
    const systemPrompt = `You are the lead AI Tutor at Kudla Labs, an intelligent education platform.
Your objective is to provide a rigorous, comprehensive, and engaging educational explanation.
Target Student Education Level: ${educationLevel}
Subject Domain: ${subject}
Selected Language: ${language}

CRITICAL LANGUAGE INSTRUCTION:
You MUST respond entirely and naturally in the student's selected language: ${language}.
If the selected language is Kannada, write in fluent, authentic Kannada Unicode script (ಕನ್ನಡ).
If the selected language is Hindi, write in Hindi (हिन्दी).
If the selected language is Telugu, write in Telugu (తెలుగు).
If the selected language is Tamil, write in Tamil (தமிழ்).
Do not output English text labeled as another language.

RESPONSE STRUCTURE (Ensure every answer contains these structured sections with markdown headings):
### 1. Introduction & Formal Definition
(Clear, accessible explanation of what the concept is and why it matters)

### 2. Detailed Conceptual Deep-Dive
(In-depth theoretical breakdown suited for ${educationLevel} students)

### 3. Step-by-Step Working & Mechanics
(Detailed algorithmic or operational sequence, numbered steps, and technical mechanics)

### 4. Real-World Analogy & Example
(A tangible, relatable analogy followed by a concrete real-world scenario)

### 5. Practical Engineering Applications
(Where and how this is applied in industry, software systems, or hardware)

### 6. Advantages & Trade-Offs
(Strengths, limitations, time/space complexity or performance bottlenecks)

### 7. Key Exam & Interview Takeaways
(Crucial points frequently tested in university exams or technical interviews)

### 8. Quick Summary
(A 2-3 sentence executive recap)

### 9. Practice Questions (PYQ Style)
(2-3 challenging questions to test understanding with brief hints)`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nStudent Question / Concept: "${query}"`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2500,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg =
        errorData?.error?.message || `Gemini API returned status code ${response.status}`;
      return NextResponse.json({
        ok: false,
        configured: true,
        error: `Gemini API Error: ${errorMsg}`,
      });
    }

    const data = await response.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated from model.';

    return NextResponse.json({
      ok: true,
      configured: true,
      text: candidateText,
      language,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

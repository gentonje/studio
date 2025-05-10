import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Always use environment variable for API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(req: NextRequest) {
  const questionId = req.nextUrl.searchParams.get('questionId');
  const questionText = req.nextUrl.searchParams.get('questionText');

  if (!questionId || !questionText) {
    return NextResponse.json(
      { supportiveText: 'Please provide relevant details to support your answer' },
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { supportiveText: 'Please provide relevant details to support your answer' },
      { status: 500 }
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Given the following assessment question: "${questionText}"

Please provide brief, actionable guidance to help answer this question. Focus on:
1. Key aspects to consider
2. Common pitfalls to avoid
3. Types of evidence or examples to include

Keep the response concise and practical, under 3 sentences if possible.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return NextResponse.json({ 
      supportiveText: text || 'Please provide relevant details to support your answer' 
    });
  } catch (e) {
    console.error('Gemini API error:', e);
    return NextResponse.json({ 
      supportiveText: 'Please provide relevant details to support your answer',
      error: 'Failed to generate supportive text'
    }, { status: 200 });
  }
}
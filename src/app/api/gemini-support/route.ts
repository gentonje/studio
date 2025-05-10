// import { NextRequest, Next    // Removed prompt generation logic as Gemini support is no longer usedesponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Always use environment variable for API key
// // Removed Gemini AI initialization logic

// export async function GET(req: NextRequest) {
//   const questionId = req.nextUrl.searchParams.get('questionId');
//   const questionText = req.nextUrl.searchParams.get('questionText');

//   if (!questionId || !questionText) {
//     return NextResponse.json(
//       { supportiveText: 'Please provide relevant details to support your answer' },
//       { status: 400 }
//     );
//   }

//   // Removed Gemini API key validation logic
//     return NextResponse.json(
//       { supportiveText: 'Please provide relevant details to support your answer' },
//       { status: 500 }
//     );
//   }

//   try {
//     // Removed Gemini model initialization logic
//     const prompt = `Given the following assessment question: "${questionText}"

// Please provide brief, actionable guidance to help answer this question. Focus on:
// 1. Key aspects to consider
// 2. Common pitfalls to avoid
// 3. Types of evidence or examples to include

// Keep the response concise and practical, under 3 sentences if possible.`;
    
//     // Removed content generation logic as Gemini support is no longer used
//     const text = result.response.text();
    
//     return NextResponse.json({ 
//       supportiveText: text || 'Please provide relevant details to support your answer' 
//     });
//   } catch (e) {
//     // Removed Gemini API error handling
//     return NextResponse.json({ 
//       supportiveText: 'Please provide relevant details to support your answer',
//       error: 'Failed to generate supportive text'
//     }, { status: 200 });
//   }
// }
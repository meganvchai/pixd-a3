import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid items data:', items);
      return NextResponse.json({ groupName: 'Group' }, { status: 400 });
    }

    // Create a prompt based on the items
    const prompt = `Generate a creative, thematic name (max 4 words) for a group of items with these attributes:
${items.map((item: any) => 
  `- ${item.type || 'Unknown'} from ${item.city || 'Unknown'} (${item.year || 'Unknown'}): "${item.name || 'Unknown'}"`
).join('\n')}

The name should be creative and thematic, capturing the shared characteristics of these items.
Only return the name itself, no explanations or quotes.`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const groupName = response.text().trim();
      
      if (!groupName) {
        throw new Error('Empty response from Gemini API');
      }

      return NextResponse.json({ groupName });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      return NextResponse.json({ groupName: 'Group' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in generate-group-name route:', error);
    return NextResponse.json({ groupName: 'Group' }, { status: 500 });
  }
} 
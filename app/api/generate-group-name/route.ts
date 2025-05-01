import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
    }

    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid items data:', items);
      return NextResponse.json({ groupName: 'Group' }, { status: 200 });
    }

    // Validate items data
    const validItems = items.filter(item => 
      item && typeof item === 'object' && 
      (item.city || item.year || item.type || item.name)
    );

    if (validItems.length === 0) {
      console.error('No valid items found in data:', items);
      return NextResponse.json({ groupName: 'Group' }, { status: 200 });
    }

    // Create a prompt based on the items
    const prompt = `Generate a creative, thematic name (max 4 words) for a group of items with these attributes:
${validItems.map((item: any) => 
  `- ${item.type || 'Unknown'} from ${item.city || 'Unknown'} (${item.year || 'Unknown'}): "${item.name || 'Unknown'}"`
).join('\n')}

The name should be creative and thematic, capturing the shared characteristics of these items.
Only return the name itself, no explanations or quotes.`;

    console.log('Sending prompt to Gemini:', prompt);

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      if (!text) {
        console.error('Empty response from Gemini API');
        return NextResponse.json({ groupName: 'Group' }, { status: 200 });
      }

      // Log the successful response
      console.log('Gemini API response:', { prompt, groupName: text });

      return NextResponse.json({ groupName: text }, { status: 200 });
    } catch (geminiError: any) {
      // Log detailed error information
      console.error('Gemini API error:', {
        error: geminiError,
        message: geminiError.message,
        stack: geminiError.stack,
        prompt
      });
      
      // Return a default group name instead of an error
      return NextResponse.json({ groupName: 'Group' }, { status: 200 });
    }
  } catch (error: any) {
    // Log detailed error information
    console.error('Error in generate-group-name route:', {
      error,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({ groupName: 'Group' }, { status: 200 });
  }
} 
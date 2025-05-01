import type { NextApiRequest, NextApiResponse } from 'next';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

type GroupItem = { city: string; year: string; type: string; name: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { items } = req.body as { items: GroupItem[] };

  const prompt = `
Here are some objects grouped together:
${items.map((item: GroupItem) => `- ${item.city}, ${item.year}, ${item.type}, "${item.name}"`).join('\n')}
Please suggest a creative, thematic group name (max 4 words) that captures the spirit of this collection.
`;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });

  const data = await response.json();
  const groupName = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Group';

  res.status(200).json({ groupName });
} 
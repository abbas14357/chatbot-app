// app/api/chat/route.js
import OpenAI from 'openai';
import { NextResponse } from 'next/server';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { message } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful ERP assistant.' },
        { role: 'user', content: message },
      ],
    });


    return NextResponse.json({ reply: response.choices[0].message.content });

  } catch (error) {
    console.error('OpenAI API error:', error);
  let msg = 'Something went wrong';

  if (error.status === 429) {
    msg = 'You’ve hit the usage limit. Please check your OpenAI plan and quota.';
  }
  
  return NextResponse.json({ reply: msg }, { status: 500 });
  }
}

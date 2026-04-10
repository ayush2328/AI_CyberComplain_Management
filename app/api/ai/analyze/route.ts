import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { description, crimeType, financialLoss, city } = await req.json();

    if (!description) {
      return NextResponse.json({ error: 'Description required' }, { status: 400 });
    }

    const prompt = `You are an AI assistant for an Indian Cyber Crime Management System. Analyze the following cyber crime incident and provide a structured assessment.

Incident Description: ${description}
Crime Type Selected: ${crimeType || 'Not specified'}
Financial Loss: ₹${financialLoss || 0}
Location: ${city || 'Not specified'}

Respond ONLY with valid JSON (no markdown, no extra text) in this exact format:
{
  "classification": "Short crime category name (e.g. Phishing, Banking Fraud, Ransomware)",
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "confidence": 0.87,
  "analysis": "2-3 sentence analysis of the incident pattern and nature",
  "actions": [
    "Immediate action 1",
    "Immediate action 2",
    "Immediate action 3",
    "Immediate action 4",
    "Immediate action 5"
  ],
  "similarCases": 143
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI analyze error:', error);
    // Fallback response if API fails
    return NextResponse.json({
      classification: crimeType?.replace(/_/g, ' ') || 'Cyber Crime',
      riskLevel: 'HIGH',
      confidence: 0.75,
      analysis: 'Incident has been logged. Manual review required for detailed classification.',
      actions: [
        'Preserve all digital evidence (emails, screenshots, transaction IDs)',
        'Immediately contact your bank to freeze/reverse transactions',
        'Change all passwords on affected accounts',
        'Report to cybercrime.gov.in and local cyber cell',
        'File complaint at nearest police station with digital evidence',
      ],
      similarCases: 0,
    });
  }
}

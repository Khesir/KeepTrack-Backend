import { Injectable, BadRequestException } from '@nestjs/common';
import Groq from 'groq-sdk';
import { ParsedTransactionItemDto } from './dto/parse-receipt.dto';

const RECEIPT_PROMPT = (today: string) => `You are a financial data extraction assistant. The user photographed a handwritten list of daily expenses or income.

Extract every transaction line you can read. Return ONLY a JSON array — no explanation, no markdown fences.

Each item must have exactly these fields:
- "amount": number (always positive, e.g. 250.00)
- "type": "expense" or "income"
- "description": string — concise label of what was purchased/earned (max 60 chars)
- "date": ISO date string e.g. "${today}". Use today's date if none is written.
- "categoryName": string — infer a short category (e.g. "Food", "Transport", "Salary", "Grocery", "Utilities", "Entertainment")

Rules:
- Always positive amounts. Strip currency symbols (₱, $, ₩, etc.).
- Default type to "expense" when ambiguous.
- Skip lines you cannot read clearly.
- If no financial data is visible, return an empty array: []

Output example:
[{"amount":150.00,"type":"expense","description":"Lunch","date":"${today}","categoryName":"Food"},{"amount":5000.00,"type":"income","description":"Freelance payment","date":"${today}","categoryName":"Salary"}]`;

@Injectable()
export class ReceiptParserService {
  private readonly groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async parseReceipt(
    imageBase64: string,
    mimeType: string,
  ): Promise<ParsedTransactionItemDto[]> {
    const today = new Date().toISOString().slice(0, 10);

    const completion = await this.groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
            {
              type: 'text',
              text: RECEIPT_PROMPT(today),
            },
          ],
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    return this._parseJson(raw, today);
  }

  private _parseJson(raw: string, today: string): ParsedTransactionItemDto[] {
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new BadRequestException('AI returned unparseable response. Please try a clearer image.');
    }

    if (!Array.isArray(parsed)) {
      throw new BadRequestException('Unexpected AI response format.');
    }

    return parsed.map((item: any): ParsedTransactionItemDto => ({
      amount: Math.abs(Number(item.amount ?? 0)),
      type: item.type === 'income' ? 'income' : 'expense',
      description: String(item.description ?? '').trim().slice(0, 60),
      date: this._normalizeDate(item.date, today),
      categoryName: String(item.categoryName ?? 'Other').trim(),
    }));
  }

  private _normalizeDate(raw: string, today: string): string {
    if (!raw) return today;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? today : d.toISOString().slice(0, 10);
  }
}

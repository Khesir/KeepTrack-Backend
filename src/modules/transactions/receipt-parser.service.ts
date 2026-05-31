import { Injectable, BadRequestException } from '@nestjs/common';
import Groq from 'groq-sdk';
import { ParsedTransactionItemDto } from './dto/parse-receipt.dto';

const SHARED_FIELDS = (today: string) => `Each item must have exactly these fields:
- "amount": number (always positive, e.g. 250.00)
- "type": "expense" or "income"
- "description": string — concise label of what was purchased/earned/paid (max 60 chars)
- "date": ISO date string e.g. "${today}". Use today's date if not specified.
- "categoryName": string — infer a short category (e.g. "Food", "Transport", "Salary", "Utilities", "Subscriptions", "Debt Payment", "Savings", "Entertainment")
- "entityType": one of "subscription" | "debt_payment" | "lending" | "goal" | null
  - "subscription": recurring service payment (wifi, Netflix, Spotify, electricity, water, phone bill, etc.)
  - "debt_payment": paying back money owed to someone ("paid X", "bayad kay X", "utang kay X")
  - "lending": lending money to someone ("borrowed to X", "pinahiram si X", "loan to X", "lent to X")
  - "goal": savings contribution toward a goal ("saved for X", "contributed to X", "deposited for X fund")
  - null: regular transaction that doesn't fit the above
- "entityHint": string | null — the name/identifier to help match the entity (service name for subscription, person name for debt/lending, goal name for goal). null if not identifiable.
- "walletHint": string | null — the wallet/account name mentioned (e.g. "GCash", "BDO", "BPI", "Cash", "Visa"). null if none mentioned.

Rules:
- Always positive amounts. Strip currency symbols (₱, $, ₩, etc.).
- Default type to "expense" when ambiguous. Lending is expense (money going out). Debt collection is income.
- If no financial data is found, return an empty array: []

Output example:
[{"amount":150.00,"type":"expense","description":"Lunch","date":"${today}","categoryName":"Food","entityType":null,"entityHint":null,"walletHint":"GCash"},{"amount":2699.00,"type":"expense","description":"PLDT Wifi Bill","date":"${today}","categoryName":"Subscriptions","entityType":"subscription","entityHint":"PLDT","walletHint":null}]`;

const RECEIPT_PROMPT = (today: string) => `You are a financial data extraction assistant. The user photographed a handwritten list of daily expenses, income, or financial notes.

Extract every transaction line you can read. Return ONLY a JSON array — no explanation, no markdown fences.

${SHARED_FIELDS(today)}

Skip lines you cannot read clearly.`;

const TEXT_PROMPT = (today: string) => `You are a financial data extraction assistant. The user typed a natural-language description of their expenses or income.

Extract every transaction mentioned. Return ONLY a JSON array — no explanation, no markdown fences.

${SHARED_FIELDS(today)}

Parse as many transactions as the user describes. Handle informal language, Filipino-English mixing, abbreviations, and relative dates (e.g. "yesterday", "kanina").`;

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

  async parseText(text: string): Promise<ParsedTransactionItemDto[]> {
    const today = new Date().toISOString().slice(0, 10);

    const completion = await this.groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `${TEXT_PROMPT(today)}\n\nUser input:\n${text}`,
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

    const validEntityTypes = ['subscription', 'debt_payment', 'lending', 'goal'];
    return parsed.map((item: any): ParsedTransactionItemDto => ({
      amount: Math.abs(Number(item.amount ?? 0)),
      type: item.type === 'income' ? 'income' : 'expense',
      description: String(item.description ?? '').trim().slice(0, 60),
      date: this._normalizeDate(item.date, today),
      categoryName: String(item.categoryName ?? 'Other').trim(),
      entityType: validEntityTypes.includes(item.entityType) ? item.entityType : null,
      entityHint: item.entityHint ? String(item.entityHint).trim().slice(0, 60) : null,
      walletHint: item.walletHint ? String(item.walletHint).trim().slice(0, 60) : null,
    }));
  }

  private _normalizeDate(raw: string, today: string): string {
    if (!raw) return today;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? today : d.toISOString().slice(0, 10);
  }
}

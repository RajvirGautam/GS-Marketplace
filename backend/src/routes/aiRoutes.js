import express from 'express';
import multer from 'multer';
import OpenAI from 'openai';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ── OpenRouter client (lazy-init) ────────────────────────────────────────────
let openai = null;
const getOpenRouter = () => {
    if (!openai) {
        const key = process.env.OPENROUTER_API_KEY;
        if (!key || key === 'YOUR_OPENROUTER_API_KEY_HERE') {
            throw new Error('OPENROUTER_API_KEY is not configured in .env');
        }
        openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: key,
            defaultHeaders: {
                "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
                "X-Title": "GS-MARK-II Campus Marketplace",
            }
        });
    }
    return openai;
};

const VALID_CATEGORIES = ['books', 'electronics', 'stationery', 'lab', 'tools', 'hostel', 'misc'];
const VALID_CONDITIONS = ['New', 'Like New', 'Good', 'Acceptable'];

router.post('/generate-listing', authenticate, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        const client = getOpenRouter();
        const imageBase64 = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

        const prompt = `You are a smart marketplace listing assistant for a college campus.
Analyze this product image carefully and return ONLY valid JSON — no markdown, no code blocks, no extra text.
Return exactly this JSON shape:
{
  "title": "short catchy product title, max 60 chars",
  "description": "2-3 sentence selling description for a college student buyer. Mention what it is, its approximate condition, and who it's ideal for.",
  "category": "one of: books | electronics | stationery | lab | tools | hostel | misc",
  "condition": "one of: New | Like New | Good | Acceptable",
  "highlights": ["feature or selling point 1", "feature or selling point 2", "feature or selling point 3"],
  "specs": [
    { "label": "spec name", "value": "spec value" },
    { "label": "spec name", "value": "spec value" }
  ]
}

Rules:
- highlights: 2-4 items, each max 60 chars
- specs: 2-4 items for technical/physical attributes like Brand, Model, Colour, Size etc.
- Pick the most reasonable defaults if you cannot determine a value
- RETURN ONLY THE JSON OBJECT`;

        const completion = await client.chat.completions.create({
            model: "meta-llama/llama-3.2-11b-vision-instruct",
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: dataUrl } },
                    ],
                },
            ],
        });

        const rawText = completion.choices?.[0]?.message?.content || '';

        if (!rawText) {
            return res.status(422).json({ success: false, message: 'AI returned an empty response. Try again.' });
        }

        const jsonText = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

        let parsed;
        try {
            parsed = JSON.parse(jsonText);
        } catch {
            console.error('OpenRouter returned non-JSON:', rawText);
            return res.status(422).json({ success: false, message: 'AI returned an unreadable response. Try again.' });
        }

        const data = {
            title: (parsed.title || '').toString().slice(0, 100),
            description: (parsed.description || '').toString().slice(0, 1000),
            category: VALID_CATEGORIES.includes(parsed.category) ? parsed.category : 'misc',
            condition: VALID_CONDITIONS.includes(parsed.condition) ? parsed.condition : 'Good',
            highlights: Array.isArray(parsed.highlights)
                ? parsed.highlights.slice(0, 4).map(h => String(h).slice(0, 80))
                : [],
            specs: Array.isArray(parsed.specs)
                ? parsed.specs.slice(0, 6).map(s => ({
                    label: String(s.label || '').slice(0, 40),
                    value: String(s.value || '').slice(0, 80),
                }))
                : [],
        };
        return res.json({ success: true, data });

    } catch (error) {
        console.error('AI generate-listing error:', error?.message || error);

        if (error.message?.includes('OPENROUTER_API_KEY')) {
            return res.status(503).json({ success: false, message: 'AI not configured. Add OPENROUTER_API_KEY to .env' });
        }
        if (error.status === 429 || error.message?.includes('429')) {
            return res.status(429).json({ success: false, message: 'AI free tier rate limit hit. Try again in 1 minute.' });
        }

        return res.status(500).json({
            success: false,
            message: error?.message || 'AI service error. Please try again.',
        });
    }
});

export default router;

import { registerAs } from '@nestjs/config';

export default registerAs('gemini', () => ({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
  timeoutMs: parseInt(process.env.GEMINI_TIMEOUT_MS, 10) || 10000,
  confidenceThreshold:
    parseFloat(process.env.GEMINI_CONFIDENCE_THRESHOLD) || 0.6,
}));

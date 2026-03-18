import { registerAs } from "@nestjs/config";

/**
 * FIX: Model default diubah ke 'gemini-2.0-flash' yang valid dan tersedia.
 * 'gemini-3-flash-preview' sebelumnya tidak ada dan akan menyebabkan error 404
 * dari Google AI API saat digunakan di production.
 *
 * Urutan prioritas model yang bisa dikonfigurasi via env GEMINI_MODEL:
 *   - gemini-2.0-flash         → tercepat, direkomendasikan untuk chatbot
 *   - gemini-1.5-flash         → fallback jika 2.0 tidak tersedia di region tertentu
 *   - gemini-1.5-pro           → lebih akurat, lebih lambat
 */
export default registerAs("gemini", () => ({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  timeoutMs: parseInt(process.env.GEMINI_TIMEOUT_MS, 10) || 10_000,
  confidenceThreshold:
    parseFloat(process.env.GEMINI_CONFIDENCE_THRESHOLD) || 0.6,
}));

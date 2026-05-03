const https = require("https");

/**
 * translationService.js
 * Handles language detection and translation using Google Translate API.
 */

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

// 1. FIXED RATE LIMITER (Sliding Window)
let requestWindow = {
  count: 0,
  start: Date.now()
};

const checkRateLimit = () => {
  const now = Date.now();
  if (now - requestWindow.start > 60000) {
    requestWindow.start = now;
    requestWindow.count = 0;
  }
  if (requestWindow.count >= 50) return false;
  requestWindow.count++;
  return true;
};

// 3. CACHE (WITH LIMIT)
const cache = new Map();
const addToCache = (key, value) => {
  if (cache.size >= 100) {
    // Maps in JS maintain insertion order; the first key is the oldest.
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(key, value);
};

const normalizeLangCode = (code) => {
  if (code == null || String(code).trim() === "") return "";
  return String(code).trim().toLowerCase().split("-")[0];
};

/**
 * @param {string} text
 * @returns {number}
 */
const countWords = (text) => {
  const t = String(text ?? "").trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
};

/**
 * Detects language of provided text (v2 Detect API).
 */
const detectLanguage = async (text) => {
  if (!API_KEY || !text || String(text).trim() === "") return "en";

  // Rate Limiting
  if (!checkRateLimit()) return "en";

  return new Promise((resolve) => {
    const data = JSON.stringify({ q: text });
    const options = {
      hostname: "translation.googleapis.com",
      path: `/language/translate/v2/detect?key=${API_KEY}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => (responseBody += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseBody);
          if (
            parsed.data?.detections?.[0]?.[0]?.language
          ) {
            resolve(normalizeLangCode(parsed.data.detections[0][0].language) || "en");
          } else {
            resolve("en");
          }
        } catch (e) {
          console.error("Language detection parse error:", e);
          resolve("en");
        }
      });
    });

    req.setTimeout(5000, () => {
      req.destroy(new Error("Detection timeout"));
    });

    req.on("error", (err) => {
      console.error("Detection Request error:", err.message);
      resolve("en");
    });
    req.write(data);
    req.end();
  });
};

/**
 * Calls Translate v2.
 */
const translateWithApi = async (text, targetLang) => {
  const target = normalizeLangCode(targetLang) || "en";

  // 4. SKIP OPTIMIZATION
  if (target === "en" || !text || String(text).trim() === "") return text;
  if (!API_KEY) return text;

  // 3. CACHE CHECK
  const cacheKey = `${text}_${target}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  // 1. LIMITER CHECK
  if (!checkRateLimit()) {
    console.warn("Translation rate limit reached.");
    return text;
  }

  return new Promise((resolve) => {
    const data = JSON.stringify({ q: text, target });
    const options = {
      hostname: "translation.googleapis.com",
      path: `/language/translate/v2?key=${API_KEY}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => (responseBody += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseBody);
          if (
            parsed.data?.translations?.[0]?.translatedText != null
          ) {
            const translated = parsed.data.translations[0].translatedText ?? text;
            addToCache(cacheKey, translated); // Cache the result with limit check
            resolve(translated);
          } else {
            resolve(text);
          }
        } catch (e) {
          console.error("Translation parse error:", e);
          resolve(text);
        }
      });
    });

    req.setTimeout(5000, () => {
      req.destroy(new Error("Translation timeout"));
    });

    req.on("error", (err) => {
      console.error("Translation Request error:", err.message);
      resolve(text);
    });
    req.write(data);
    req.end();
  });
};

/**
 * Inbound: always translates via API to English when called.
 */
const translateToEnglish = async (text) => {
  const t = String(text ?? "").trim();
  if (!t) return "";
  return translateWithApi(t, "en");
};

/**
 * Outbound strings. Prefer originals on failure.
 */
const translateOutputField = async (text, targetLang) => {
  const original = String(text ?? "");
  const target = normalizeLangCode(targetLang);
  if (!target || target === "en" || !original.trim()) return original;
  try {
    const translated = await translateWithApi(original, target);
    return translated ?? original;
  } catch (e) {
    console.error("Translate output failure:", e);
    return original;
  }
};

/**
 * 2. FIXED PARALLEL FALLBACK
 */
const translateMultiple = async (fields, targetLang) => {
  const results = await Promise.allSettled(fields.map(f => translateOutputField(f, targetLang)));
  return results.map((res, index) => {
    if (res.status === "fulfilled") return res.value;
    return fields[index]; // Fallback to original text for individual failed fields
  });
};

const translateText = async (text, targetLang) =>
  translateOutputField(text, targetLang);

module.exports = {
  countWords,
  normalizeLangCode,
  detectLanguage,
  translateToEnglish,
  translateText,
  translateOutputField,
  translateMultiple
};

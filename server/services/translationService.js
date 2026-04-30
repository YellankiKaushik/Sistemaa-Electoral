const https = require('https');

/**
 * translationService.js
 * Handles language detection and translation using Google Translate API.
 */

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

/**
 * detectLanguage
 * Detects the language of the provided text.
 * @param {string} text - The user input text
 * @returns {Promise<string>} - Detected language code (e.g., 'en', 'es')
 */
const detectLanguage = async (text) => {
  if (!API_KEY || !text || text.trim() === '') return 'en';
  
  return new Promise((resolve) => {
    const data = JSON.stringify({ q: text });
    const options = {
      hostname: 'translation.googleapis.com',
      path: `/language/translate/v2/detect?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          if (parsed.data && parsed.data.detections && parsed.data.detections[0]) {
            resolve(parsed.data.detections[0][0].language || 'en');
          } else {
            resolve('en');
          }
        } catch (e) {
          console.error("Language detection error:", e);
          resolve('en');
        }
      });
    });

    req.on('error', (err) => {
      console.error("Detection Request error:", err);
      resolve('en');
    });
    req.write(data);
    req.end();
  });
};

/**
 * translateToEnglish
 * Translates text to English.
 * @param {string} text - Text to translate
 * @returns {Promise<string>} - Translated text
 */
const translateToEnglish = async (text) => {
  return translateText(text, 'en');
};

/**
 * translateText
 * General translation function.
 * @param {string} text - Text to translate
 * @param {string} targetLang - Language code to translate to
 * @returns {Promise<string>} - Translated text
 */
const translateText = async (text, targetLang) => {
  if (!API_KEY || !text || text.trim() === '') return text;

  return new Promise((resolve) => {
    const data = JSON.stringify({ q: text, target: targetLang });
    const options = {
      hostname: 'translation.googleapis.com',
      path: `/language/translate/v2?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          if (parsed.data && parsed.data.translations && parsed.data.translations[0]) {
            resolve(parsed.data.translations[0].translatedText || text);
          } else {
            resolve(text);
          }
        } catch (e) {
          console.error("Translation error:", e);
          resolve(text);
        }
      });
    });

    req.on('error', (err) => {
      console.error("Translation Request error:", err);
      resolve(text);
    });
    req.write(data);
    req.end();
  });
};

module.exports = {
  detectLanguage,
  translateToEnglish,
  translateText
};

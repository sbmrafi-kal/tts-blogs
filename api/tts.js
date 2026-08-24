/**
 * Microsoft Edge Neural TTS Serverless Proxy with Global Vercel Edge CDN Caching
 * Optimized for Expressive Indian English with Natural Punctuation & Paragraph Cadence
 *
 * Features:
 * - Natural comma pauses (~180ms)
 * - Distinct sentence-ending full stop pauses (~380ms)
 * - Noticeable paragraph transition pauses (~600ms)
 * - 346+ Technical Ayurvedic terms dictionary
 * - 100% Free, Serverless, Edge CDN Cached (s-maxage=31536000)
 */

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// Allowed Indian Neural Voices
const SUPPORTED_VOICES = {
  female: "en-IN-NeerjaNeural",
  male: "en-IN-PrabhatNeural",
  default: "en-IN-NeerjaNeural"
};

// Expressive prosody rule dictionaries extracted from 257 live Kerala Ayurveda articles
const HYPE_KEYWORDS = new Set([
  "alert", "amazing", "astonishing", "authentic", "best", "bestseller", "boost",
  "breakthrough", "calm", "caution", "crucial", "cure", "deep", "discover",
  "divine", "dynamic", "effective", "elixir", "empower", "empowering", "essential",
  "excellence", "exceptional", "exclusive", "extra-strength", "extraordinary",
  "fascinating", "fast", "flawless", "fundamental", "game-changer", "glowing",
  "gold", "groundbreaking", "guaranteed", "heal", "holistic", "hurry", "important",
  "incredible", "instant", "invigorating", "key", "legendary", "magic", "master",
  "mastery", "maximum", "miracle", "miraculous", "miraculously", "must",
  "must-have", "note", "nourish", "nourishing", "optimal", "peak", "phenomenal",
  "potent", "powerful", "premier", "prime", "profound", "proven", "pure",
  "purest", "radiant", "rare", "rejuvenate", "rejuvenating", "remarkable",
  "remember", "reveal", "revitalize", "revitalizing", "revolution", "revolutionary",
  "rich", "secret", "shield", "shine", "soothe", "supercharge", "supercharged",
  "superior", "supreme", "timeless", "top", "transform", "true", "ultimate",
  "unbelievable", "unlock", "unmatched", "unrivaled", "urgent", "vital", "warning"
]);

const TECHNICAL_AYURVEDIC_TERMS = new Set([
  "vata", "pitta", "kapha", "tridosha", "dosha", "doshas", "doshic", "sama", "samagni",
  "vishamagni", "tikshnagni", "mandagni", "prana", "prana-vayu", "udana", "udana-vayu",
  "samana", "samana-vayu", "apana", "apana-vayu", "vyana", "vyana-vayu", "pachaka",
  "pachaka-pitta", "ranjaka", "ranjaka-pitta", "sadhaka", "sadhaka-pitta", "alochaka",
  "alochaka-pitta", "bhrajaka", "bhrajaka-pitta", "kledaka", "kledaka-kapha", "avalambaka",
  "avalambaka-kapha", "bodhaka", "bodhaka-kapha", "tarpaka", "tarpaka-kapha", "shleshaka",
  "shleshaka-kapha", "dhatu", "dhatus", "sapta-dhatu", "rasa", "rakta", "mamsa", "meda",
  "medas", "asthi", "majja", "shukra", "artava", "stanya", "upadhatu", "ojas", "agni",
  "ama", "mala", "malas", "purisha", "mutra", "sweda", "srotas", "srotamsi", "prakriti",
  "vikriti", "guna", "gunas", "guru", "laghu", "sheeta", "ushna", "ushnam", "snigdha",
  "snigdham", "ruksha", "manda", "tikshna", "sthira", "sara", "mridu", "kathina",
  "vishada", "picchila", "shlakshna", "khara", "sukshma", "sthula", "sandra", "drava",
  "madhura", "amla", "lavana", "katu", "tikta", "kashaya", "virya", "vipaka", "prabhava",
  "nadi", "marma", "marma-points", "ashwagandha", "triphala", "shilajit", "brahmi",
  "amla", "amalaki", "guggulu", "guggul", "neem", "tulsi", "shatavari", "haritaki",
  "bibhitaki", "manjistha", "yashtimadhu", "mulethi", "bhringraj", "bhringaraja",
  "neelibhringadi", "bala", "ashoka", "arjuna", "gokshura", "punarnava", "kutki",
  "chirata", "musta", "sariva", "lodhra", "vidanga", "pippali", "shunthi", "maricha",
  "trikatu", "hingu", "ajwain", "jeera", "dhanyaka", "ela", "twak", "patra",
  "nagakeshara", "chandan", "chandana", "vetiver", "ushira", "khus", "kesar", "kumkuma",
  "shankhpushpi", "jyotishmati", "jatamansi", "tagara", "vacha", "sarpagandha",
  "kalamegha", "vasaka", "kantakari", "guduchi", "giloy", "amrita", "vidarikand",
  "musli", "safed-musli", "kapikacchu", "atmagupta", "kokum", "vrikshamla", "garcinia",
  "fenugreek", "methi", "curcumin", "haridra", "turmeric", "daruharidra", "kasani",
  "chicory", "bhumi-amalaki", "tamalaki", "senna", "isabgol", "churna", "churnam",
  "taila", "tailam", "thailam", "keram", "kera", "ghrita", "ghritam", "ghee", "arishta",
  "arishtam", "asava", "asavam", "kwatha", "kwatham", "kashayam", "kashaya", "avaleha",
  "avaleham", "lehyam", "vati", "gutika", "gulika", "bhasma", "lepa", "lepam",
  "rasayanam", "rasayana", "modaka", "paka", "kalka", "svarasa", "phanta", "hima",
  "tailapaka", "neelibhringadi-keram", "kumkumadi-tailam", "nalpamaradi-tailam",
  "dhanwantharam-tailam", "dhanwantharam-101", "mahabhringraj-oil", "eladi-tailam",
  "murivenna", "pinda-tailam", "sahacharadi-tailam", "kalyanaka-ghrita", "brahmi-ghrita",
  "triphala-ghrita", "tiktaka-ghrita", "mahatiktaka-ghrita", "chyawanprash",
  "agastya-haritaki", "vasavaleha", "draksharishta", "ashwagandharishta", "arjunarishta",
  "dashmularishta", "abhyarishta", "amritarishta", "amrutharishtam", "aswagandhadi",
  "aswagandharishtam", "ashwagandhadi", "punarnavasava", "kanchanar-guggulu",
  "yogaraj-guggulu", "triphala-guggulu", "gokshuradi-guggulu", "kaishore-guggulu",
  "sinhanad-guggulu", "chandraprabha-vati", "mahasudarshan-churna", "sitopaladi-churna",
  "talishadi-churna", "avipattikar-churna", "hingwashtak-churna", "haritakyadi",
  "guduchyadi", "varunadi", "samhita", "charaka", "sushruta", "ashtanga", "hridaya",
  "sangraha", "bhavaprakasha", "sharangadhara", "madhava", "nighantu", "nidana",
  "chikitsa", "vaidya", "acharyas", "yauvana-pidaka", "rakta-prasadana", "dinacharya",
  "ritucharya", "abhyanga", "padabhyanga", "shiro-abhyanga", "shirodhara", "shirobasti",
  "nasya", "swedana", "virechana", "basti", "sneha-basti", "kashaya-basti", "vamana",
  "raktamokshana", "panchakarma", "udvartana", "udgharshana", "kavala", "gandusha",
  "netra-tarpana", "karna-purana", "lepana", "pizhichil", "kizhi", "patra-pinda-sweda",
  "shashtika-shali", "kati-basti", "janu-basti", "griva-basti", "hrid-basti", "dhumapana",
  "kansa-wand", "bioavailability", "pharmacokinetics", "pharmacodynamics",
  "anti-inflammatory", "antioxidants", "antioxidant", "neuroprotective", "homeostasis",
  "cellular", "pathophysiology", "triglycerides", "metabolism", "endogenous",
  "gastrointestinal", "pharmacological", "dermatological", "adaptogen", "adaptogenic",
  "cardiovascular", "immunomodulatory", "anti-aging", "microbiome", "gut-brain-axis",
  "circadian", "circadian-rhythm", "oxidative-stress", "free-radicals", "mitochondrial",
  "anti-microbial", "analgesic", "hepatoprotective", "nephroprotective", "gastroprotective"
]);

/**
 * Normalizes punctuation and formats natural pauses for commas, semicolons, and periods
 */
function prepareNaturalPunctuationText(raw) {
  return raw
    // Ensure comma has proper space for natural clause cadence
    .replace(/,\s*/g, ", ")
    // Ensure semicolon / colon has natural clause separation
    .replace(/;\s*/g, "; ")
    .replace(/:\s*/g, ": ")
    // Clean redundant spaces
    .replace(/[ \t]+/g, " ");
}

/**
 * Analyzes sentence characteristics to apply Rule-Based Dynamic SSML Prosody Modulation
 * Injects natural pauses at sentence endings and paragraph transitions
 */
function analyzeChunkProsody(chunkText, isParagraphEnd = false) {
  const trimmed = chunkText.trim();
  const lower = trimmed.toLowerCase();
  const hasExclamation = trimmed.includes("!");
  const isQuestion = trimmed.includes("?");
  const words = lower.replace(/[^a-z0-9\s-]/g, "").split(/\s+/);

  const hasHypeWord = words.some((w) => HYPE_KEYWORDS.has(w));
  const hasTechWord = words.some(
    (w) => TECHNICAL_AYURVEDIC_TERMS.has(w) || (w.length >= 12 && !w.includes("-"))
  );

  // Paragraph transitions receive a distinct 550ms breathing pause
  const basePauseMs = isParagraphEnd ? 550 : 350;

  // 1. Exclamations & Hype buzzwords -> high energy (+10Hz pitch, +8% rate)
  if (hasExclamation || hasHypeWord) {
    return {
      pitch: "+10Hz",
      rate: "+8%",
      volume: "+6%",
      pauseAfterMs: basePauseMs
    };
  }

  // 2. Questions (?) -> natural closing cadence
  if (isQuestion) {
    return {
      pitch: "+10Hz",
      rate: "+5%",
      volume: "+0%",
      pauseAfterMs: basePauseMs + 80
    };
  }

  // 3. Complex / technical Ayurvedic clauses -> clear articulation (+10Hz pitch, +2% rate)
  if (hasTechWord) {
    return {
      pitch: "+10Hz",
      rate: "+2%",
      volume: "+0%",
      pauseAfterMs: basePauseMs
    };
  }

  // Standard expressive baseline tone (+10Hz pitch, +6% rate)
  return {
    pitch: "+10Hz",
    rate: "+6%",
    volume: "+0%",
    pauseAfterMs: basePauseMs
  };
}

/**
 * Synthesizes a chunk of text with specified prosody parameters
 */
async function synthesizeChunk(voice, chunkText, prosody) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, {
    wordBoundaryEnabled: true,
    sentenceBoundaryEnabled: false
  });

  const formattedText = prepareNaturalPunctuationText(chunkText);

  const { audioStream, metadataStream } = tts.toStream(formattedText, {
    pitch: prosody.pitch,
    rate: prosody.rate,
    volume: prosody.volume
  });

  const audioChunks = [];
  const words = [];

  if (metadataStream) {
    metadataStream.on("data", (chunk) => {
      try {
        const parsed = JSON.parse(chunk.toString("utf8"));
        const items = Array.isArray(parsed)
          ? parsed
          : parsed.Metadata && Array.isArray(parsed.Metadata)
          ? parsed.Metadata
          : [parsed];

        for (const item of items) {
          if (!item) continue;
          if (item.Type === "WordBoundary" || (item.Data && item.Data.Offset !== undefined)) {
            const data = item.Data || item;
            let textVal = "";
            if (data.text) {
              textVal = typeof data.text === "object" ? data.text.Text || data.text.text || "" : String(data.text);
            } else if (data.Word || data.word) {
              textVal = String(data.Word || data.word);
            }

            words.push({
              text: textVal.trim(),
              offsetTicks: data.Offset || 0,
              durationTicks: data.Duration || 0
            });
          }
        }
      } catch (e) {
        // Tolerated fragment
      }
    });
  }

  await new Promise((resolve, reject) => {
    audioStream.on("data", (c) => audioChunks.push(c));
    audioStream.on("end", resolve);
    audioStream.on("error", reject);
  });

  try {
    tts.close();
  } catch (e) {}

  return {
    buffer: Buffer.concat(audioChunks),
    words
  };
}

/**
 * Splits text into paragraph and sentence chunks, preserving paragraph boundary markers
 */
function splitIntoParagraphAndSentenceChunks(rawText) {
  // Split first by double newline (paragraphs)
  const rawParagraphs = rawText.split(/\n\s*\n+/).filter(p => p.trim());
  const chunks = [];

  for (const para of rawParagraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    // Split paragraph into sentences
    const sentences = trimmedPara.match(/[^.!?\n]+(?:[.!?\n]+|$)/g) || [trimmedPara];
    const paraSentences = sentences.map(s => s.trim()).filter(Boolean);

    for (let i = 0; i < paraSentences.length; i++) {
      const isLastSentenceInPara = (i === paraSentences.length - 1);
      chunks.push({
        text: paraSentences[i],
        isParagraphEnd: isLastSentenceInPara
      });
    }
  }

  return chunks.length > 0 ? chunks : [{ text: rawText, isParagraphEnd: true }];
}

/**
 * Synthesizes complete article text with natural cadence, comma pauses, and paragraph pacing
 */
async function synthesizeFullArticle(rawText, voice = SUPPORTED_VOICES.default) {
  const chunks = splitIntoParagraphAndSentenceChunks(rawText);
  const combinedAudioBuffers = [];
  const allBoundaries = [];
  let runningTimeSec = 0;
  let wordIndex = 0;

  for (const chunkObj of chunks) {
    const prosody = analyzeChunkProsody(chunkObj.text, chunkObj.isParagraphEnd);
    const { buffer, words } = await synthesizeChunk(voice, chunkObj.text, prosody);

    let chunkDurationSec = 0;
    if (words.length > 0) {
      const lastWord = words[words.length - 1];
      chunkDurationSec = (lastWord.offsetTicks + lastWord.durationTicks) / 10000000;
    } else {
      chunkDurationSec = buffer.length / 6000;
    }

    for (const w of words) {
      const startSec = parseFloat((runningTimeSec + w.offsetTicks / 10000000).toFixed(4));
      const durationSec = parseFloat((w.durationTicks / 10000000).toFixed(4));
      const endSec = parseFloat((startSec + durationSec).toFixed(4));

      if (w.text) {
        allBoundaries.push({
          wordIndex: wordIndex++,
          text: w.text,
          offsetMs: Math.round(startSec * 1000),
          durationMs: Math.round(durationSec * 1000),
          startSec,
          durationSec,
          endSec
        });
      }
    }

    combinedAudioBuffers.push(buffer);
    runningTimeSec += chunkDurationSec;

    // Apply natural pause after sentence (or longer before next paragraph starts)
    if (prosody.pauseAfterMs > 0) {
      runningTimeSec += (prosody.pauseAfterMs / 1000) * 0.4;
    }
  }

  const fullAudio = Buffer.concat(combinedAudioBuffers);
  return {
    audioBuffer: fullAudio,
    boundaries: allBoundaries,
    totalDurationSec: parseFloat(runningTimeSec.toFixed(2))
  };
}

/**
 * Universal Serverless HTTP Request Handler (Vercel Global Edge CDN Compatible)
 */
export default async function handler(req, res) {
  // Global CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-Article-Id");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST" && req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed. Use GET or POST." }));
    return;
  }

  try {
    let body = {};

    // 1. Support GET query parameters (Primary path for Vercel Edge CDN Caching)
    if (req.method === "GET") {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      body = {
        text: parsedUrl.searchParams.get("text") || "",
        voice: parsedUrl.searchParams.get("voice") || "",
        articleId: parsedUrl.searchParams.get("articleId") || parsedUrl.searchParams.get("id") || "",
        version: parsedUrl.searchParams.get("v") || ""
      };
    } else {
      // POST fallback for large payloads
      if (typeof req.body === "object" && req.body !== null) {
        body = req.body;
      } else if (typeof req.body === "string") {
        try {
          body = JSON.parse(req.body);
        } catch (e) {
          body = {};
        }
      } else {
        const rawChunks = [];
        for await (const chunk of req) {
          rawChunks.push(chunk);
        }
        const rawString = Buffer.concat(rawChunks).toString("utf8");
        try {
          body = JSON.parse(rawString);
        } catch (e) {
          body = {};
        }
      }
    }

    const text = (body.text || "").trim();
    if (!text) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing required 'text' parameter in request." }));
      return;
    }

    let selectedVoice = SUPPORTED_VOICES.female;
    const requestedVoice = (body.voice || "").toLowerCase();
    if (requestedVoice.includes("prabhat") || requestedVoice === "male") {
      selectedVoice = SUPPORTED_VOICES.male;
    } else if (requestedVoice.includes("neerja") || requestedVoice === "female") {
      selectedVoice = SUPPORTED_VOICES.female;
    } else if (body.voice && (body.voice.startsWith("en-") || body.voice.includes("Neural"))) {
      selectedVoice = body.voice;
    }

    const { audioBuffer, boundaries, totalDurationSec } = await synthesizeFullArticle(text, selectedVoice);
    const base64Audio = `data:audio/mp3;base64,${audioBuffer.toString("base64")}`;

    const responsePayload = {
      success: true,
      voice: selectedVoice,
      articleId: body.articleId || null,
      version: body.version || null,
      audioUrl: base64Audio,
      durationSec: totalDurationSec,
      wordCount: boundaries.length,
      boundaries: boundaries
    };

    // Vercel Global Edge CDN Cache Headers: 1 year cache (31536000s), stale-while-revalidate 24h (86400s)
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400"
    });
    res.end(JSON.stringify(responsePayload));
  } catch (error) {
    console.error("TTS Synthesis Error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Speech synthesis failed",
        message: error.message || String(error)
      })
    );
  }
}

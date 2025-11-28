// backend/routes/foodScanRoutes.js
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const router = express.Router();
console.log("Gemini API Key:", process.env.GEMINI_API_KEY);

// ---- Gemini Setup ----
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", // or the latest you’re using
});

// ---- Multer for in-memory image upload ----
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Utility to sanitize Gemini JSON (sometimes it wraps with ```json ... ```).
const cleanJsonString = (raw) => {
  let text = raw.trim();
  if (text.startsWith("```")) {
    // remove ```json ... ``` fences
    text = text.replace(/^```json/i, "").replace(/^```/, "");
    text = text.replace(/```$/, "");
  }
  return text.trim();
};

// Map Gemini response into the shape FoodScanResult expects
const mapToAnalysis = (geminiJson) => {
  const {
    food_detected,
    modern_nutrition = {},
    ayurvedic_nutrition = {},
  } = geminiJson;

  // modern_nutrition
  const {
    calories,
    protein,
    carbs,
    fats,
    vitamins = [],
    minerals = [],
  } = modern_nutrition;

  // convert "12g" -> 12
  const parseGram = (value) => {
    if (!value) return null;
    const num = parseFloat(String(value).replace(/[^\d.]/g, ""));
    return isNaN(num) ? null : num;
  };

  // ayurvedic_nutrition
  const {
    rasa,
    guna,
    virya,
    vipaka,
    doshaEffect = {},
  } = ayurvedic_nutrition;

  const rasaArray =
    typeof rasa === "string"
      ? rasa.split(",").map((t) => t.trim()).filter(Boolean)
      : Array.isArray(rasa)
      ? rasa
      : [];

  const gunaArray =
    typeof guna === "string"
      ? guna.split(",").map((t) => t.trim()).filter(Boolean)
      : Array.isArray(guna)
      ? guna
      : [];

  // Build six tastes section from rasa
  const tasteDescriptions = {
    Sweet:
      "Nourishing, grounding; generally pacifies Vata and Pitta, can aggravate Kapha in excess.",
    Sour:
      "Stimulating and warming; can increase Pitta and Kapha, pacifies Vata in moderation.",
    Salty:
      "Warming, heavy; increases Pitta and Kapha, pacifies Vata in small amounts.",
    Pungent:
      "Hot and drying; increases Pitta and Vata, reduces Kapha.",
    Bitter:
      "Cooling, light; reduces Pitta and Kapha, may aggravate Vata if overused.",
    Astringent:
      "Drying and cooling; pacifies Pitta and Kapha, can aggravate Vata.",
  };

  const sixTastes = rasaArray.map((t) => ({
    taste: t,
    description: tasteDescriptions[t] || "Common Ayurvedic taste profile.",
  }));

  const specialProperties = [];
  if (doshaEffect.vata) {
    specialProperties.push(`Vata: ${doshaEffect.vata}`);
  }
  if (doshaEffect.pitta) {
    specialProperties.push(`Pitta: ${doshaEffect.pitta}`);
  }
  if (doshaEffect.kapha) {
    specialProperties.push(`Kapha: ${doshaEffect.kapha}`);
  }

  const summary = `This dish (${food_detected || "Unknown dish"}) has approximately ${
    calories ?? "—"
  } kcal per 100g and shows Ayurvedic qualities of ${rasa || "unspecified rasa"}, with ${
    virya || "unspecified"
  } virya and ${vipaka || "unspecified"} vipaka.`;

  return {
    dishName: food_detected || "Unknown Dish",
    confidence: 1.0, // we don't get a score from the model; set a default
    nutrition: {
      calories: calories ?? null,
      protein_g: parseGram(protein),
      carbs_g: parseGram(carbs),
      fat_g: parseGram(fats),
      vitamins,
      minerals,
      serving_g: 100, // we asked "per 100g"; you can adjust if needed
    },
    ayurveda: {
      rasa: rasaArray,
      virya: virya || null,
      vipaka: vipaka || null,
      guna: gunaArray,
    },
    doshaImpact: {
      vata: doshaEffect.vata || "Neutral / no major effect",
      pitta: doshaEffect.pitta || "Neutral / no major effect",
      kapha: doshaEffect.kapha || "Neutral / no major effect",
    },
    sixTastes,
    specialProperties,
    summary,
  };
};

// ---- ROUTE: POST /api/food-scan/analyze ----
// expects: multipart/form-data with field "image"
router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    const mimeType = req.file.mimetype || "image/png";
    const base64 = req.file.buffer.toString("base64");
    const normalizedBase64 = base64; // already base64

    const contents = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: normalizedBase64,
              mimeType,
            },
          },
          {
            text: `You are a nutrition expert with deep knowledge of both modern and Ayurvedic nutrition.

1. Detect the food item(s) in the uploaded image.
2. Provide modern nutrition values per 100g (Calories as number, Protein, Carbs, Fats as strings with units, Vitamins as array, Minerals as array).
3. Provide Ayurvedic mapping:
   - Rasa (taste)
   - Guna (qualities: heavy/light, oily/dry, etc.)
   - Virya (heating/cooling)
   - Vipaka (post-digestive effect)
   - Effect on Doshas (Vata, Pitta, Kapha) - each should describe if it increases, decreases, or pacifies

Return ONLY a valid JSON object with this exact structure:
{
  "food_detected": "Apple",
  "modern_nutrition": {
    "calories": 52,
    "protein": "0.3g",
    "carbs": "14g",
    "fats": "0.2g",
    "vitamins": ["Vitamin C", "Vitamin K"],
    "minerals": ["Potassium", "Manganese"]
  },
  "ayurvedic_nutrition": {
    "rasa": "Sweet, Astringent",
    "guna": "Light, Dry",
    "virya": "Cooling",
    "vipaka": "Sweet",
    "doshaEffect": {
      "vata": "Pacifies",
      "pitta": "Pacifies",
      "kapha": "May aggravate in excess"
    }
  }
}

Do not include any text before or after the JSON. The response must be valid JSON only.`,
          },
        ],
      },
    ];

    const result = await model.generateContent({ contents });
    const rawText = result.response.text();
    const jsonText = cleanJsonString(rawText);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      console.error("Failed to parse model JSON:", jsonText);
      return res.status(500).json({
        error: "Model returned invalid JSON.",
        raw: jsonText,
      });
    }

    const analysis = mapToAnalysis(parsed);

    return res.json({
      analysis,
    });
  } catch (err) {
    console.error("Food scan error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;

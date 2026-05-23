import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize Gemini AI client to avoid crashing on start if API key isn't provided yet
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please populate it in Settings > Secrets to generate custom cyber tips.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse incoming JSON payloads
  app.use(express.json());

  // Check health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API endpoint to generate a custom 60-second cybersecurity storyboard
  app.post("/api/gemini/generate-script", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "A valid story prompt is required." });
        return;
      }

      console.log(`[Express] Request received to generate cybersecurity content for: "${prompt}"`);

      const ai = getGeminiClient();

      const systemInstruction = `You are a cybersecurity training director who drafts high-excitement, immersive 60-second training voiceover scripts and visual storyboards.
Given a cyber tip or story concept, you create exactly 5 to 7 contiguous chronological scenes spanning from 0 to 60 seconds.
Constraints:
- Scene 1 space start = 0 seconds.
- Second values must be consecutive integers (e.g. 0 to 6, 6 to 14, 14 to 26, etc. up to exactly 60 seconds).
- The narrative must be in the active, dramatic, informative corporate trainer voice.
- Choose from these visual category templates to represent the storyboard stage:
  * 'intro' (Title cards, ambient glowing matrix)
  * 'passwords' (Input validation forms, weak to strong upgrades)
  * 'updates' (Patch progress managers, compliance checks)
  * 'phishing' (Emails, phishing, trash bins, alert flags)
  * 'antivirus' (Defensive orbital fireflies, firewall shield deflections)
  * 'backup' (Synchronizing document pipelines, storage vaults)
  * 'outro' (High contrast lock screens, safe checkmarks)

Return the array of scenes in valid JSON format matching the schema perfectly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a 60-second cyber cinematic training script about: "${prompt}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "Contiguous storyboard scene slots spanning exactly 0 to 60 seconds.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER, description: "Sequential scene ID starting at 1." },
                title: { type: Type.STRING, description: "Short title of this storyboard node." },
                start: { type: Type.INTEGER, description: "Start playhead in seconds." },
                end: { type: Type.INTEGER, description: "End playhead in seconds." },
                visualDescription: { type: Type.STRING, description: "Cinematic directions on neon vectors/animated nodes." },
                voiceover: { type: Type.STRING, description: "Expert narrator speech vocal cues." },
                onScreenText: { type: Type.STRING, description: "Text overlays or labels to print over the video (brief)." },
                category: { 
                  type: Type.STRING, 
                  description: "Must be exactly one of: 'intro', 'passwords', 'updates', 'phishing', 'antivirus', 'backup', 'outro'." 
                }
              },
              required: ["id", "title", "start", "end", "visualDescription", "voiceover", "onScreenText", "category"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No script content produced from the generative model.");
      }

      const scenes = JSON.parse(text);
      res.json({ success: true, scenes });

    } catch (err: any) {
      console.error("[Express] Script generation error:", err);
      res.status(500).json({ 
        error: err.message || "Unknown error generating script.",
        fallback: true
      });
    }
  });

  // Handle Vite middleware for local development files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express] dev server running on port ${PORT}`);
  });
}

startServer();

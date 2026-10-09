import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI FinOps Advisor endpoint using gemini-3.1-pro-preview with ThinkingLevel.HIGH
app.post("/api/ai-advisor", async (req, res) => {
  try {
    const { prompt, contextData } = req.body;
    const systemInstruction = `You are CloudSentinel AI, an expert Cloud FinOps and DevOps Chief Architect. You analyze cloud cost data, anomalies, architecture bottlenecks, and budgets to provide extremely rigorous, structured, and actionable financial optimization strategies. Use Indian Rupees (₹ / INR) when mentioning currency estimates. Provide clear, prioritized, expert insights.`;
    
    const fullPrompt = `Context Cloud Data & Metrics:\n${JSON.stringify(contextData, null, 2)}\n\nUser Question / Request:\n${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: fullPrompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "No response generated." });
  } catch (error: any) {
    console.error("AI Advisor error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI advice." });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();

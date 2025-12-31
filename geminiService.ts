import { GoogleGenAI, Type } from "@google/genai";
import { StudentStats, InsightData } from "./types";

export const getStatsInsights = async (stats: StudentStats): Promise<InsightData | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these student statistics: Total: ${stats.total}, Boys: ${stats.boys}, Girls: ${stats.girls}. Provide a short educational insight and one recommendation based on these demographics.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A professional one-sentence summary."
            },
            recommendation: {
              type: Type.STRING,
              description: "A professional recommendation."
            }
          },
          required: ["summary", "recommendation"]
        }
      }
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) return null;

    return JSON.parse(jsonStr) as InsightData;
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return null;
  }
};
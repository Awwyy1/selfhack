
import { GoogleGenAI, Type } from "@google/genai";
import { Hack } from "../types";

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  private getApiKey(): string | null {
    // Priority 1: Check environment variable (for AI Studio/Vercel)
    if (process.env.API_KEY) return process.env.API_KEY;
    // Priority 2: Check localStorage (for manual user entry)
    return localStorage.getItem('SELFHACK_API_KEY');
  }

  private init() {
    const apiKey = this.getApiKey();
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  private get client() {
    if (!this.ai) {
      this.init();
    }
    if (!this.ai) {
      throw new Error("MISSING_API_KEY");
    }
    return this.ai;
  }

  async decomposeGoal(goal: string): Promise<Partial<Hack>> {
    const response = await this.client.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Decompose the following life goal into a strategic "hack" plan: "${goal}". Provide a title, description, and exactly 5 actionable tasks with difficulty and XP rewards (10-100).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  xp: { type: Type.NUMBER }
                },
                required: ['title', 'difficulty', 'xp']
              }
            }
          },
          required: ['title', 'description', 'tasks']
        }
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return {};
    }
  }

  async getMentorResponse(history: {role: 'user' | 'assistant', content: string}[], message: string) {
    const chat = this.client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are Neural-X, a high-performance Reality Hack Coach. 
        Your tone is cybernetic, sharp, minimalist, and extremely motivating. 
        You use hacker metaphors (system, bypass, optimization, overclock). 
        Keep responses concise but powerful.`,
      },
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  }
}

export const gemini = new GeminiService();

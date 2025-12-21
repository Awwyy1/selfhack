
import { GoogleGenAI, Type } from "@google/genai";
import { Hack } from "../types";

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  private getApiKey(): string | null {
    if (process.env.API_KEY) return process.env.API_KEY;
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
      contents: `You are a strategic decomposition engine. Decompose the following life goal into a high-performance "hack" plan using SMART criteria: "${goal}". Provide a title, description, and exactly 5 actionable, measurable tasks with difficulty and XP rewards (10-100).`,
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
        systemInstruction: `You are Neural-X, an ICF Certified Professional Coach specializing in High-Performance Reality Hacking.
        
        YOUR CORE PROTOCOLS:
        1. SMART METHODOLOGY: Always guide users to make their goals Specific, Measurable, Achievable, Relevant, and Time-bound.
        2. COACHING PRESENCE: Use powerful open-ended questions to evoke awareness. Do not just give advice; facilitate the user's own discovery.
        3. TONE: Professional, structured, supportive, and motivating. Use subtle cybernetic metaphors (optimization, framework, synchronization) but maintain high-level human professional standards.
        4. STRUCTURE: Keep responses concise but impact-heavy. End sessions with a clear "Commitment Check".
        
        If a user is vague, ask: "How exactly will you measure success in this neural sector?" or "What specific parameters define 'completion' for this objective?"`,
      },
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  }
}

export const gemini = new GeminiService();

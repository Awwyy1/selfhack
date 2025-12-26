import { GoogleGenAI, Type } from "@google/genai";
import { Hack } from "../types";
import { profileService } from "./profileService";
import { chatService } from "./chatService";

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  private getApiKey(): string | null {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    if (envKey) return envKey;
    // Fallback to hardcoded key for development
    return 'AIzaSyBZTq2bcnK9bvUQx0VxuPvtSbBcRs2yrO0';
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

  // Check if user can send message (with limits)
  async checkMessageLimit(userId: string): Promise<{ allowed: boolean; remaining: number; message?: string }> {
    const result = await profileService.useMessage(userId);

    if (!result.allowed) {
      const profile = result.profile;
      if (profile) {
        const plan = profileService.getEffectivePlan(profile);
        if (plan === 'free') {
          return {
            allowed: false,
            remaining: 0,
            message: 'You have reached your lifetime message limit. Upgrade to Premium or Pro for more messages.'
          };
        } else {
          return {
            allowed: false,
            remaining: 0,
            message: 'You have reached your monthly message limit. Your limit will reset next month.'
          };
        }
      }
    }

    return { allowed: result.allowed, remaining: result.remaining };
  }

  async decomposeGoal(goal: string): Promise<Partial<Hack>> {
    const response = await this.client.models.generateContent({
      model: "gemini-2.0-flash",
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

  async getMentorResponse(
    userId: string,
    history: {role: 'user' | 'assistant', content: string}[],
    message: string
  ): Promise<{ text: string | null; error?: string; remaining?: number }> {
    // Check message limit
    const limitCheck = await this.checkMessageLimit(userId);
    if (!limitCheck.allowed) {
      return { text: null, error: limitCheck.message, remaining: 0 };
    }

    try {
      const chat = this.client.chats.create({
        model: 'gemini-2.0-flash',
        config: {
          systemInstruction: `You are Neural-X, an ICF Certified Professional Coach specializing in High-Performance Reality Hacking.

          YOUR CORE PROTOCOLS:
          1. SMART METHODOLOGY: Always guide users to make their goals Specific, Measurable, Achievable, Relevant, and Time-bound.
          2. COACHING PRESENCE: Use powerful open-ended questions to evoke awareness. Do not just give advice; facilitate the user's own discovery.
          3. TONE: Professional, structured, supportive, and motivating. Use subtle cybernetic metaphors (optimization, framework, synchronization) but maintain high-level human professional standards.
          4. STRUCTURE: Keep responses concise but impact-heavy. End sessions with a clear "Commitment Check".

          If a user is vague, ask: "How exactly will you measure success in this neural sector?" or "What specific parameters define 'completion' for this objective?"

          LANGUAGE: Respond in the same language the user writes in. If user writes in Russian, respond in Russian. If in English, respond in English.`,
        },
      });

      // Save user message to database
      await chatService.saveMessage(userId, 'user', message);

      const result = await chat.sendMessage({ message });
      const responseText = result.text || '';

      // Save assistant response to database
      await chatService.saveMessage(userId, 'assistant', responseText);

      return { text: responseText, remaining: limitCheck.remaining };
    } catch (e) {
      console.error('Gemini API error:', e);
      return { text: null, error: 'Neural link unstable. Check your connection.' };
    }
  }

  // Get remaining messages for display
  async getRemainingMessages(userId: string): Promise<number> {
    return profileService.getRemainingMessages(userId);
  }
}

export const gemini = new GeminiService();

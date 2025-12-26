import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ypnuxjmcwmklfrxcnhya.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbnV4am1jd21rbGZyeGNuaHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODY2MjIsImV4cCI6MjA4MTk2MjYyMn0.K_u9YLhQHXmprRMRVakKymIHXW1Q6N5QPdupj3MQC9A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  level: number;
  xp: number;
  xp_to_next_level: number;
  streak: number;
  hacks_completed: number;
  rank: string;
  plan: 'free' | 'premium' | 'pro';
  plan_expires_at: string | null;
  messages_used: number;
  messages_reset_at: string;
  created_at: string;
  updated_at: string;
}

export interface DbGoal {
  id: string;
  user_id: string;
  title: string;
  deadline: string;
  completed: boolean;
  created_at: string;
}

export interface DbHack {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  progress: number;
  status: 'active' | 'completed' | 'failed';
  created_at: string;
}

export interface DbTask {
  id: string;
  hack_id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
  completed: boolean;
  created_at: string;
}

export interface DbChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface DbPromoCode {
  id: string;
  code: string;
  plan: 'premium' | 'pro';
  duration_days: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

// Plan limits
export const PLAN_LIMITS = {
  free: { messages: 50, isLifetime: true },
  premium: { messages: 400, isLifetime: false },
  pro: { messages: 1000, isLifetime: false }
} as const;

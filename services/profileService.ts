import { supabase, Profile, PLAN_LIMITS } from './supabase';

export const profileService = {
  // Get user profile
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  // Update profile
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    return data;
  },

  // Add XP and handle level up
  async addXP(userId: string, xpAmount: number): Promise<Profile | null> {
    const profile = await this.getProfile(userId);
    if (!profile) return null;

    let newXp = profile.xp + xpAmount;
    let newLevel = profile.level;
    let newXpToNext = profile.xp_to_next_level;

    // Check for level up
    while (newXp >= newXpToNext) {
      newXp -= newXpToNext;
      newLevel++;
      newXpToNext = Math.floor(newXpToNext * 1.2); // 20% more XP needed each level
    }

    // Determine new rank
    const newRank = this.getRankForLevel(newLevel);

    return this.updateProfile(userId, {
      xp: newXp,
      level: newLevel,
      xp_to_next_level: newXpToNext,
      rank: newRank
    });
  },

  // Get rank based on level
  getRankForLevel(level: number): string {
    if (level >= 50) return 'REALITY_MASTER';
    if (level >= 40) return 'NEURAL_ARCHITECT';
    if (level >= 30) return 'SYSTEM_HACKER';
    if (level >= 20) return 'NEURAL_OPTIMIZER';
    if (level >= 10) return 'MIND_ENGINEER';
    if (level >= 5) return 'PROTOCOL_RUNNER';
    return 'INITIATE';
  },

  // Increment hacks completed
  async incrementHacksCompleted(userId: string): Promise<Profile | null> {
    const profile = await this.getProfile(userId);
    if (!profile) return null;

    return this.updateProfile(userId, {
      hacks_completed: profile.hacks_completed + 1
    });
  },

  // Update streak
  async updateStreak(userId: string, increment: boolean): Promise<Profile | null> {
    const profile = await this.getProfile(userId);
    if (!profile) return null;

    return this.updateProfile(userId, {
      streak: increment ? profile.streak + 1 : 0
    });
  },

  // Check and increment message count
  async useMessage(userId: string): Promise<{ allowed: boolean; remaining: number; profile: Profile | null }> {
    const profile = await this.getProfile(userId);
    if (!profile) return { allowed: false, remaining: 0, profile: null };

    const limit = PLAN_LIMITS[profile.plan];
    const now = new Date();
    const resetDate = new Date(profile.messages_reset_at);

    // Check if we need to reset monthly messages (for premium/pro)
    if (!limit.isLifetime) {
      const monthDiff = (now.getFullYear() - resetDate.getFullYear()) * 12 + (now.getMonth() - resetDate.getMonth());
      if (monthDiff >= 1) {
        // Reset monthly count
        await this.updateProfile(userId, {
          messages_used: 0,
          messages_reset_at: now.toISOString()
        });
        profile.messages_used = 0;
      }
    }

    // Check if user has messages left
    if (profile.messages_used >= limit.messages) {
      return { allowed: false, remaining: 0, profile };
    }

    // Increment message count
    const updatedProfile = await this.updateProfile(userId, {
      messages_used: profile.messages_used + 1
    });

    const remaining = limit.messages - (profile.messages_used + 1);
    return { allowed: true, remaining, profile: updatedProfile };
  },

  // Get remaining messages
  async getRemainingMessages(userId: string): Promise<number> {
    const profile = await this.getProfile(userId);
    if (!profile) return 0;

    const limit = PLAN_LIMITS[profile.plan];
    return Math.max(0, limit.messages - profile.messages_used);
  },

  // Check if plan is active
  isPlanActive(profile: Profile): boolean {
    if (profile.plan === 'free') return true;
    if (!profile.plan_expires_at) return false;
    return new Date(profile.plan_expires_at) > new Date();
  },

  // Get effective plan (considering expiration)
  getEffectivePlan(profile: Profile): 'free' | 'premium' | 'pro' {
    if (this.isPlanActive(profile)) {
      return profile.plan;
    }
    return 'free';
  }
};

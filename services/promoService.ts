import { supabase, DbPromoCode, Profile } from './supabase';
import { profileService } from './profileService';

export interface RedeemResult {
  success: boolean;
  message: string;
  plan?: 'premium' | 'pro';
  expiresAt?: string;
}

export const promoService = {
  // Validate a promo code
  async validateCode(code: string): Promise<DbPromoCode | null> {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if code has uses left
    if (data.current_uses >= data.max_uses) {
      return null;
    }

    // Check if code has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    return data;
  },

  // Redeem a promo code
  async redeemCode(userId: string, code: string): Promise<RedeemResult> {
    // Validate code
    const promoCode = await this.validateCode(code);
    if (!promoCode) {
      return { success: false, message: 'Invalid or expired promo code' };
    }

    // Check if user already redeemed this code
    const { data: existingRedemption } = await supabase
      .from('promo_redemptions')
      .select('*')
      .eq('user_id', userId)
      .eq('promo_code_id', promoCode.id)
      .single();

    if (existingRedemption) {
      return { success: false, message: 'You have already used this promo code' };
    }

    // Calculate new expiration date
    const profile = await profileService.getProfile(userId);
    if (!profile) {
      return { success: false, message: 'Profile not found' };
    }

    // If user already has an active plan, extend it
    let newExpiration: Date;
    if (profile.plan !== 'free' && profile.plan_expires_at) {
      const currentExpiration = new Date(profile.plan_expires_at);
      if (currentExpiration > new Date()) {
        // Extend from current expiration
        newExpiration = new Date(currentExpiration);
      } else {
        // Start from now
        newExpiration = new Date();
      }
    } else {
      newExpiration = new Date();
    }
    newExpiration.setDate(newExpiration.getDate() + promoCode.duration_days);

    // Update profile with new plan
    const updatedProfile = await profileService.updateProfile(userId, {
      plan: promoCode.plan,
      plan_expires_at: newExpiration.toISOString(),
      messages_used: 0, // Reset message count
      messages_reset_at: new Date().toISOString()
    });

    if (!updatedProfile) {
      return { success: false, message: 'Failed to update profile' };
    }

    // Record redemption
    const { error: redemptionError } = await supabase
      .from('promo_redemptions')
      .insert({
        user_id: userId,
        promo_code_id: promoCode.id
      });

    if (redemptionError) {
      console.error('Error recording redemption:', redemptionError);
    }

    // Increment usage count
    const { error: updateError } = await supabase
      .from('promo_codes')
      .update({ current_uses: promoCode.current_uses + 1 })
      .eq('id', promoCode.id);

    if (updateError) {
      console.error('Error updating promo code usage:', updateError);
    }

    return {
      success: true,
      message: `Successfully activated ${promoCode.plan.toUpperCase()} for ${promoCode.duration_days} days!`,
      plan: promoCode.plan,
      expiresAt: newExpiration.toISOString()
    };
  },

  // Get user's redemption history
  async getRedemptionHistory(userId: string) {
    const { data, error } = await supabase
      .from('promo_redemptions')
      .select(`
        *,
        promo_codes (
          code,
          plan,
          duration_days
        )
      `)
      .eq('user_id', userId)
      .order('redeemed_at', { ascending: false });

    if (error) {
      console.error('Error fetching redemption history:', error);
      return [];
    }
    return data || [];
  },

  // Check if user can use a specific code
  async canUseCode(userId: string, code: string): Promise<{ canUse: boolean; reason?: string }> {
    const promoCode = await this.validateCode(code);
    if (!promoCode) {
      return { canUse: false, reason: 'Invalid or expired promo code' };
    }

    // Check if already redeemed
    const { data: existingRedemption } = await supabase
      .from('promo_redemptions')
      .select('*')
      .eq('user_id', userId)
      .eq('promo_code_id', promoCode.id)
      .single();

    if (existingRedemption) {
      return { canUse: false, reason: 'You have already used this promo code' };
    }

    return { canUse: true };
  }
};

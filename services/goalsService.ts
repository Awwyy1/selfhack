import { supabase, DbGoal } from './supabase';

export const goalsService = {
  // Get all goals for user
  async getGoals(userId: string): Promise<DbGoal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
    return data || [];
  },

  // Create a new goal
  async createGoal(userId: string, title: string, deadline: string): Promise<DbGoal | null> {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        title,
        deadline
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating goal:', error);
      return null;
    }
    return data;
  },

  // Toggle goal completion
  async toggleGoal(goalId: string, completed: boolean): Promise<DbGoal | null> {
    const { data, error } = await supabase
      .from('goals')
      .update({ completed })
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling goal:', error);
      return null;
    }
    return data;
  },

  // Delete a goal
  async deleteGoal(goalId: string): Promise<boolean> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
    return true;
  },

  // Update a goal
  async updateGoal(goalId: string, updates: Partial<DbGoal>): Promise<DbGoal | null> {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal:', error);
      return null;
    }
    return data;
  }
};

import { supabase, DbHack, DbTask } from './supabase';

export interface HackWithTasks extends DbHack {
  tasks: DbTask[];
}

export const hacksService = {
  // Get all hacks with tasks for user
  async getHacks(userId: string): Promise<HackWithTasks[]> {
    const { data: hacks, error: hacksError } = await supabase
      .from('hacks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (hacksError) {
      console.error('Error fetching hacks:', hacksError);
      return [];
    }

    if (!hacks || hacks.length === 0) return [];

    // Get tasks for all hacks
    const hackIds = hacks.map(h => h.id);
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .in('hack_id', hackIds)
      .order('created_at', { ascending: true });

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
    }

    // Combine hacks with their tasks
    return hacks.map(hack => ({
      ...hack,
      tasks: (tasks || []).filter(t => t.hack_id === hack.id)
    }));
  },

  // Create a new hack with tasks
  async createHack(
    userId: string,
    title: string,
    description: string,
    tasks: { title: string; difficulty: 'easy' | 'medium' | 'hard'; xp: number }[]
  ): Promise<HackWithTasks | null> {
    // Create hack
    const { data: hack, error: hackError } = await supabase
      .from('hacks')
      .insert({
        user_id: userId,
        title,
        description,
        progress: 0,
        status: 'active'
      })
      .select()
      .single();

    if (hackError || !hack) {
      console.error('Error creating hack:', hackError);
      return null;
    }

    // Create tasks
    if (tasks.length > 0) {
      const tasksToInsert = tasks.map(t => ({
        hack_id: hack.id,
        title: t.title,
        difficulty: t.difficulty,
        xp: t.xp,
        completed: false
      }));

      const { data: createdTasks, error: tasksError } = await supabase
        .from('tasks')
        .insert(tasksToInsert)
        .select();

      if (tasksError) {
        console.error('Error creating tasks:', tasksError);
      }

      return { ...hack, tasks: createdTasks || [] };
    }

    return { ...hack, tasks: [] };
  },

  // Toggle task completion
  async toggleTask(taskId: string, completed: boolean): Promise<DbTask | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling task:', error);
      return null;
    }
    return data;
  },

  // Update hack progress
  async updateHackProgress(hackId: string): Promise<DbHack | null> {
    // Get all tasks for this hack
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('hack_id', hackId);

    if (tasksError || !tasks) {
      console.error('Error fetching tasks for progress:', tasksError);
      return null;
    }

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
    const status = progress === 100 ? 'completed' : 'active';

    const { data, error } = await supabase
      .from('hacks')
      .update({ progress, status })
      .eq('id', hackId)
      .select()
      .single();

    if (error) {
      console.error('Error updating hack progress:', error);
      return null;
    }
    return data;
  },

  // Delete a hack (cascades to tasks)
  async deleteHack(hackId: string): Promise<boolean> {
    const { error } = await supabase
      .from('hacks')
      .delete()
      .eq('id', hackId);

    if (error) {
      console.error('Error deleting hack:', error);
      return false;
    }
    return true;
  },

  // Update hack status
  async updateHackStatus(hackId: string, status: 'active' | 'completed' | 'failed'): Promise<DbHack | null> {
    const { data, error } = await supabase
      .from('hacks')
      .update({ status })
      .eq('id', hackId)
      .select()
      .single();

    if (error) {
      console.error('Error updating hack status:', error);
      return null;
    }
    return data;
  }
};

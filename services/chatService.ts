import { supabase, DbChatMessage } from './supabase';

export const chatService = {
  // Get chat messages for user
  async getMessages(userId: string, limit: number = 50): Promise<DbChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data || [];
  },

  // Save a message
  async saveMessage(userId: string, role: 'user' | 'assistant', content: string): Promise<DbChatMessage | null> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        role,
        content
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      return null;
    }
    return data;
  },

  // Clear chat history
  async clearHistory(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing chat history:', error);
      return false;
    }
    return true;
  },

  // Get message count for user
  async getMessageCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error counting messages:', error);
      return 0;
    }
    return count || 0;
  }
};

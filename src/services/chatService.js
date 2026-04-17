import { supabase } from '../lib/supabase';

const CHAT_STORAGE_KEY = 'cms_chat_messages_v1';
const CHAT_ROOM_ID = 'main';

export const CHAT_ALLOWED_USERNAMES = ['admin', 'user1'];

const toMessageModel = (record) => ({
  id: record.id,
  roomId: record.room_id || CHAT_ROOM_ID,
  content: record.content,
  senderUsername: record.sender_username,
  senderName: record.sender_name,
  createdAt: record.created_at || new Date().toISOString()
});

class ChatService {
  constructor() {
    this.useDatabase = supabase !== null;
  }

  canAccessChat(user) {
    if (!user?.username) return false;
    return CHAT_ALLOWED_USERNAMES.includes(user.username.toLowerCase());
  }

  getAccessErrorMessage() {
    return `This chat is currently enabled only for: ${CHAT_ALLOWED_USERNAMES.join(', ')}`;
  }

  getLocalMessages() {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error reading local chat messages:', error);
      return [];
    }
  }

  saveLocalMessages(messages) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    window.dispatchEvent(new CustomEvent('cms-chat-updated'));
  }

  async getMessages(limit = 200) {
    if (this.useDatabase) {
      try {
        const { data, error } = await supabase
          .from('cms_messages')
          .select('*')
          .eq('room_id', CHAT_ROOM_ID)
          .order('created_at', { ascending: true })
          .limit(limit);

        if (error) throw error;
        return (data || []).map(toMessageModel);
      } catch (error) {
        console.error('Error reading messages from database, using local fallback:', error);
      }
    }

    return this.getLocalMessages();
  }

  async sendMessage(content, user) {
    const trimmed = (content || '').trim();
    if (!trimmed) {
      return { success: false, error: 'Message cannot be empty' };
    }

    if (!this.canAccessChat(user)) {
      return { success: false, error: this.getAccessErrorMessage() };
    }

    const messagePayload = {
      room_id: CHAT_ROOM_ID,
      content: trimmed,
      sender_username: user.username,
      sender_name: user.name || user.username,
      created_at: new Date().toISOString()
    };

    if (this.useDatabase) {
      try {
        const { data, error } = await supabase
          .from('cms_messages')
          .insert(messagePayload)
          .select()
          .single();

        if (error) throw error;
        return { success: true, data: toMessageModel(data) };
      } catch (error) {
        console.error('Error writing message to database, using local fallback:', error);
      }
    }

    const localMessage = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      roomId: CHAT_ROOM_ID,
      content: trimmed,
      senderUsername: user.username,
      senderName: user.name || user.username,
      createdAt: new Date().toISOString()
    };

    const existing = this.getLocalMessages();
    const updated = [...existing, localMessage].slice(-200);
    this.saveLocalMessages(updated);

    return { success: true, data: localMessage };
  }

  subscribeToMessages(onMessage) {
    let channel = null;

    const storageListener = (event) => {
      if (event.key === CHAT_STORAGE_KEY) {
        onMessage(this.getLocalMessages());
      }
    };

    const localEventListener = () => {
      onMessage(this.getLocalMessages());
    };

    window.addEventListener('storage', storageListener);
    window.addEventListener('cms-chat-updated', localEventListener);

    if (this.useDatabase) {
      channel = supabase
        .channel('cms-chat-room-main')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'cms_messages',
            filter: `room_id=eq.${CHAT_ROOM_ID}`
          },
          () => {
            this.getMessages().then(onMessage);
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('storage', storageListener);
      window.removeEventListener('cms-chat-updated', localEventListener);

      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }
}

export const chatService = new ChatService();
export default chatService;
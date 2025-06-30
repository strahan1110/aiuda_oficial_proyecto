// src/types/chat.ts
export interface Chat {
    id: string;
    user_id: string;
    title: string;
    last_message?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Message {
    id: string;
    chat_id: string;
    user_id: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: string;
    updated_at: string;
  }
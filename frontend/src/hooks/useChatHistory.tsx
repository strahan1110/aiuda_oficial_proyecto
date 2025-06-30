// src/hooks/useChatHistory.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Chat, Message } from '../types/chat';

// Asume que tienes un hook de auth, si no, cambia esto
interface User {
  id: string;
}

// Reemplaza esto con tu hook de auth real
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Obtener usuario actual de Supabase
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
    
    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user };
};

export default function useChatHistory() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar todos los chats del usuario
  const loadChats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo chat
  const createChat = async (title?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          title: title || `Chat ${new Date().toLocaleDateString()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      await loadChats(); // Recargar lista
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  // Cargar mensajes de un chat específico
  const loadMessages = async (chatId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCurrentMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar mensaje y actualizar chat
  const addMessage = async (chatId: string, content: string, role: 'user' | 'assistant') => {
    if (!user) return;

    try {
      // Insertar mensaje
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          user_id: user.id,
          content,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Actualizar último mensaje del chat
      const { error: chatError } = await supabase
        .from('chats')
        .update({
          last_message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId);

      if (chatError) throw chatError;

      // Actualizar estado local
      setCurrentMessages(prev => [...prev, messageData]);
      await loadChats(); // Recargar para actualizar last_message

    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  // Eliminar chat completo
  const deleteChat = async (chatId: string) => {
    if (!user) return;

    try {
      // Primero eliminar mensajes
      await supabase
        .from('messages')
        .delete()
        .eq('chat_id', chatId)
        .eq('user_id', user.id);

      // Luego eliminar chat
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await loadChats();
      setCurrentMessages([]);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  // Generar título automático basado en el primer mensaje
  const generateChatTitle = (firstMessage: string): string => {
    const words = firstMessage.trim().split(' ').slice(0, 6);
    return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
  };

  // Actualizar título de chat
  const updateChatTitle = async (chatId: string, newTitle: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chats')
        .update({ title: newTitle })
        .eq('id', chatId)
        .eq('user_id', user.id);

      if (error) throw error;
      await loadChats();
    } catch (error) {
      console.error('Error updating chat title:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  return {
    chats,
    currentMessages,
    loading,
    loadChats,
    createChat,
    loadMessages,
    addMessage,
    deleteChat,
    generateChatTitle,
    updateChatTitle
  };
}
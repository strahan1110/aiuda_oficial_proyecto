// src/components/ChatHistory.tsx
import React from 'react';
import useChatHistory from '../hooks/useChatHistory';
import { Trash2, MessageCircle, Plus } from 'lucide-react';

interface ChatHistoryProps {
  onSelectChat: (chatId: string) => void;
  currentChatId?: string;
}

export default function ChatHistory({ onSelectChat, currentChatId }: ChatHistoryProps) {
  const { 
    chats, 
    loading, 
    createChat, 
    deleteChat 
  } = useChatHistory();

  const handleNewChat = async () => {
    const newChat = await createChat();
    if (newChat) {
      onSelectChat(newChat.id);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de eliminar esta conversación?')) {
      await deleteChat(chatId);
    }
  };

  if (loading) {
    return (
      <div className="w-64 bg-gray-50 border-r h-full p-4">
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-50 border-r h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="mx-auto mb-2" size={32} />
            <p className="text-sm">No hay conversaciones</p>
            <p className="text-xs mt-1">Inicia un nuevo chat</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`p-3 rounded-lg cursor-pointer mb-2 group transition-colors border ${
                currentChatId === chat.id
                  ? 'bg-blue-100 border-blue-300 shadow-sm'
                  : 'bg-white hover:bg-gray-100 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate text-gray-900">
                    {chat.title}
                  </h3>
                  {chat.last_message && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {chat.last_message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(chat.updated_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded transition-all ml-2"
                  title="Eliminar conversación"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer opcional */}
      <div className="p-4 border-t bg-gray-100">
        <p className="text-xs text-gray-500 text-center">
          {chats.length} conversación{chats.length !== 1 ? 'es' : ''}
        </p>
      </div>
    </div>
  );
}
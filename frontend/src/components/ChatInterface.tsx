// src/components/ChatInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import useChatHistory from '../hooks/useChatHistory';
import ChatHistory from './ChatHistory';
import { Send, Bot, User, Stethoscope, MessageCircle } from 'lucide-react';

export default function ChatInterface() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    currentMessages,
    loadMessages,
    addMessage,
    createChat,
    generateChatTitle,
    updateChatTitle
  } = useChatHistory();

  // Auto scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Función para enviar mensaje al chatbot (Stack AI)
  const sendToStackAI = async (message: string, _history: any[]): Promise<string> => {
    try {
      console.log('Enviando mensaje a Stack AI:', message);
      
      // Preparar el mensaje en el formato que espera Stack AI
      const requestBody = {
        "in-1": message
      };

      const response = await fetch(import.meta.env.VITE_STACK_AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_STACK_AI_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Respuesta de Stack AI - Estado:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta de Stack AI:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Respuesta completa de Stack AI:', data);
      
      // Extraer la respuesta del formato de salida de Stack AI
      const responseText = data.outputs?.['out-0'] || 
                         data.outputs?.['out-1'] || 
                         'Lo siento, no pude procesar tu consulta.';
      
      return responseText || 'No se pudo obtener una respuesta válida.';
      
    } catch (error) {
      console.error('Error llamando a Stack AI:', error);
      return 'Lo siento, hubo un error al procesar tu consulta médica. Por favor intenta nuevamente más tarde.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentChatId || isLoading) return;

    setIsLoading(true);
    const userMessage = inputMessage.trim();
    setInputMessage('');

    try {
      // Guardar mensaje del usuario
      await addMessage(currentChatId, userMessage, 'user');

      // Si es el primer mensaje, actualizar título del chat
      if (currentMessages.length === 0) {
        const title = generateChatTitle(userMessage);
        await updateChatTitle(currentChatId, title);
      }

      // Enviar a Stack AI y obtener respuesta
      const botResponse = await sendToStackAI(userMessage, currentMessages);

      // Guardar respuesta del bot
      await addMessage(currentChatId, botResponse, 'assistant');

    } catch (error) {
      console.error('Error sending message:', error);
      // Mostrar mensaje de error al usuario
      await addMessage(currentChatId, 'Hubo un error al procesar tu mensaje. Por favor intenta nuevamente.', 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    await loadMessages(chatId);
  };

  const handleNewChat = async () => {
    const newChat = await createChat('Nueva consulta médica');
    if (newChat) {
      setCurrentChatId(newChat.id);
      await loadMessages(newChat.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatHistory 
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId || undefined}
      />
      
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="border-b bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Asistente Médico UTP
              </h1>
              <p className="text-sm text-gray-500">
                Tu consulta médica personalizada
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentChatId ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {currentMessages.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ¡Hola! Soy tu asistente médico
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Puedes hacerme preguntas sobre síntomas, medicamentos, o cualquier consulta médica. 
                    Estoy aquí para ayudarte.
                  </p>
                </div>
              )}

              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={`flex-1 max-w-3xl ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {new Date(message.created_at).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">Analizando tu consulta...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="p-6 bg-blue-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Selecciona o crea una conversación
                </h3>
                <p className="text-gray-600 mb-6">
                  Elige una conversación existente o inicia una nueva consulta médica
                </p>
                <button
                  onClick={handleNewChat}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Iniciar Nueva Consulta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        {currentChatId && (
          <div className="border-t bg-white px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe tus síntomas o haz tu consulta médica..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  title="Enviar mensaje"
                >
                  <Send size={20} />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Presiona Enter para enviar, Shift+Enter para nueva línea</span>
                <span className={inputMessage.length > 500 ? 'text-red-500' : ''}>
                  {inputMessage.length}/1000
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
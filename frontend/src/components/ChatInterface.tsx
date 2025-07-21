import React, { useState, useEffect, useRef } from 'react';
import useChatHistory from '../hooks/useChatHistory';
import ChatHistory from './ChatHistory';
import { Send, Bot, User, MessageCircle, Loader2, Menu, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ChatInterface() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
 
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
  const sendToStackAI = async (message: string): Promise<string> => {
    try {
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
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      return data.outputs?.['out-0'] || data.outputs?.['out-1'] || 'No pude procesar tu consulta.';
      
    } catch (error) {
      console.error('Error llamando a Stack AI:', error);
      return 'Lo siento, hubo un error al procesar tu consulta. Por favor intenta nuevamente más tarde.';
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
      const botResponse = await sendToStackAI(userMessage);

      // Guardar respuesta del bot
      await addMessage(currentChatId, botResponse, 'assistant');

    } catch (error) {
      console.error('Error sending message:', error);
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 shadow-lg backdrop-blur-sm bg-opacity-95">
        <button 
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isHistoryOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="container mx-auto max-w-4xl flex items-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-white/20 p-2 rounded-full mr-3 flex-shrink-0 transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Volver a la página principal"
          >
            <Bot className="h-6 w-6" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate flex items-center">
              AIUDA - Asistente de Salud
              <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">Beta</span>
              <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full cursor-pointer" onClick={() => window.location.href = '/'}>Salir</span>
            </h1>
            <p className="text-sm text-blue-100 truncate flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-300 mr-2 animate-pulse"></span>
              En línea - Estoy aquí para ayudarte
            </p>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Historial de Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatHistory 
              onSelectChat={handleSelectChat}
              currentChatId={currentChatId || undefined}
            />
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Nuevo chat
            </button>
          </div>
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isHistoryOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setIsHistoryOpen(false)}
          >
            <div 
              className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Historial</h2>
                <button 
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="h-[calc(100%-56px)] overflow-y-auto">
                <ChatHistory 
                  onSelectChat={(id) => {
                    handleSelectChat(id);
                    setIsHistoryOpen(false);
                  }} 
                  currentChatId={currentChatId || undefined}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white md:bg-transparent">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4 space-y-4 container mx-auto max-w-4xl w-full">
          {currentChatId ? (
            <>
              {currentMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ¡Hola! Soy tu asistente médico
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Puedes hacerme preguntas sobre síntomas, medicamentos o cualquier consulta médica.
                    Estoy aquí para ayudarte.
                  </p>
                </div>
              ) : (
                currentMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3/4 rounded-lg p-4 shadow ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.role === 'assistant' ? (
                          <Bot className="w-4 h-4 mr-2 text-blue-400" />
                        ) : (
                          <User className="w-4 h-4 mr-2 text-blue-100" />
                        )}
                        <span className={`text-xs font-medium ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.role === 'assistant' ? 'AIUDA' : 'Tú'}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {format(new Date(message.created_at), 'HH:mm', { locale: es })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Bot className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Pensando...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
              
              {/* Input Area */}
              <div className="border-t border-gray-200 p-3 bg-white fixed bottom-0 left-0 right-0 md:relative md:p-4 z-10">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }} 
                  className="flex gap-2 max-w-4xl mx-auto w-full"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu mensaje..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      style={{
                        minHeight: '3rem',
                        lineHeight: '1.5',
                        WebkitAppearance: 'none'
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      minWidth: '3rem'
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 p-8">
              <div className="bg-blue-100 p-6 rounded-full mb-6 shadow-inner">
                <MessageCircle className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                AIUDA - Asistente de Salud
              </h2>
              <p className="text-gray-600 text-center max-w-2xl mb-8 text-lg">
                Bienvenido al asistente de salud de AIUDA. Estoy aquí para ayudarte con información médica confiable y orientación profesional.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mb-8">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">¿Cómo funciona?</h3>
                  <p className="text-sm text-gray-600">
                    1. Describe tus síntomas o pregunta lo que necesites saber.
                    <br />
                    2. Recibe información médica confiable.
                    <br />
                    3. Obtén recomendaciones personalizadas.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">Recuerda</h3>
                  <p className="text-sm text-gray-600">
                    • Este es un asistente virtual y no reemplaza la consulta médica profesional.
                    <br />
                    • En caso de emergencia, busca atención médica inmediata.
                  </p>
                </div>
              </div>
              <button
                onClick={handleNewChat}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Comenzar nueva conversación
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

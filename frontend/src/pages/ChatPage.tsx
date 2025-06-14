import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{
      id: '1',
      content: '¡Hola! Soy tu asistente de salud. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date(),
    }]);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 shadow-lg backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto max-w-4xl flex items-center">
          <div className="bg-white/20 p-2 rounded-full mr-3 flex-shrink-0 transform transition-transform hover:scale-105">
            <Bot className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate flex items-center">
              AIUDA - Asistente de Salud
              <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">Beta</span>
            </h1>
            <p className="text-sm text-blue-100 truncate flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-300 mr-2 animate-pulse"></span>
              En línea - Estoy aquí para ayudarte
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div 
            className="p-4 space-y-4 container mx-auto max-w-4xl w-full scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent scrollbar-thumb-rounded-full"
            style={{
              scrollBehavior: 'smooth',
              scrollPadding: '1rem',
              paddingBottom: '1.5rem',
            }}
          >
            {/* Welcome Card - Only shown when there's only the welcome message */}
            {messages.length === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto mb-8 border border-gray-100">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Bot className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">¡Hola! Soy tu asistente de salud</h2>
                  <p className="text-gray-600 max-w-md">
                    Estoy aquí para ayudarte con información sobre salud y bienestar. 
                    ¿En qué puedo ayudarte hoy?
                  </p>
                  
                  <div className="w-full mt-6 space-y-3">
                    <p className="text-sm font-medium text-gray-500">Prueba preguntando:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        '¿Cuáles son los síntomas del resfriado común?',
                        '¿Cómo puedo mejorar mi sistema inmunológico?',
                        '¿Cuándo debo consultar a un médico por dolor de cabeza?',
                        '¿Qué ejercicios son buenos para el dolor de espalda?'
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(question)}
                          className="text-sm text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-100"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%] xl:max-w-[60%] rounded-2xl p-4 ${
                    message.isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                    {format(message.timestamp, 'h:mm a', { locale: es })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-100 max-w-[70%] md:max-w-[60%] lg:max-w-[50%]">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <span className="text-xs font-medium text-gray-600 ml-2">
                      AIUDA está escribiendo...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4 flex-shrink-0" />
          </div>
        </div>
      </main>

      {/* Input Area - Fixed at bottom */}
      <footer 
        className="bg-white/95 backdrop-blur-sm border-t border-gray-100 p-4 shadow-inner sticky bottom-0 z-20"
        style={{
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05), 0 -2px 4px -1px rgba(0, 0, 0, 0.03)',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
          marginBottom: 'calc(-1 * env(safe-area-inset-bottom, 0))'
        }}
      >
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className="container mx-auto max-w-4xl transition-all duration-200"
        >
          <div className="relative flex items-center">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className={`flex-1 pr-12 border-0 bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 rounded-full py-5 px-5 text-base placeholder-gray-400 transition-all duration-200 ${
                input.trim() ? 'shadow-md' : 'shadow-sm'
              }`}
              style={{
                boxShadow: input.trim() ? '0 4px 14px -2px rgba(37, 99, 235, 0.3)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                height: 'auto',
                minHeight: '3rem',
                paddingRight: '3.5rem'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
              aria-label="Escribe tu mensaje"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className={`absolute right-2 h-10 w-10 p-0 rounded-full flex items-center justify-center transition-all duration-200 ${
                input.trim() 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-md' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              style={{
                boxShadow: input.trim() ? '0 4px 14px -2px rgba(37, 99, 235, 0.3)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              aria-label="Enviar mensaje"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>
        <p className="text-xs text-center text-gray-400 mt-3 px-2">
          <span className="inline-flex items-center">
            <svg className="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            AIUDA puede cometer errores. Verifica la información importante.
          </span>
        </p>
      </footer>
    </div>
  );
};

export default ChatPage;

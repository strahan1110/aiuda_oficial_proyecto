import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ChatHistory {
  id: string;
  title: string;
  date: string;
}

const ChatSidebar = () => {
  const { user: _user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentChatId = new URLSearchParams(location.search).get("chat");

  useEffect(() => {
    // Simulate loading chat histories
    const timer = setTimeout(() => {
      setChatHistories([
        { id: "1", title: "Chat 1", date: "2023-05-15" },
        { id: "2", title: "Chat 2", date: "2023-05-14" },
      ]);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleNewChat = () => {
    navigate("/chatbot");
  };

  const handleDeleteChat = (_chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle delete chat logic here
    toast({
      title: "Chat deleted",
      description: "The chat has been deleted.",
    });
  };

  const isActive = (chatId: string) => {
    return chatId === currentChatId;
  };

  return (
    <div className="flex flex-col h-full border-r bg-muted/10 w-64">
      <div className="p-3">
        <Button 
          className="w-full bg-aiuda-coral hover:bg-aiuda-coral/90 flex items-center gap-2" 
          onClick={handleNewChat}
        >
          <Plus size={16} />
          Nueva consulta
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-2 px-3 py-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            CONSULTAS RECIENTES
          </h3>
        </div>
        
        {isLoading ? (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            Cargando historiales...
          </div>
        ) : chatHistories.length > 0 ? (
          chatHistories.map((chat) => (
            <div key={chat.id} className="mb-1">
              <Link
                to={`/profile?chat=${chat.id}#chat`}
                className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-accent ${
                  isActive(chat.id) ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare size={16} className="flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="truncate font-medium">{chat.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {chat.date}
                    </span>
                  </div>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive p-1 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteChat(chat.id, e);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </Link>
            </div>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            No hay conversaciones previas
          </div>
        )}
      </div>
      <div className="p-3 border-t">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link to="/profile?tab=history#history">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>Ver historial completo</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;

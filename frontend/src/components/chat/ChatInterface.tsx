'use client';

import { useEffect, useRef, useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { Conversation } from '@/types/conversation';
import MessageBubble from './MessageBubble';
import StreamingIndicator from './StreamingIndicator';
import { Send, Zap, List, PlusCircle } from 'lucide-react';

interface ChatInterfaceProps {
  conversation: Conversation;
  onError?: (error: string | Error) => void;
}

export default function ChatInterface({ conversation, onError }: ChatInterfaceProps) {
  const { user } = useAuth();
  const {
    messages,
    isStreaming,
    error,
    sendMessage
  } = useMessages(conversation.id, user?.id);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputRef.current?.value.trim();
    if (!content || isStreaming) return;
    if (inputRef.current) inputRef.current.value = '';
    await sendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleAction = async (prompt: string) => {
    if (isStreaming) return;
    await sendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#09090b] text-slate-200">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 0px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(168, 85, 247, 0.2);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(168, 85, 247, 0.4);
        }
        /* Hide horizontal scroll explicitly */
        .custom-scrollbar {
          overflow-x: hidden !important;
          scrollbar-width: thin;
          scrollbar-color: rgba(168, 85, 247, 0.2) transparent;
        }
      `}</style>

      {/* ChatKit-style Header */}
      <div className="flex items-center justify-between px-10 py-5 border-b border-white/5 bg-[#111114]/80 backdrop-blur-xl sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase italic tracking-tight leading-none truncate max-w-[200px] md:max-w-md">
              {conversation.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
              <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black whitespace-nowrap">
                Mission Status: Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#09090b] relative">
        <div className="max-w-4xl mx-auto w-full px-6 md:px-12 py-10 min-h-full flex flex-col justify-end">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center my-auto space-y-8 animate-in fade-in zoom-in duration-700">
              <div className="relative">
                 <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>
                 <h3 className="relative text-3xl font-black text-white uppercase italic tracking-tighter">
                   Ready for Command
                 </h3>
              </div>
              <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                Connect your mission objectives. I can organize tasks, update schedules, and manage your backlog via the MCP protocol.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                <button
                  onClick={() => handleAction('Show my tasks')}
                  className="flex items-center gap-4 p-4 text-left bg-white/5 border border-white/10 rounded-2xl hover:bg-purple-600/10 hover:border-purple-500/30 transition-all group"
                  disabled={isStreaming}
                >
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform"><List size={18} /></div>
                  <div>
                    <span className="block text-xs font-black text-white uppercase tracking-widest">List Objectives</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Summary of all current operations</span>
                  </div>
                </button>
                <button
                  onClick={() => handleAction('Create a new task')}
                  className="flex items-center gap-4 p-4 text-left bg-white/5 border border-white/10 rounded-2xl hover:bg-purple-600/10 hover:border-purple-500/30 transition-all group"
                  disabled={isStreaming}
                >
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform"><PlusCircle size={18} /></div>
                  <div>
                    <span className="block text-xs font-black text-white uppercase tracking-widest">New Mission</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Deploy a new task to database</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-8 mt-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          {isStreaming && <StreamingIndicator />}
          <div ref={messagesEndRef} className="h-4 w-full" />
        </div>
      </div>

      {/* Input Area - ChatKit Styled */}
      <div className="bg-[#111114] border-t border-white/5 pb-8 pt-4 px-6 md:px-12 sticky bottom-0">
        <div className="max-w-4xl mx-auto relative group">
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-end gap-3 bg-black/40 border border-white/10 p-2 rounded-2xl focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all">
              <textarea
                ref={inputRef}
                onKeyDown={handleKeyDown}
                placeholder="Message Agentic System..."
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-600 rounded-xl resize-none focus:outline-none text-sm min-h-[52px]"
                rows={1}
                disabled={isStreaming}
                style={{ maxHeight: '150px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 150) + 'px';
                }}
              />
              <button
                type="submit"
                disabled={isStreaming}
                className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/20 active:scale-95"
              >
                <Send size={18} className={isStreaming ? 'animate-pulse' : ''} />
              </button>
            </div>
          </form>
          {error && (
            <div className="absolute -top-12 left-0 right-0 animate-in slide-in-from-bottom-2 duration-300">
               <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase py-2 px-4 rounded-lg inline-flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                 System Error: {error}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

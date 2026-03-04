import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectChatProps {
  projectId: string;
}

const ProjectChat = ({ projectId }: ProjectChatProps) => {
  const { messages, loading, sendMessage } = useChat(projectId);
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    await sendMessage(text.trim());
    setText('');
    setSending(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col h-[500px]">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Chat do Projeto</h3>
        <p className="text-xs text-muted-foreground">Converse com o cliente em tempo real</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {loading && <p className="text-sm text-muted-foreground text-center">Carregando...</p>}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma mensagem ainda. Inicie a conversa!</p>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[70%] rounded-xl px-4 py-2.5', isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
                {!isMe && (
                  <p className="text-[10px] font-medium mb-0.5 opacity-70">{msg.sender_name} · {msg.sender_role === 'client' ? 'Cliente' : 'Arquiteto'}</p>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className={cn('text-[10px] mt-1', isMe ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
                  {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="px-5 py-3 border-t border-border flex gap-2">
        <Input
          placeholder="Digite sua mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={sending}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={sending || !text.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ProjectChat;


"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../../hooks/useContextHooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Avatar, AvatarFallback } from '../../../../components/ui/Avatar';
import { Bot, Send, X } from '../../../../components/icons';
import { cn } from '../../../../lib/utils';
import { getAIResponseAction } from '../../../../app/actions/ai';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

interface AIHealthAssistantProps {
    onClose: () => void;
}

const AIHealthAssistant: React.FC<AIHealthAssistantProps> = ({ onClose }) => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        try {
            const aiResponseText = await getAIResponseAction(currentInput);
            const aiMessage: Message = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorMessage: Message = { sender: 'ai', text: "Maaf, terjadi kesalahan saat menghubungi asisten AI kami. Silakan coba lagi nanti." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full h-full flex flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-start justify-between flex-shrink-0 pb-3">
                <div className="space-y-1.5 mr-4">
                    <CardTitle className="flex items-center gap-2 text-lg"><Bot className="h-6 w-6 text-primary" />{t('asistenAI')}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{t('asistenAIDesc')}</CardDescription>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full -mr-2 -mt-2 shrink-0"
                    onClick={onClose}
                    aria-label="Tutup Asisten AI"
                >
                    <X className="h-5 w-5" />
                </Button>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0 bg-secondary/30">
                <div className="h-full overflow-y-auto px-4 py-3 space-y-3 scroll-smooth chat-scrollbar">
                    {messages.length === 0 && (
                        <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                            Mulai percakapan dengan mengirim pesan...
                        </div>
                    )}
                    
                    {messages.map((msg, index) => (
                        <div key={index} className={cn("flex items-end gap-3 animate-in fade-in duration-300", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                            {msg.sender === 'ai' && (
                                <Avatar className="h-8 w-8 self-end flex-shrink-0">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        <Bot className="h-4 w-4"/>
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-[85%] rounded-xl px-4 py-3 shadow-sm leading-relaxed text-sm", 
                                msg.sender === 'user' 
                                    ? 'bg-primary text-primary-foreground rounded-br-md' 
                                    : 'bg-background text-foreground rounded-bl-md border border-border/50'
                            )}>
                                <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex items-end gap-3 justify-start animate-in fade-in duration-300">
                            <Avatar className="h-8 w-8 self-end flex-shrink-0">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Bot className="h-4 w-4"/>
                                </AvatarFallback>
                            </Avatar>
                            <div className="max-w-[85%] rounded-xl px-4 py-3 bg-background text-foreground rounded-bl-md border border-border/50">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.4s]"></span>
                                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
                                    <span className="ml-2 text-xs text-muted-foreground">AI sedang mengetik...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </CardContent>
            
            <CardFooter className="border-t bg-background/50 backdrop-blur-sm flex-shrink-0 p-3">
                <form onSubmit={handleSendMessage} className="flex w-full items-end gap-2">
                    <div className="flex-1">
                        <textarea 
                            ref={textareaRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder={t('ketikPesan')}
                            className="w-full min-h-[44px] max-h-32 resize-none rounded-xl border border-input bg-background/80 px-4 py-3 text-sm leading-relaxed ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 chat-scrollbar transition-all duration-200"
                            disabled={isLoading}
                            rows={1}
                        />
                        <div className="text-xs text-muted-foreground mt-1 px-1">
                            Enter untuk kirim, Shift+Enter untuk baris baru
                        </div>
                    </div>
                    <Button 
                        type="submit" 
                        size="icon" 
                        disabled={isLoading || !input.trim()}
                        className="h-11 w-11 rounded-xl flex-shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
};

export default AIHealthAssistant;

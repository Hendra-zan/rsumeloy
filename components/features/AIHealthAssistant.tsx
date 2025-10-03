
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useContextHooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Bot, Send, X } from '../icons';
import { cn } from '../../lib/utils';
import { getAIResponseAction } from '../../app/actions/ai';

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

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

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
            <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1.5 mr-4">
                    <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary" />{t('asistenAI')}</CardTitle>
                    <CardDescription>{t('asistenAIDesc')}</CardDescription>
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
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/50">
                {messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.sender === 'ai' && (
                            <Avatar className="h-8 w-8 self-start">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Bot className="h-5 w-5"/>
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "max-w-xs md:max-w-md rounded-lg px-4 py-2 whitespace-pre-wrap shadow-sm", 
                            msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-background text-foreground rounded-bl-none border'
                        )}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-2 justify-start">
                        <Avatar className="h-8 w-8 self-start">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5"/>
                            </AvatarFallback>
                        </Avatar>
                        <div className="max-w-xs md:max-w-md rounded-lg px-4 py-2 bg-background text-foreground rounded-bl-none border">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </CardContent>
            <CardFooter className="border-t">
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('ketikPesan')}
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
};

export default AIHealthAssistant;

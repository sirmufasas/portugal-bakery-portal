import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || 'https://bakerybackend-i7wj.onrender.com';

interface Message {
    _id: string;
    fromUserId: string;
    toUserId: string;
    message: string;
    createdAt: string;
    fromUserName?: string;
    isAutoReply?: boolean;
    isFromAdmin?: boolean;
}

export const FloatingMessageButton = () => {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch messages when chat opens
    useEffect(() => {
        if (showChat && isAuthenticated) {
            fetchMessages();
            connectSSE();
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [showChat, isAuthenticated]);

    const connectSSE = () => {
        const token = localStorage.getItem('token');
        if (!token || !user) return;

        console.log('🔌 Connecting to Support Chat SSE...');

        const eventSource = new EventSource(`${API_URL}/api/sse/support-chat?token=${token}`);

        eventSource.onopen = () => {
            console.log('✅ Support Chat SSE connected');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📡 SSE message received:', data);

                if (data.type === 'new_support_message') {
                    setMessages(prev => {
                        // Avoid duplicates
                        if (prev.some(m => m._id === data.message._id)) {
                            return prev;
                        }
                        return [...prev, data.message];
                    });

                    // Show notification if chat is closed
                    if (!showChat) {
                        toast({
                            title: "💬 New Message from Admin",
                            description: data.message.message.substring(0, 50) + (data.message.message.length > 50 ? '...' : ''),
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to parse SSE message:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('❌ SSE error:', error);
            eventSource.close();
        };

        eventSourceRef.current = eventSource;
    };

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${API_URL}/api/support/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({
                    title: "Authentication required",
                    description: "Please log in to send messages",
                    variant: "destructive",
                });
                return;
            }

            const response = await fetch(`${API_URL}/api/support/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: newMessage })
            });

            if (response.ok) {
                const data = await response.json();

                // Add user message
                if (data.userMessage) {
                    setMessages(prev => [...prev, data.userMessage]);
                }

                // Add auto-reply after a short delay (only if it exists)
                if (data.autoReply) {
                    setTimeout(() => {
                        setMessages(prev => [...prev, data.autoReply]);
                    }, 500);
                }

                setNewMessage("");
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSending(false);
        }
    };

    // Hide button if logged out
    if (!isAuthenticated) return null;

    return (
        <>
            {/* Floating Button */}
            {!showChat && (
                <button
                    onClick={() => setShowChat(true)}
                    className="fixed bottom-24 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    title="Chat with us"
                >
                    <MessageSquare className="h-6 w-6" />
                </button>
            )}

            {/* Chat Window */}
            {showChat && (
                <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white dark:bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">
                    {/* Header */}
                    <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            <div>
                                <h3 className="font-semibold">Support Chat</h3>
                                <p className="text-xs opacity-90">We're here to help!</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowChat(false)}
                            className="text-primary-foreground hover:bg-primary-foreground/20"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50 dark:bg-card">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
                                <p className="text-sm">No messages yet</p>
                                <p className="text-xs mt-1">Send us a message to get started!</p>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg) => {
                                    // Safety check - skip if message is undefined or null
                                    if (!msg || !msg._id) return null;

                                    // Check if message is from current user
                                    const isFromUser = msg.fromUserId && msg.fromUserId === user?._id;
                                    const isFromAdmin = !msg.fromUserId || msg.isFromAdmin;

                                    return (
                                        <div
                                            key={msg._id}
                                            className={cn(
                                                "flex",
                                                isFromUser ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[80%] rounded-lg p-3",
                                                    isFromUser
                                                        ? "bg-primary text-primary-foreground"
                                                        : msg.isAutoReply
                                                            ? "bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-900"
                                                            : "bg-white dark:bg-card border border-border text-foreground"
                                                )}
                                            >
                                                {isFromAdmin && msg.fromUserName && (
                                                    <p className="text-xs font-semibold mb-1 opacity-80">
                                                        {msg.fromUserName}
                                                    </p>
                                                )}
                                                <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                                <p
                                                    className={cn(
                                                        "text-xs mt-1",
                                                        isFromUser
                                                            ? "text-primary-foreground/70"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border bg-white dark:bg-card">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                className="flex-1"
                                disabled={sending}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || sending}
                                size="icon"
                            >
                                {sending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
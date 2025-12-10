// src/components/admin/AdminFloatingMessageButton.tsx
import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { playNotificationSound } from "@/utils/sounds";


const API_URL = import.meta.env.VITE_API_URL || 'https://bakerybackend-i7wj.onrender.com';

interface Message {
    _id: string;
    fromUserId?: string | null;
    toUserId?: string | null;
    message: string;
    createdAt: string;
    fromUserName?: string;
    isAutoReply?: boolean;
    isFromAdmin?: boolean;
}

interface Conversation {
    userId: string;
    userName: string;
    userEmail: string;
    lastMessage: string;
    lastMessageTime: string;
    messageCount: number;
}

export const AdminFloatingMessageButton = () => {
    const [showChat, setShowChat] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const [bouncing, setBouncing] = useState(false);


    // Only show for admins
    if (!isAuthenticated || user?.role !== 'admin') return null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch conversations and connect SSE
    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            fetchConversations();
            connectSSE();
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [isAuthenticated, user]);

    const connectSSE = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        console.log('🔌 Admin: Connecting to Support Chat SSE...');

        const eventSource = new EventSource(`${API_URL}/api/sse/admin-support?token=${token}`);

        eventSource.onopen = () => {
            console.log('✅ Admin Support Chat SSE connected');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📡 Admin SSE message received:', data);

                if (data.type === 'new_support_message') {
                    // Update conversations list
                    fetchConversations();

                    // If this conversation is currently open, add message
                    if (selectedConversation && data.message.userId === selectedConversation.userId) {
                        setMessages(prev => {
                            if (prev.some(m => m._id === data.message._id)) {
                                return prev;
                            }
                            return [...prev, data.message];
                        });
                    } else {
                        // Increment unread count if chat is closed or different conversation
                        setUnreadCount(prev => prev + 1);

                        // Start bouncing animation
                        setBouncing(true);

                        // Play notification sound for new messages
                        playNotificationSound('message');
                    }

                    // Show notification if chat is closed
                    if (!showChat) {
                        toast({
                            title: "💬 New Support Message",
                            description: `${data.message.fromUserName}: ${data.message.message.substring(0, 50)}...`,
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

    useEffect(() => {
        if (showChat || selectedConversation) {
            setBouncing(false);
        }
    }, [showChat, selectedConversation]);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${API_URL}/api/support/conversations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setConversations(data);

                // Calculate total unread count
                const totalUnread = data.reduce((sum: number, conv: Conversation) => sum + conv.messageCount, 0);
                setUnreadCount(totalUnread);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${API_URL}/api/support/conversation/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation.userId);

        // Reset unread for this conversation
        setUnreadCount(prev => Math.max(0, prev - conversation.messageCount));
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || sending || !selectedConversation) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({
                    title: "Authentication required",
                    description: "Please log in as admin",
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
                body: JSON.stringify({
                    message: newMessage,
                    recipientId: selectedConversation.userId
                })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, data]);
                setNewMessage("");

                toast({
                    title: "Message sent",
                    description: "Your message has been sent to the customer",
                });
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

    return (
        <>
            {/* Floating Button with Unread Badge */}
            {!showChat && (
                <button
                    onClick={() => {
                        setShowChat(true);
                        fetchConversations();
                        setBouncing(false); // Stop bouncing when clicked
                    }}
                    className={cn(
                        "fixed bottom-24 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative",
                        bouncing && "animate-bounce"
                    )}
                    title="Support Messages"
                >
                    <MessageSquare className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {showChat && (
                <div className="fixed bottom-6 right-6 z-50 w-[600px] max-w-[calc(100vw-3rem)] h-[600px] bg-white dark:bg-card rounded-2xl shadow-2xl flex overflow-hidden border border-border">

                    {/* Conversations List */}
                    <div className="w-1/3 border-r border-border flex flex-col">
                        <div className="bg-primary text-primary-foreground p-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Support Chat
                            </h3>
                            <p className="text-xs opacity-90">Customer Messages</p>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p className="text-xs">No conversations yet</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {conversations.map((conv) => (
                                        <button
                                            key={conv.userId}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={cn(
                                                "w-full p-3 text-left hover:bg-accent transition-colors",
                                                selectedConversation?.userId === conv.userId && "bg-accent"
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-sm truncate">{conv.userName}</p>
                                                {conv.messageCount > 0 && (
                                                    <Badge variant="destructive" className="ml-2">
                                                        {conv.messageCount}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{conv.userEmail}</p>
                                            <p className="text-xs text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages Panel */}
                    <div className="flex-1 flex flex-col">
                        {selectedConversation ? (
                            <>
                                {/* Header */}
                                <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">{selectedConversation.userName}</h3>
                                        <p className="text-xs opacity-90">{selectedConversation.userEmail}</p>
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
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                            <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
                                            <p className="text-sm">No messages yet</p>
                                        </div>
                                    ) : (
                                        <>
                                            {messages.map((msg) => {
                                                // Check if message is from admin
                                                // If fromUserId is null, it could be an auto-reply
                                                // If isFromAdmin is true, it's from admin
                                                const isFromAdmin = msg.isFromAdmin === true ||
                                                    (msg.fromUserId && msg.fromUserId !== selectedConversation.userId);

                                                return (
                                                    <div
                                                        key={msg._id}
                                                        className={cn(
                                                            "flex",
                                                            isFromAdmin ? "justify-end" : "justify-start"
                                                        )}
                                                    >
                                                        <div
                                                            className={cn(
                                                                "max-w-[80%] rounded-lg p-3",
                                                                isFromAdmin
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : msg.isAutoReply
                                                                        ? "bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-900"
                                                                        : "bg-white dark:bg-card border border-border text-foreground"
                                                            )}
                                                        >
                                                            {!isFromAdmin && msg.fromUserName && (
                                                                <p className="text-xs font-semibold mb-1 opacity-80">
                                                                    {msg.fromUserName}
                                                                </p>
                                                            )}
                                                            <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                                            <p
                                                                className={cn(
                                                                    "text-xs mt-1",
                                                                    isFromAdmin
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
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col">
                                <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                                    <h3 className="font-semibold">Support Chat</h3>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowChat(false)}
                                        className="text-primary-foreground hover:bg-primary-foreground/20"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-4">
                                    <div>
                                        <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                        <p>Select a conversation to view messages</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
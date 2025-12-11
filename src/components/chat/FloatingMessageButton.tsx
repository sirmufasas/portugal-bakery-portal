import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "https://bakerybackend-i7wj.onrender.com";

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
    // ✅ ALL HOOKS MUST COME FIRST - NO EARLY RETURNS BEFORE HOOKS!
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { toast } = useToast();

    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    // -----------------------------
    // AUTO SCROLL
    // -----------------------------
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // ✅ ALL useEffect HOOKS BEFORE EARLY RETURNS
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ✅ OPEN CHAT → FETCH MESSAGES + SSE
    useEffect(() => {
        if (showChat && isAuthenticated && user) {
            setUnreadCount(0);
            fetchMessages();
            connectSSE();
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [showChat, isAuthenticated, user]);

    // ✅ NOW YOU CAN DO EARLY RETURNS (AFTER ALL HOOKS)
    if (authLoading) return null;
    if (!isAuthenticated || !user) return null;
    if (user.role === "admin") return null;

    // -----------------------------
    // SSE CONNECTION
    // -----------------------------
    const connectSSE = () => {
        const token = localStorage.getItem("token");
        if (!token || !user) return;

        const eventSource = new EventSource(
            `${API_URL}/api/sse/support-chat?token=${token}`
        );

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "new_support_message") {
                    setMessages((prev) => {
                        if (prev.some((m) => m._id === data.message._id)) return prev;
                        return [...prev, data.message];
                    });

                    if (!showChat && data.message.isFromAdmin) {
                        setUnreadCount((p) => p + 1);
                    }

                    if (!showChat) {
                        toast({
                            title: "💬 New Message from Admin",
                            description:
                                data.message.message.length > 50
                                    ? data.message.message.slice(0, 50) + "..."
                                    : data.message.message,
                        });
                    }
                }
            } catch (error) {
                console.error("SSE Parse Error:", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE Error:", error);
            eventSource.close();
        };

        eventSourceRef.current = eventSource;
    };

    // -----------------------------
    // FETCH MESSAGES
    // -----------------------------
    const fetchMessages = async () => {
        setChatLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`${API_URL}/api/support/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);

                if (!showChat) {
                    const adminMessages = data.filter(
                        (m: Message) => m.isFromAdmin && !m.isAutoReply
                    );
                    const lastUserMessage = [...data]
                        .reverse()
                        .find((m: Message) => m.fromUserId === user?._id);

                    if (lastUserMessage) {
                        const unread = adminMessages.filter(
                            (m: Message) =>
                                new Date(m.createdAt) > new Date(lastUserMessage.createdAt)
                        ).length;
                        setUnreadCount(unread);
                    } else {
                        setUnreadCount(adminMessages.length);
                    }
                }
            }
        } catch (error) {
            console.error("Fetch messages failed:", error);
        } finally {
            setChatLoading(false);
        }
    };

    // -----------------------------
    // SEND MESSAGE
    // -----------------------------
    const handleSendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast({
                    title: "Authentication required",
                    description: "Please log in to send messages",
                    variant: "destructive",
                });
                return;
            }

            const response = await fetch(`${API_URL}/api/support/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: newMessage }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.userMessage)
                    setMessages((prev) => [...prev, data.userMessage]);

                if (data.autoReply) {
                    setTimeout(() => {
                        setMessages((prev) => [...prev, data.autoReply]);
                    }, 500);
                }

                setNewMessage("");
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Try again.",
                variant: "destructive",
            });
        } finally {
            setSending(false);
        }
    };

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <>
            {/* Floating Button */}
            {!showChat && (
                <button
                    onClick={() => setShowChat(true)}
                    className="fixed bottom-24 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:scale-110 transition-all relative"
                >
                    <MessageSquare className="h-6 w-6" />

                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
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
                        {chatLoading ? (
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
                                    if (!msg?._id) return null;

                                    const isFromUser = msg.fromUserId === user?._id;
                                    const isFromAdmin = msg.isFromAdmin;

                                    return (
                                        <div
                                            key={msg._id}
                                            className={cn("flex", isFromUser ? "justify-end" : "justify-start")}
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

                                                <p className="text-sm whitespace-pre-wrap break-words">
                                                    {msg.message}
                                                </p>

                                                <p
                                                    className={cn(
                                                        "text-xs mt-1",
                                                        isFromUser
                                                            ? "text-primary-foreground/70"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
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
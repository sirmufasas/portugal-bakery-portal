
// src/pages/Admin.tsx - Fixed with proper notifications and unread counts
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/contexts/ProductsContext";
import { categories } from "@/data/products";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";
import { uploadImage } from "@/utils/uploadImage";
import { AdminFloatingMessageButton } from "@/components/admin/AdminFloatingMessageButton";
import { notifyAdmin, requestAllPermissions, forceUnlockAudio } from "@/utils/sounds";

import {
  Package,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Trash2,
  ChefHat,
  AlertCircle,
  Plus,
  Edit,
  Save,
  X,
  ShoppingBag,
  Upload,
  Image as ImageIcon,
  Search,
  Flame,
  Users,
  Loader2,
  Bell,
  Volume2,
  Truck,
  ArrowLeft
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'https://bakerybackend-i7wj.onrender.com';

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  processing: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  shipped: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  delivered: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  cancelled: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
};

const statusIcons = {
  pending: <Clock className="h-3 w-3" />,
  processing: <ChefHat className="h-3 w-3" />,
  shipped: <Truck className="h-3 w-3" />,
  delivered: <CheckCircle className="h-3 w-3" />,
  cancelled: <XCircle className="h-3 w-3" />,
};

export default function Admin() {
  const { toast } = useToast();
  const { products = [], addProduct, updateProduct, deleteProduct } = useProducts();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [supportConversations, setSupportConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [supportMessage, setSupportMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sendingSupportMessage, setSendingSupportMessage] = useState(false);
  const eventSourceSupportRef = useRef<EventSource | null>(null);

  const [unreadSupportCount, setUnreadSupportCount] = useState(0);
  const [hasNewProducts, setHasNewProducts] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [bouncingChat, setBouncingChat] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [bouncingOrders, setBouncingOrders] = useState(false);
  const [currentTab, setCurrentTab] = useState("orders");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showMobileChatList, setShowMobileChatList] = useState(true);

  const [newProductForm, setNewProductForm] = useState({
    name: "",
    category: "Pastries",
    price: "",
    image: "",
    description: "",
    ingredients: "",
    weight: "",
    allergens: "",
    calories: "200",
    protein: "5g",
    carbs: "30g",
    fat: "8g",
  });

  useEffect(() => {
    console.log('🎵 Initializing admin notifications...');

    requestAllPermissions().then(permissions => {
      console.log('✅ Permissions:', permissions);

      if (permissions.audio) {
        console.log('✅ Audio ready - notifications will play sounds');
      } else {
        console.warn('⚠️ Audio locked - will unlock on first user interaction');
      }

      if (permissions.notifications === 'granted') {
        console.log('✅ Browser notifications enabled');
      } else {
        console.warn('⚠️ Browser notifications not enabled');
      }
    });

    const unlockOnInteraction = () => {
      console.log('👆 User interaction detected - unlocking audio...');
      forceUnlockAudio().then(success => {
        if (success) {
          console.log('✅ Audio unlocked successfully');
          document.removeEventListener('click', unlockOnInteraction);
          document.removeEventListener('keydown', unlockOnInteraction);
          document.removeEventListener('touchstart', unlockOnInteraction);
        }
      });
    };

    document.addEventListener('click', unlockOnInteraction);
    document.addEventListener('keydown', unlockOnInteraction);
    document.addEventListener('touchstart', unlockOnInteraction);

    return () => {
      document.removeEventListener('click', unlockOnInteraction);
      document.removeEventListener('keydown', unlockOnInteraction);
      document.removeEventListener('touchstart', unlockOnInteraction);
    };
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (currentTab === "orders") {
      setNewOrderCount(0);
      setBouncingOrders(false);
    } else if (currentTab === "products") {
      setHasNewProducts(false); // ✅ Clear green dot when viewing products
    }
  }, [currentTab]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') return;

    console.log('🔌 Connecting to Admin SSE...');

    const eventSource = new EventSource(`${API_URL}/api/sse/admin?token=${token}`);

    eventSource.onopen = () => {
      console.log('✅ Admin SSE connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📡 SSE message received:', data);

        if (data.type === 'new_order') {
          console.log('🎉 NEW ORDER RECEIVED - TRIGGERING NOTIFICATIONS');

          const user = data.order.user?.[0] || {};
          const transformedOrder = {
            id: data.order.orderNumber,
            customer: user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : 'Customer',
            email: user?.email || 'N/A',
            phone: data.order.phone || data.order.customerPhone || 'N/A',
            address: data.order.address || data.order.shippingAddress || '',
            deliveryMethod: data.order.deliveryMethod || 'delivery',
            deliveryFee: data.order.deliveryFee || 0, // ✅ ADDED
            deliveryZone: data.order.deliveryZone || '', // ✅ ADDED
            deliveryProvider: data.order.deliveryProvider || null,
            providerDeliveryId: data.order.providerDeliveryId || null,
            trackingUrl: data.order.trackingUrl || null,
            driverAssignedAt: data.order.driverAssignedAt || null,
            deliveryFailureReason: data.order.deliveryFailureReason || null,
            items: data.order.items.map(item => `${item.quantity}x ${item.name}`),
            total: `R${data.order.totalAmount.toFixed(2)}`,
            status: data.order.status,
            date: new Date(data.order.createdAt).toLocaleString(),
            specialInstructions: data.order.specialInstructions || '',
            _id: data.order._id,
            orderNumber: data.order.orderNumber
          };

          setOrders(prevOrders => {
            // ✅ FIX: Check if order already exists before adding
            const exists = prevOrders.some(o => o.orderNumber === transformedOrder.orderNumber);
            if (exists) {
              console.log('Order already exists, skipping notification');
              return prevOrders;
            }

            // Only increment counter and show notifications for truly NEW orders
            setNewOrderCount(prev => prev + 1);
            setBouncingOrders(true);

            const notificationTitle = '🎉 NEW ORDER!';
            const notificationBody = `Order #${data.order.orderNumber} from ${transformedOrder.customer} - ${transformedOrder.total}`;

            console.log('🔊 Calling notifyAdmin...');
            notifyAdmin('order', notificationTitle, notificationBody);

            toast({
              title: notificationTitle,
              description: notificationBody,
              duration: 10000,
            });

            console.log('✅ All notifications triggered');

            return [transformedOrder, ...prevOrders];
          });
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE error:', error);
      eventSource.close();
    };

    return () => {
      console.log('🔌 Closing Admin SSE connection');
      eventSource.close();
    };
  }, [toast]);

  useEffect(() => {
    if (bouncingOrders) {
      const timer = setTimeout(() => {
        setBouncingOrders(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [bouncingOrders]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') return;

    console.log('🔌 Connecting to Admin Support Chat SSE...');

    const eventSource = new EventSource(`${API_URL}/api/sse/admin-support?token=${token}`);

    eventSource.onopen = () => {
      console.log('✅ Admin Support Chat SSE connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📡 Admin SSE message received:', data);

        if (data.type === 'new_support_message') {
          console.log('💬 NEW SUPPORT MESSAGE - TRIGGERING NOTIFICATIONS');

          fetchSupportConversations();

          if (selectedConversation && data.message.userId === selectedConversation.userId) {
            setConversationMessages(prev => {
              if (prev.some(m => m._id === data.message._id)) {
                return prev;
              }
              return [...prev, data.message];
            });
          } else {
            setUnreadSupportCount(prev => prev + 1);
            setBouncingChat(true);
          }

          const notificationTitle = '💬 New Support Message';
          const notificationBody = `${data.message.fromUserName}: ${data.message.message.substring(0, 100)}`;

          console.log('🔊 Calling notifyAdmin for message...');
          notifyAdmin('message', notificationTitle, notificationBody);

          toast({
            title: notificationTitle,
            description: notificationBody,
          });
        }
      } catch (error) {
        console.error('Failed to parse support SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Support SSE error:', error);
      eventSource.close();
    };

    eventSourceSupportRef.current = eventSource;

    return () => {
      console.log('🔌 Closing Admin Support Chat SSE connection');
      eventSource.close();
    };
  }, [selectedConversation, toast]);

  useEffect(() => {
    if (selectedConversation) {
      setBouncingChat(false);
    }
  }, [selectedConversation]);

  const fetchSupportConversations = async () => {
    setLoadingConversations(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/support/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Conversations loaded:', data); // ✅ Debug logging
        setSupportConversations(data);

        const totalUnread = data.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
        console.log('📊 Total unread messages:', totalUnread); // ✅ Debug logging
        setUnreadSupportCount(totalUnread);
      }
    } catch (error) {
      console.error('Error fetching support conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchConversationMessages = async (userId: string) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/support/conversation/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setConversationMessages(data);
          resolve();
        } else {
          reject(new Error('Failed to fetch messages'));
        }
      } catch (error) {
        console.error('Error fetching conversation messages:', error);
        reject(error);
      }
    });
  };

  const handleSelectConversation = async (conversation) => {
    setLoadingMessages(true);
    setSelectedConversation(conversation);
    setShowMobileChatList(false);
    setBouncingChat(false);

    try {
      await fetchConversationMessages(conversation.userId);

      // ✅ Mark as read on backend (if you have this endpoint)
      const token = localStorage.getItem('token');
      try {
        await fetch(`${API_URL}/api/support/mark-read/${conversation.userId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.log('No mark-read endpoint available');
      }

      // Update frontend
      setSupportConversations(prev =>
        prev.map(conv =>
          conv.userId === conversation.userId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );

      setUnreadSupportCount(prev => Math.max(0, prev - (conversation.unreadCount || 0)));

    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendSupportMessage = async () => {
    if (!supportMessage.trim() || !selectedConversation || sendingSupportMessage) return;

    setSendingSupportMessage(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/support/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: supportMessage,
          recipientId: selectedConversation.userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConversationMessages(prev => [...prev, data]);
        setSupportMessage("");

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
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingSupportMessage(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'admin') {
      fetchSupportConversations();
    }
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || user.role !== 'admin') {
        toast({
          title: "Access denied",
          description: "Please log in as admin",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const rawText = await response.text();

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = JSON.parse(rawText);
      const ordersArray = Array.isArray(data) ? data : (data.orders || []);

      const transformedOrders = ordersArray.map(order => {
        const user = order.user?.[0] || order.user || order.userId;
        return {
          id: order.orderNumber,
          customer: user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : 'Customer',
          email: user?.email || 'N/A',
          phone: order.phone || order.customerPhone || 'N/A',
          address: order.address || order.shippingAddress || '',
          deliveryMethod: order.deliveryMethod || 'delivery',
          deliveryFee: order.deliveryFee || 0, // ✅ ADDED
          deliveryZone: order.deliveryZone || '', // ✅ ADDED
          deliveryProvider: order.deliveryProvider || null,
          providerDeliveryId: order.providerDeliveryId || null,
          trackingUrl: order.trackingUrl || null,
          driverAssignedAt: order.driverAssignedAt || null,
          deliveryFailureReason: order.deliveryFailureReason || null,
          items: order.items.map(item => `${item.quantity}x ${item.name}`),
          total: `R${order.totalAmount.toFixed(2)}`,
          status: order.status,
          date: new Date(order.createdAt).toLocaleString(),
          specialInstructions: order.specialInstructions || '',
          _id: order._id,
          orderNumber: order.orderNumber
        };
      });

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const filteredProducts = Array.isArray(products) && searchQuery.trim()
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : (Array.isArray(products) ? products : []);

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    readyOrders: orders.filter(o => o.status === "delivered").length,
    totalProducts: Array.isArray(products) ? products.length : 0,
  };

  // Group orders by status
  const ordersByStatus = {
    pending: orders.filter(o => o.status === "pending"),
    processing: orders.filter(o => o.status === "processing"),
    shipped: orders.filter(o => o.status === "shipped"),
    delivered: orders.filter(o => o.status === "delivered"),
    cancelled: orders.filter(o => o.status === "cancelled"),
  };

  const updateOrderStatus = async (orderNumber, newStatus) => {
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

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderNumber === orderNumber
            ? { ...order, status: newStatus, _isUpdating: true }
            : order
        )
      );

      const url = `${API_URL}/api/orders/${orderNumber}/status`;
      const payload = { status: newStatus };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = 'Failed to update order status';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const updatedOrder = JSON.parse(responseText);

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderNumber === orderNumber
            ? { ...order, status: updatedOrder.status, _isUpdating: false }
            : order
        )
      );

      toast({
        title: "Order Updated",
        description: `Order ${orderNumber} status changed to ${newStatus}. Customer has been notified via email.`,
      });

    } catch (error) {
      console.error('Error updating order:', error);

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderNumber === orderNumber
            ? { ...order, _isUpdating: false }
            : order
        )
      );

      fetchOrders();

      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean,
    productId?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadImage(file);

      if (isEdit && productId != null) {
        setEditingProduct(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);

        toast({
          title: "Image Uploaded",
          description: "Don't forget to click 'Save Changes' to persist the new image"
        });
      } else {
        setNewProductForm(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);

        toast({
          title: "Image Uploaded",
          description: "Image ready to be used for the new product"
        });
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast({
        title: "Image upload failed",
        description: err?.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProductForm.name || !newProductForm.price) {
      toast({
        title: "Error",
        description: "Please fill in product name and price",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(newProductForm.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Price must be a valid positive number",
        variant: "destructive",
      });
      return;
    }

    const ingredients = newProductForm.ingredients
      .split(",")
      .map(i => i.trim())
      .filter(Boolean);

    const allergens = newProductForm.allergens
      .split(",")
      .map(a => a.trim())
      .filter(Boolean);

    const productData = {
      name: newProductForm.name,
      category: newProductForm.category,
      price: price,
      image: newProductForm.image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
      description: newProductForm.description || `Delicious ${newProductForm.name.toLowerCase()}`,
      ingredients: ingredients.length > 0 ? ingredients : ["Wheat flour", "Water", "Salt"],
      weight: newProductForm.weight || "100g",
      allergens: allergens.length > 0 ? allergens : [],
      nutritionalInfo: {
        calories: parseInt(newProductForm.calories) || 200,
        protein: newProductForm.protein || "5g",
        carbs: newProductForm.carbs || "30g",
        fat: newProductForm.fat || "8g",
      },
    };

    try {
      await addProduct(productData);

      setShowAddProduct(false);
      setNewProductForm({
        name: "",
        category: "Pastries",
        price: "",
        image: "",
        description: "",
        ingredients: "",
        weight: "",
        allergens: "",
        calories: "200",
        protein: "5g",
        carbs: "30g",
        fat: "8g",
      });
      setImagePreview(null);

      // ✅ Set flag to show green dot on Products tab
      setHasNewProducts(true);

      toast({
        title: "Product Added",
        description: `${productData.name} has been added to the menu`,
      });
    } catch (err) {
      console.error("❌ Add product error:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      ingredients: product.ingredients.join(", "),
      allergens: product.allergens.join(", "),
    });
    setImagePreview(product.image);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct.name || !editingProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in product name and price",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(editingProduct.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Price must be a valid positive number",
        variant: "destructive",
      });
      return;
    }

    const ingredients = editingProduct.ingredients
      .split(",")
      .map(i => i.trim())
      .filter(Boolean);

    const allergens = editingProduct.allergens
      .split(",")
      .map(a => a.trim())
      .filter(Boolean);

    const productData = {
      ...editingProduct,
      price: price,
      ingredients: ingredients.length > 0 ? ingredients : ["Wheat flour", "Water", "Salt"],
      allergens: allergens.length > 0 ? allergens : [],
    };

    try {
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      setImagePreview(null);

      toast({
        title: "Product Updated",
        description: `${productData.name} has been updated`,
      });
    } catch (err) {
      console.error("❌ Update product error:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (confirm(`Are you sure you want to delete "${product.name}"? This will remove it from the menu.`)) {
      try {
        await deleteProduct(id);
        toast({
          title: "Product Deleted",
          description: `${product.name} has been removed from the menu`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const authedFetch = async (path, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({ title: "Authentication required", description: "Please log in as admin", variant: "destructive" });
      throw new Error('No token');
    }
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    if (!response.ok) {
      throw new Error(data.error || data.message || `${response.status}: ${response.statusText}`);
    }
    return data;
  };

  const markReadyForDelivery = async (orderNumber) => {
    try {
      const updated = await authedFetch(`/api/orders/${orderNumber}/ready-for-delivery`, { method: 'PUT' });
      setOrders(prev => prev.map(o => o.orderNumber === orderNumber ? { ...o, status: updated.status } : o));
      toast({ title: "Order ready", description: `Order ${orderNumber} marked ready for delivery.` });
    } catch (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    }
  };

  const requestCourier = async (orderNumber, providerId) => {
    try {
      const updated = await authedFetch(`/api/orders/${orderNumber}/request-courier`, {
        method: 'POST',
        body: JSON.stringify(providerId ? { providerId } : {})
      });
      setOrders(prev => prev.map(o => o.orderNumber === orderNumber
        ? { ...o, status: updated.status, providerDeliveryId: updated.providerDeliveryId, trackingUrl: updated.trackingUrl }
        : o));
      toast({ title: "Courier requested", description: `Courier requested for order ${orderNumber}.` });
    } catch (error) {
      toast({ title: "Courier request failed", description: error.message, variant: "destructive" });
      fetchOrders();
    }
  };

  const switchProvider = async (orderNumber, providerId) => {
    try {
      const updated = await authedFetch(`/api/orders/${orderNumber}/switch-provider`, {
        method: 'POST',
        body: JSON.stringify({ providerId })
      });
      setOrders(prev => prev.map(o => o.orderNumber === orderNumber
        ? { ...o, status: updated.status, deliveryProvider: updated.deliveryProvider, providerDeliveryId: null, trackingUrl: null }
        : o));
      toast({ title: "Provider switched", description: `Order ${orderNumber} will now use ${providerId}.` });
    } catch (error) {
      toast({ title: "Switch failed", description: error.message, variant: "destructive" });
    }
  };

  const renderOrderCard = (order) => (
    <Card key={order.id} className={order.status === 'delivered' ? 'border-2 border-green-500 dark:border-green-700' : ''}>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono font-bold text-primary">{order.id}</span>
              <Badge className={`${statusColors[order.status]} flex items-center gap-1`}>
                {statusIcons[order.status]}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>

              {/* DELIVERY METHOD BADGE */}
              {order.deliveryMethod === 'pickup' ? (
                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  Store Pickup
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  <Truck className="h-3 w-3 mr-1" />
                  Delivery
                </Badge>
              )}
            </div>

            <p className="font-medium text-foreground">{order.customer}</p>
            <p className="text-sm text-muted-foreground truncate">{order.email}</p>

            {/* PHONE */}
            {order.phone && order.phone !== 'N/A' && (
              <p className="text-sm text-muted-foreground mt-1">
                📞 <a href={`tel:${order.phone}`} className="hover:text-primary">{order.phone}</a>
              </p>
            )}

            {/* ADDRESS - Only show for delivery orders */}
            {order.deliveryMethod === 'delivery' && order.address && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-1">
                  📍 Delivery Address:
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors break-words inline-flex items-center gap-1"
                >
                  {order.address}
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* ✅ DELIVERY FEE & ZONE */}
                {order.deliveryFee !== undefined && order.deliveryFee > 0 && (
                  <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-900">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        Delivery Fee:
                      </span>
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-100">
                        R{order.deliveryFee.toFixed(2)}
                      </span>
                    </div>
                    {order.deliveryZone && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Zone: {order.deliveryZone}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PICKUP INFO */}
            {order.deliveryMethod === 'pickup' && (
              <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                <p className="text-xs font-semibold text-purple-900 dark:text-purple-100 mb-1 flex items-center gap-1">
                  🏪 Store Pickup
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Customer will collect from store
                </p>
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-1">Items:</p>
            <ul className="text-sm text-muted-foreground mb-3">
              {order.items.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>

            {order.specialInstructions && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      Special Instructions:
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200 break-words">
                      {order.specialInstructions}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
            {/* ✅ FIXED TOTAL WITH BREAKDOWN */}
            <div className="text-right">
              {/* Show breakdown for delivery orders */}
              {order.deliveryMethod === 'delivery' && order.deliveryFee > 0 ? (
                <>
                  <div className="text-xs text-muted-foreground mb-1 space-y-0.5">
                    <div className="flex justify-end gap-2">
                      <span>Subtotal:</span>
                      <span className="font-medium">
                        R{(parseFloat(order.total.replace('R', '')) - order.deliveryFee).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2 text-blue-600 dark:text-blue-400">
                      <span>Delivery:</span>
                      <span className="font-medium">R{order.deliveryFee.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-primary">{order.total}</p>
                  <p className="text-xs text-muted-foreground">(inc. delivery)</p>
                </>
              ) : order.deliveryMethod === 'pickup' ? (
                <>
                  <p className="text-xl font-bold text-primary">{order.total}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ No delivery fee
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-primary">{order.total}</p>
              )}
            </div>

            <Select
              value={order.status}
              onValueChange={(value) => updateOrderStatus(order.orderNumber, value)}
            >
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">
                  {order.deliveryMethod === 'pickup' ? 'Ready for Pickup' : 'Shipped'}
                </SelectItem>
                <SelectItem value="delivered">
                  {order.deliveryMethod === 'pickup' ? 'Collected' : 'Delivered'}
                </SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* DELIVERY ENGINE WORKFLOW - only for delivery orders */}
            {order.deliveryMethod === 'delivery' && (
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                {['pending', 'processing', 'confirmed', 'preparing'].includes(order.status) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markReadyForDelivery(order.orderNumber)}
                  >
                    Mark Ready for Delivery
                  </Button>
                )}

                {order.status === 'ready_for_delivery' && (
                  <Button
                    size="sm"
                    onClick={() => requestCourier(order.orderNumber, order.deliveryProvider)}
                  >
                    Request Courier{order.deliveryProvider ? ` (${order.deliveryProvider.replace('_', ' ')})` : ''}
                  </Button>
                )}

                {['courier_requested', 'driver_assigned', 'delivery_failed'].includes(order.status) && !order.driverAssignedAt && (
                  <Select onValueChange={(value) => switchProvider(order.orderNumber, value)}>
                    <SelectTrigger className="w-full sm:w-44">
                      <SelectValue placeholder="Switch provider..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="own_delivery">Portugal Bakery Delivery</SelectItem>
                      <SelectItem value="uber_direct">Uber Direct</SelectItem>
                      <SelectItem value="courier_guy">The Courier Guy</SelectItem>
                      <SelectItem value="pargo">Pargo</SelectItem>
                      <SelectItem value="pudo">PUDO</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline text-center"
                  >
                    Track Delivery →
                  </a>
                )}

                {order.deliveryFailureReason && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    ⚠ {order.deliveryFailureReason}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingCartButton />
      <AdminFloatingMessageButton />
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage orders, products, and communications
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-primary/10">
                    <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-amber-500/10">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-green-500/10">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.readyOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Delivered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-purple-500/10">
                    <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalProducts}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger
                value="orders"
                className={`gap-2 relative ${bouncingOrders ? 'animate-bounce' : ''}`}
              >
                <Package className="h-4 w-4 hidden sm:block" />
                Orders
                {newOrderCount > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white hover:bg-red-600">
                    {newOrderCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2 relative">
                <ShoppingBag className="h-4 w-4 hidden sm:block" />
                Products
                {hasNewProducts && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-2 w-2"></span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className={`gap-2 relative ${bouncingChat ? 'animate-bounce' : ''}`}
              >
                <MessageSquare className="h-4 w-4 hidden sm:block" />
                Support
                {unreadSupportCount > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white hover:bg-red-600">
                    {unreadSupportCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="delivery" className="gap-2 relative">
                <Truck className="h-4 w-4 hidden sm:block" />
                Delivery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              {loadingOrders ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Pending Orders */}
                  {ordersByStatus.pending.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-amber-500" />
                        <h2 className="text-xl font-bold text-foreground">Pending Orders</h2>
                        <Badge variant="secondary">{ordersByStatus.pending.length}</Badge>
                      </div>
                      <div className="space-y-4">
                        {ordersByStatus.pending.map(renderOrderCard)}
                      </div>
                    </div>
                  )}

                  {/* Processing Orders */}
                  {ordersByStatus.processing.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <ChefHat className="h-5 w-5 text-orange-500" />
                        <h2 className="text-xl font-bold text-foreground">Processing Orders</h2>
                        <Badge variant="secondary">{ordersByStatus.processing.length}</Badge>
                      </div>
                      <div className="space-y-4">
                        {ordersByStatus.processing.map(renderOrderCard)}
                      </div>
                    </div>
                  )}

                  {/* Shipped Orders */}
                  {ordersByStatus.shipped.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Truck className="h-5 w-5 text-blue-500" />
                        <h2 className="text-xl font-bold text-foreground">Shipped Orders</h2>
                        <Badge variant="secondary">{ordersByStatus.shipped.length}</Badge>
                      </div>
                      <div className="space-y-4">
                        {ordersByStatus.shipped.map(renderOrderCard)}
                      </div>
                    </div>
                  )}

                  {/* Delivered Orders */}
                  {ordersByStatus.delivered.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h2 className="text-xl font-bold text-foreground">Delivered Orders</h2>
                        <Badge variant="secondary">{ordersByStatus.delivered.length}</Badge>
                      </div>
                      <div className="space-y-4">
                        {ordersByStatus.delivered.map(renderOrderCard)}
                      </div>
                    </div>
                  )}

                  {/* Cancelled Orders */}
                  {ordersByStatus.cancelled.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <h2 className="text-xl font-bold text-foreground">Cancelled Orders</h2>
                        <Badge variant="secondary">{ordersByStatus.cancelled.length}</Badge>
                      </div>
                      <div className="space-y-4">
                        {ordersByStatus.cancelled.map(renderOrderCard)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Product Management</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Add, edit, or remove products from your menu</p>
                </div>
                <Button onClick={() => setShowAddProduct(true)} className="gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>

              <div className="w-full mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
                    Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
                  </p>
                )}
              </div>

              {showAddProduct && (
                <Card className="mb-6 border-2 border-primary">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg sm:text-xl">Add New Product</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowAddProduct(false);
                          setImagePreview(null);
                          setNewProductForm({
                            name: "",
                            category: "Pastries",
                            price: "",
                            image: "",
                            description: "",
                            ingredients: "",
                            weight: "",
                            allergens: "",
                            calories: "200",
                            protein: "5g",
                            carbs: "30g",
                            fat: "8g",
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium mb-2 block">Product Name *</label>
                          <Input
                            value={newProductForm.name}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, name: e.target.value })
                            }
                            placeholder="e.g. Chocolate Croissant"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium mb-2 block">Category *</label>
                          <Select
                            value={newProductForm.category}
                            onValueChange={(v) => setNewProductForm({ ...newProductForm, category: v })}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.filter(c => c !== 'All').map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium mb-2 block">Price (R) *</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newProductForm.price}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, price: e.target.value })
                            }
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium mb-2 block">Weight</label>
                          <Input
                            value={newProductForm.weight}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, weight: e.target.value })
                            }
                            placeholder="e.g. 85g"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium mb-2 block">Product Image</label>
                          <div className="border-2 border-dashed rounded-lg p-3 sm:p-4 text-center">
                            {imagePreview ? (
                              <div className="space-y-2">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-32 sm:h-40 object-cover rounded"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById('add-image-upload')?.click()}
                                  disabled={isUploading}
                                  className="text-xs sm:text-sm"
                                >
                                  {isUploading ? "Uploading..." : "Change Image"}
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground" />
                                <Button
                                  variant="outline"
                                  onClick={() => document.getElementById('add-image-upload')?.click()}
                                  disabled={isUploading}
                                  size="sm"
                                  className="text-xs sm:text-sm"
                                >
                                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                  {isUploading ? "Uploading..." : "Upload Image"}
                                </Button>
                              </div>
                            )}
                            <input
                              id="add-image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, false)}
                              disabled={isUploading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={newProductForm.description}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, description: e.target.value })
                        }
                        placeholder="Brief description of the product"
                        rows={3}
                        className="text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium mb-2 block">Ingredients (comma-separated)</label>
                      <Input
                        value={newProductForm.ingredients}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, ingredients: e.target.value })
                        }
                        placeholder="e.g. Wheat flour, Butter, Chocolate"
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium mb-2 block">Allergens (comma-separated)</label>
                      <Input
                        value={newProductForm.allergens}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, allergens: e.target.value })
                        }
                        placeholder="e.g. Gluten, Dairy, Eggs"
                        className="text-sm"
                      />
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        Nutritional Information
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-xs font-medium mb-1 block">Calories</label>
                          <Input
                            type="number"
                            value={newProductForm.calories}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, calories: e.target.value })
                            }
                            placeholder="200"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Protein</label>
                          <Input
                            value={newProductForm.protein}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, protein: e.target.value })
                            }
                            placeholder="5g"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Carbs</label>
                          <Input
                            value={newProductForm.carbs}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, carbs: e.target.value })
                            }
                            placeholder="30g"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Fat</label>
                          <Input
                            value={newProductForm.fat}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, fat: e.target.value })
                            }
                            placeholder="8g"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={handleAddProduct} className="flex-1 text-sm" disabled={isUploading}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddProduct(false);
                          setImagePreview(null);
                        }}
                        disabled={isUploading}
                        className="text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-3 sm:p-4">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div>
                                <label className="text-xs sm:text-sm font-medium mb-2 block">Product Name *</label>
                                <Input
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium mb-2 block">Category</label>
                                <Select value={editingProduct.category} onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v })}>
                                  <SelectTrigger className="text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.filter(c => c !== 'All').map(cat => (
                                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium mb-2 block">Price (R)</label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.price}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium mb-2 block">Weight</label>
                                <Input
                                  value={editingProduct.weight}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                                  className="text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs sm:text-sm font-medium mb-2 block">Product Image</label>
                              <div className="border-2 border-dashed rounded-lg p-3 sm:p-4">
                                <img src={imagePreview || editingProduct.image} alt={editingProduct.name} className="w-full h-32 sm:h-40 object-cover rounded mb-2" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-xs sm:text-sm"
                                  onClick={() => document.getElementById(`edit-image-${product.id}`)?.click()}
                                  disabled={isUploading}
                                >
                                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                  {isUploading ? "Uploading..." : "Change Image"}
                                </Button>
                                <input
                                  id={`edit-image-${editingProduct.id}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, true, editingProduct.id)}
                                  disabled={isUploading}
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium mb-2 block">Description</label>
                            <Textarea
                              value={editingProduct.description}
                              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              rows={2}
                              className="text-sm resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium mb-2 block">Ingredients (comma-separated)</label>
                            <Input
                              value={editingProduct.ingredients}
                              onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium mb-2 block">Allergens (comma-separated)</label>
                            <Input
                              value={editingProduct.allergens}
                              onChange={(e) => setEditingProduct({ ...editingProduct, allergens: e.target.value })}
                              className="text-sm"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button onClick={handleSaveEdit} className="flex-1 text-sm" disabled={isUploading}>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => {
                              setEditingProduct(null);
                              setImagePreview(null);
                            }} disabled={isUploading} className="text-sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full sm:w-20 md:w-24 h-48 sm:h-20 md:h-24 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-2">
                              <div className="flex-1 min-w-0 w-full sm:w-auto">
                                <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">{product.name}</h3>
                                <Badge variant="outline" className="mt-1 text-xs">{product.category}</Badge>
                              </div>
                              <p className="text-lg sm:text-xl font-bold text-primary whitespace-nowrap">R{product.price.toFixed(2)}</p>
                            </div>
                            {product.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                            )}
                            {product.weight && (
                              <p className="text-xs text-muted-foreground">Weight: {product.weight}</p>
                            )}
                            {product.ingredients && product.ingredients.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                Ingredients: {product.ingredients.join(", ")}
                              </p>
                            )}
                            {product.allergens && product.allergens.length > 0 && (
                              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                Allergens: {product.allergens.join(", ")}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 sm:flex-initial text-xs sm:text-sm"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 sm:flex-initial text-xs sm:text-sm"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="support" className="space-y-4">
              {/* Mobile: Show either list or chat */}
              <div className="block md:hidden">
                {showMobileChatList ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Support Conversations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {loadingConversations ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : supportConversations.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                          <p className="text-sm">No support conversations yet</p>
                        </div>
                      ) : (
                        <div className="divide-y">
                          {supportConversations.map((conversation) => (
                            <button
                              key={conversation.userId}
                              onClick={() => handleSelectConversation(conversation)}
                              className={`w-full p-4 text-left hover:bg-accent transition-all relative ${conversation.unreadCount > 0
                                ? "ring-2 ring-green-400 dark:ring-green-600 shadow-[0_0_15px_rgba(34,197,94,0.3)] dark:shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                                : ""
                                }`}
                            >
                              {conversation.unreadCount > 0 && (
                                <div className="absolute inset-0 bg-green-50 dark:bg-green-950/20 rounded-lg pointer-events-none" />
                              )}
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-foreground truncate">{conversation.userName}</p>
                                  </div>
                                  {conversation.unreadCount > 0 && (
                                    <Badge className="ml-2 bg-green-500 text-white hover:bg-green-600 animate-pulse">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate mb-1">{conversation.userEmail}</p>
                                <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(conversation.lastMessageTime).toLocaleString()}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="border-b">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setShowMobileChatList(true);
                            setSelectedConversation(null);
                          }}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                          <CardTitle>{selectedConversation?.userName}</CardTitle>
                          <p className="text-sm text-muted-foreground">{selectedConversation?.userEmail}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      {loadingMessages ? (
                        <div className="flex justify-center items-center py-16">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                            {conversationMessages.length === 0 ? (
                              <p className="text-center text-muted-foreground py-8">No messages yet</p>
                            ) : (
                              conversationMessages.map((msg) => {
                                const isFromAdmin = msg.isFromAdmin;
                                return (
                                  <div
                                    key={msg._id}
                                    className={`flex ${isFromAdmin ? "justify-end" : "justify-start"}`}
                                  >
                                    <div
                                      className={`max-w-[80%] rounded-lg p-3 ${isFromAdmin
                                        ? "bg-primary text-primary-foreground"
                                        : msg.isAutoReply
                                          ? "bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border border-amber-200"
                                          : "bg-muted"
                                        }`}
                                    >
                                      {msg.fromUserName && (
                                        <p className="text-xs font-semibold mb-1 opacity-80">
                                          {msg.fromUserName}
                                        </p>
                                      )}
                                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                      <p className="text-xs opacity-70 mt-1">
                                        {new Date(msg.createdAt).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              value={supportMessage}
                              onChange={(e) => setSupportMessage(e.target.value)}
                              placeholder="Type your message..."
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendSupportMessage();
                                }
                              }}
                              disabled={sendingSupportMessage || loadingMessages}
                            />
                            <Button
                              onClick={handleSendSupportMessage}
                              disabled={sendingSupportMessage || loadingMessages}
                            >
                              {sendingSupportMessage ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Desktop: Show both side by side */}
              <div className="hidden md:grid md:grid-cols-3 gap-4">
                {/* Conversations List */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Support Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingConversations ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : supportConversations.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No support conversations yet</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {supportConversations.map((conversation) => (
                          <button
                            key={conversation.userId}
                            onClick={() => handleSelectConversation(conversation)}
                            disabled={loadingMessages && selectedConversation?.userId === conversation.userId}
                            className={`w-full p-4 text-left hover:bg-accent transition-all relative ${selectedConversation?.userId === conversation.userId ? "bg-accent" : ""
                              } ${conversation.unreadCount > 0
                                ? "ring-2 ring-green-400 dark:ring-green-600 shadow-[0_0_15px_rgba(34,197,94,0.3)] dark:shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                                : ""
                              }`}
                          >
                            {conversation.unreadCount > 0 && (
                              <div className="absolute inset-0 bg-green-50 dark:bg-green-950/20 rounded-lg pointer-events-none" />
                            )}
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground truncate">{conversation.userName}</p>
                                  {loadingMessages && selectedConversation?.userId === conversation.userId && (
                                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                  )}
                                </div>
                                {conversation.unreadCount > 0 && (
                                  <Badge className="ml-2 bg-green-500 text-white hover:bg-green-600 animate-pulse">
                                    {conversation.unreadCount} new
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-1">{conversation.userEmail}</p>
                              <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(conversation.lastMessageTime).toLocaleString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="md:col-span-2">
                  {selectedConversation ? (
                    <>
                      <CardHeader className="border-b">
                        <div>
                          <CardTitle>{selectedConversation.userName}</CardTitle>
                          <p className="text-sm text-muted-foreground">{selectedConversation.userEmail}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        {loadingMessages ? (
                          <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                              {conversationMessages.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No messages yet</p>
                              ) : (
                                conversationMessages.map((msg) => {
                                  const isFromAdmin = msg.isFromAdmin;
                                  return (
                                    <div
                                      key={msg._id}
                                      className={`flex ${isFromAdmin ? "justify-end" : "justify-start"}`}
                                    >
                                      <div
                                        className={`max-w-[80%] rounded-lg p-3 ${isFromAdmin
                                          ? "bg-primary text-primary-foreground"
                                          : msg.isAutoReply
                                            ? "bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border border-amber-200"
                                            : "bg-muted"
                                          }`}
                                      >
                                        {msg.fromUserName && (
                                          <p className="text-xs font-semibold mb-1 opacity-80">
                                            {msg.fromUserName}
                                          </p>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                          {new Date(msg.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={supportMessage}
                                onChange={(e) => setSupportMessage(e.target.value)}
                                placeholder="Type your message..."
                                onKeyPress={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendSupportMessage();
                                  }
                                }}
                                disabled={sendingSupportMessage || loadingMessages}
                              />
                              <Button
                                onClick={handleSendSupportMessage}
                                disabled={sendingSupportMessage || loadingMessages}
                              >
                                {sendingSupportMessage ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                      <div className="text-center text-muted-foreground">
                        <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-4">
              <DeliverySettingsPanel authedFetch={authedFetch} toast={toast} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ==================== DELIVERY SETTINGS PANEL ====================
// Lets bakery staff enable/disable providers and set delivery business
// rules (free delivery threshold). Providers that aren't configured with
// real credentials are shown but disabled, never silently offered.

const ALL_PROVIDERS = [
  { id: "own_delivery", name: "Portugal Bakery Delivery" },
  { id: "uber_direct", name: "Uber Direct" },
  { id: "courier_guy", name: "The Courier Guy" },
  { id: "pargo", name: "Pargo" },
  { id: "pudo", name: "PUDO" },
  { id: "local_courier", name: "Local Motorbike Courier" },
];

function DeliverySettingsPanel({ authedFetch, toast }: {
  authedFetch: (path: string, options?: RequestInit) => Promise<any>;
  toast: (opts: any) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabledProviders, setEnabledProviders] = useState<string[]>([]);
  const [configuredProviders, setConfiguredProviders] = useState<Record<string, boolean>>({});
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const [settings, providersRes] = await Promise.all([
          authedFetch('/api/admin/delivery-settings'),
          authedFetch('/api/delivery/providers'),
        ]);
        setEnabledProviders(settings.enabledProviders || []);
        setFreeDeliveryThreshold(settings.freeDeliveryThreshold != null ? String(settings.freeDeliveryThreshold) : "");
        const configured: Record<string, boolean> = {};
        (providersRes.providers || []).forEach((p: any) => { configured[p.id] = p.configured; });
        setConfiguredProviders(configured);
      } catch (error) {
        toast({ title: "Failed to load delivery settings", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleProvider = (id: string, checked: boolean) => {
    setEnabledProviders(prev => checked ? [...new Set([...prev, id])] : prev.filter(p => p !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await authedFetch('/api/admin/delivery-settings', {
        method: 'PUT',
        body: JSON.stringify({
          enabledProviders,
          freeDeliveryThreshold: freeDeliveryThreshold.trim() === "" ? null : Number(freeDeliveryThreshold),
        }),
      });
      toast({ title: "Delivery settings saved" });
    } catch (error) {
      toast({ title: "Failed to save", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Providers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm text-muted-foreground mb-3">
            Only enabled AND configured providers are offered to customers at checkout.
            Providers without credentials are shown for reference but can't be turned on yet.
          </p>
          {ALL_PROVIDERS.map(provider => {
            const configured = !!configuredProviders[provider.id];
            const enabled = enabledProviders.includes(provider.id);
            return (
              <div key={provider.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{provider.name}</p>
                  {!configured && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">Awaiting credentials</p>
                  )}
                </div>
                <Switch
                  checked={enabled}
                  disabled={!configured}
                  onCheckedChange={(checked) => toggleProvider(provider.id, checked)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Business Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Free delivery threshold (R)
            </label>
            <Input
              type="number"
              min={0}
              placeholder="Leave empty to disable"
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Orders at or above this subtotal get free delivery, applied automatically at checkout.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Delivery Settings
          </>
        )}
      </Button>
    </div>
  );
}
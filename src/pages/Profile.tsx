import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, ShoppingBag, Award, Calendar, Key, Lock, ShoppingCart, MapPin, Truck, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
    product: {
        _id: string;
        name: string;
        price: number;
        image?: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    totalAmount: number;
    createdAt: string;
    status: string;
    deliveryMethod?: string;
    address?: string;
    deliveryZone?: string;
    deliveryFee?: number;
    specialInstructions?: string;
}

const Profile = () => {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingOrders, setFetchingOrders] = useState(true);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();
    const { cart } = useCart();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchOrders = async () => {
            if (!token) {
                setFetchingOrders(false);
                return;
            }

            try {
                setFetchingOrders(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch orders");

                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching orders:", err);
                toast({
                    title: "Error",
                    description: "Failed to fetch your purchases.",
                    variant: "destructive",
                });
                setOrders([]);
            } finally {
                setFetchingOrders(false);
            }
        };

        fetchOrders();
    }, [user, token, navigate, toast]);

    const favoriteItem = useMemo(() => {
        if (orders.length === 0) return null;

        const itemCounts = new Map<string, { name: string; count: number; image?: string }>();

        orders.forEach(order => {
            order.items.forEach(item => {
                const productName = item.product?.name || "Unknown Product";
                const image = item.product?.image;
                const existing = itemCounts.get(productName);

                if (existing) {
                    existing.count += item.quantity;
                } else {
                    itemCounts.set(productName, {
                        name: productName,
                        count: item.quantity,
                        image
                    });
                }
            });
        });

        // Find the item with highest count
        let maxItem: { name: string; count: number; image?: string } | null = null;
        itemCounts.forEach(item => {
            if (!maxItem || item.count > maxItem.count) {
                maxItem = item;
            }
        });

        return maxItem;
    }, [orders]);

    const totalItemsInCart = useMemo(() => {
        return cart.reduce((sum, c) => sum + c.quantity, 0);
    }, [cart]);

    const totalItemsPurchased = useMemo(() => {
        return orders.reduce((total, order) =>
            total + order.items.reduce((sum, item) => sum + item.quantity, 0), 0
        );
    }, [orders]);

    const handleViewReceipt = (order: Order) => {
        setSelectedOrder(order);
        setReceiptDialogOpen(true);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to change password");
            }

            toast({
                title: "Success",
                description: "Password changed successfully",
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to change password",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!user) return;

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/request-password-reset`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: user.email }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Failed to send reset email" }));
                throw new Error(errorData.error || "Failed to send reset email");
            }

            toast({
                title: "Password Reset Email Sent",
                description: "Check your Inbox/Spam for the reset link.",
                variant: "default",
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to send reset email";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center py-24">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 transition-colors duration-300">
            <Navbar />

            <main className="pt-20 sm:pt-24 pb-8 sm:pb-12 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-2">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg flex-shrink-0">
                            {user.firstName?.charAt(0)}
                            {user.lastName?.charAt(0)}
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-1">
                                Member since{" "}
                                {new Date((user as any).createdAt || Date.now()).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Personal Information Card */}
                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-neutral-200 dark:border-neutral-800">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
                                <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-50 text-lg sm:text-xl">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-500" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription className="dark:text-neutral-400 text-sm">
                                    Your account details and contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 p-4 sm:p-6">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Full Name</p>
                                        <p className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-50 truncate">
                                            {user.firstName} {user.lastName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Email Address</p>
                                        <p className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-50 break-all">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Phone Number</p>
                                        <p className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-50">
                                            {(user as any).phone || "Not Provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 w-full sm:w-auto text-sm">
                                                <Key className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                                Change Password
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-[calc(100vw-2rem)] max-w-[425px] mx-auto">
                                            <DialogHeader>
                                                <DialogTitle className="text-lg sm:text-xl">Change Password</DialogTitle>
                                                <DialogDescription className="text-sm">
                                                    Enter your current password and a new password below.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleChangePassword} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="current" className="text-sm">Current Password</Label>
                                                    <Input
                                                        id="current"
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        required
                                                        className="text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new" className="text-sm">New Password</Label>
                                                    <Input
                                                        id="new"
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required
                                                        minLength={6}
                                                        className="text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm" className="text-sm">Confirm New Password</Label>
                                                    <Input
                                                        id="confirm"
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                        minLength={6}
                                                        className="text-sm"
                                                    />
                                                </div>
                                                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setPasswordDialogOpen(false)}
                                                        className="w-full sm:w-auto text-sm"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto text-sm"
                                                    >
                                                        {loading ? "Changing..." : "Change Password"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        variant="outline"
                                        onClick={handleForgotPassword}
                                        disabled={loading}
                                        className="w-full sm:w-auto text-sm"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-current mr-2"></div>
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                                <span className="hidden sm:inline">Forgot Password?</span>
                                                <span className="sm:hidden">Reset Password</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Purchase History Card */}
                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-neutral-200 dark:border-neutral-800">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
                                <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-50 text-lg sm:text-xl">
                                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-500" />
                                    Purchase History
                                </CardTitle>
                                <CardDescription className="dark:text-neutral-400 text-sm">
                                    {fetchingOrders ? (
                                        "Loading your orders..."
                                    ) : orders.length > 0 ? (
                                        `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`
                                    ) : (
                                        "No orders yet"
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                                {fetchingOrders ? (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-amber-600 mx-auto mb-3"></div>
                                        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">Loading orders...</p>
                                    </div>
                                ) : orders.length ? (
                                    <div className="space-y-2 sm:space-y-3">
                                        {orders.map((order) => (
                                            <div
                                                key={order._id}
                                                onClick={() => handleViewReceipt(order)}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all border border-neutral-200 dark:border-neutral-800 gap-3 cursor-pointer hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                                        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-500" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-50">
                                                            Order #{order.orderNumber}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} item{order.items.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''}
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className="mt-1 text-xs"
                                                        >
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pl-12 sm:pl-0">
                                                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span className="text-xs sm:text-sm whitespace-nowrap">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-500">
                                                        R{order.totalAmount.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-12">
                                        <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-3" />
                                        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">No purchases yet</p>
                                        <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                                            Start shopping to see your order history here
                                        </p>
                                        <Button
                                            onClick={() => navigate("/menu")}
                                            className="mt-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-sm"
                                        >
                                            Start Shopping
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Stats Card */}
                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-neutral-200 dark:border-neutral-800">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-neutral-200 dark:border-neutral-800 p-4 sm:p-6">
                                <CardTitle className="text-neutral-900 dark:text-neutral-50 text-lg sm:text-xl">
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 p-4 sm:p-6">
                                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-900/50">
                                    <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-500">
                                        {totalItemsInCart}
                                    </p>
                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        Items in Cart
                                    </p>
                                </div>

                                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/50">
                                    <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-500">
                                        {fetchingOrders ? "..." : orders.length}
                                    </p>
                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        Total Orders
                                    </p>
                                </div>

                                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900/50">
                                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-500">
                                        {fetchingOrders ? "..." : totalItemsPurchased}
                                    </p>
                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        Items Purchased
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Favorite Item Card */}
                        {favoriteItem && (
                            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-neutral-200 dark:border-neutral-800 overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"></div>
                                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 sm:p-6">
                                    <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-50 text-lg sm:text-xl">
                                        <Award className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                                        Most Ordered Item
                                    </CardTitle>
                                    <CardDescription className="dark:text-neutral-400 text-sm">
                                        Your all-time favorite
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                        {favoriteItem.image ? (
                                            <img
                                                src={favoriteItem.image}
                                                alt={favoriteItem.name}
                                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg border-4 border-amber-400 dark:border-amber-600 flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                                <Award className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-bold text-lg sm:text-xl text-neutral-900 dark:text-neutral-50 break-words">
                                                {favoriteItem.name}
                                            </p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                Ordered <span className="font-bold text-amber-600 dark:text-amber-500">{favoriteItem.count}</span> time{favoriteItem.count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            {/* Receipt Dialog */}
            <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
                <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px] mx-auto max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl sm:text-2xl">Order Receipt</DialogTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setReceiptDialogOpen(false)}
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {selectedOrder && (
                            <DialogDescription className="text-left">
                                Order #{selectedOrder.orderNumber}
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6 py-4">
                            {/* Order Info */}
                            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Order Date:</span>
                                    <span className="text-sm font-medium">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Status:</span>
                                    <Badge variant="outline" className="capitalize">
                                        {selectedOrder.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Delivery Method */}
                            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {selectedOrder.deliveryMethod === 'pickup' ? (
                                        <>
                                            <ShoppingBag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            <span className="font-medium">Store Pickup</span>
                                        </>
                                    ) : (
                                        <>
                                            <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="font-medium">Delivery</span>
                                        </>
                                    )}
                                </div>

                                {selectedOrder.deliveryMethod === 'delivery' && selectedOrder.address && (
                                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                                    Delivery Address:
                                                </p>
                                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                                    {selectedOrder.address}
                                                </p>
                                                {selectedOrder.deliveryZone && (
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                        Zone: {selectedOrder.deliveryZone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Items Ordered */}
                            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                                <h3 className="font-semibold mb-3 text-neutral-900 dark:text-neutral-50">
                                    Items Ordered
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            {item.product?.image && (
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="h-12 w-12 rounded object-cover flex-shrink-0"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-neutral-900 dark:text-neutral-50 truncate">
                                                    {item.product?.name || "Product"}
                                                </p>
                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                    Qty: {item.quantity} × R{item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-medium text-sm text-neutral-900 dark:text-neutral-50">
                                                R{(item.quantity * item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Special Instructions */}
                            {selectedOrder.specialInstructions && (
                                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                                    <h3 className="font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
                                        Special Instructions
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                                        {selectedOrder.specialInstructions}
                                    </p>
                                </div>
                            )}

                            {/* Order Total */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-600 dark:text-neutral-400">Subtotal:</span>
                                    <span className="font-medium">
                                        R{selectedOrder.deliveryFee
                                            ? (selectedOrder.totalAmount - selectedOrder.deliveryFee).toFixed(2)
                                            : selectedOrder.totalAmount.toFixed(2)
                                        }
                                    </span>
                                </div>

                                {selectedOrder.deliveryFee && selectedOrder.deliveryFee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600 dark:text-neutral-400">Delivery Fee:</span>
                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                            R{selectedOrder.deliveryFee.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-200 dark:border-neutral-800">
                                    <span className="text-neutral-900 dark:text-neutral-50">Total:</span>
                                    <span className="text-amber-600 dark:text-amber-500">
                                        R{selectedOrder.totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                onClick={() => setReceiptDialogOpen(false)}
                                className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                            >
                                Close Receipt
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Profile;
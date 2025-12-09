import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, ShoppingBag, Award, Calendar, Key, Lock, ShoppingCart } from "lucide-react";
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

interface Purchase {
    id: string;
    productName: string;
    quantity: number;
    date: string;
    total?: number;
}

const Profile = () => {
    const { user, token } = useAuth();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingOrders, setFetchingOrders] = useState(true);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
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

        // Fetch user's purchases
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

                if (!res.ok) {
                    throw new Error("Failed to fetch orders");
                }

                const data = await res.json();
                
                // Ensure data is an array and has the correct structure
                if (Array.isArray(data)) {
                    setPurchases(data);
                } else {
                    console.error("Invalid orders data format:", data);
                    setPurchases([]);
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                toast({
                    title: "Error",
                    description: "Failed to fetch your purchases.",
                    variant: "destructive",
                });
                setPurchases([]);
            } finally {
                setFetchingOrders(false);
            }
        };

        fetchOrders();
    }, [user, token, navigate, toast]);

    const favoriteItem = useMemo(() => {
        return purchases.length
            ? purchases.reduce((prev, current) => (current.quantity > prev.quantity ? current : prev))
            : null;
    }, [purchases]);

    const totalItemsPurchased = useMemo(() => {
        return purchases.reduce((sum, p) => sum + p.quantity, 0);
    }, [purchases]);

    const totalItemsInCart = useMemo(() => {
        return cart.reduce((sum, c) => sum + c.quantity, 0);
    }, [cart]);

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
                                    ) : purchases.length > 0 ? (
                                        `${purchases.length} order${purchases.length !== 1 ? "s" : ""} placed`
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
                                ) : purchases.length ? (
                                    <div className="space-y-2 sm:space-y-3">
                                        {purchases.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors border border-neutral-200 dark:border-neutral-800 gap-3"
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                                        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-500" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-50 truncate">
                                                            {p.productName}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                                            Quantity: {p.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 pl-12 sm:pl-0">
                                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span className="text-xs sm:text-sm whitespace-nowrap">
                                                        {new Date(p.date).toLocaleDateString()}
                                                    </span>
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
                                        {fetchingOrders ? "..." : purchases.length}
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
                                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-500" />
                                        Most Ordered
                                    </CardTitle>
                                    <CardDescription className="dark:text-neutral-400 text-sm">
                                        Your favorite item
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                                    <div className="text-center">
                                        <div className="h-14 w-14 sm:h-16 sm:w-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 flex items-center justify-center mb-3 shadow-lg">
                                            <Award className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                                        </div>
                                        <p className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-50 mb-1 break-words">
                                            {favoriteItem.productName}
                                        </p>
                                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                                            Ordered {favoriteItem.quantity} times
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
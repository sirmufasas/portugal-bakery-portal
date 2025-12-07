import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, ShoppingBag, Award, Calendar, Key, Lock } from "lucide-react";
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
}

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        setUser(JSON.parse(storedUser));

        // Fetch user's purchases
        const token = localStorage.getItem("token");
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setPurchases(data))
            .catch(err => {
                console.error(err);
                toast({
                    title: "Error",
                    description: "Failed to fetch your purchases.",
                    variant: "destructive",
                });
            });
    }, []);

    const favoriteItem = useMemo(() => {
        return purchases.length
            ? purchases.reduce((prev, current) => (current.quantity > prev.quantity ? current : prev))
            : null;
    }, [purchases]);

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
        const token = localStorage.getItem("token");

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

            // Reset form and close dialog
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
      // Parse error safely
      const errorData = await response.json().catch(() => ({ error: "Failed to send reset email" }));
      throw new Error(errorData.error || "Failed to send reset email");
    }

    toast({
      title: "Password Reset Email Sent",
      description: "If an account exists with this email, check your inbox for the reset link.",
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

            <main className="pt-24 pb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                            {user.firstName?.charAt(0)}
                            {user.lastName?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Member since{" "}
                                {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information Card */}
                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-neutral-200 dark:border-neutral-800">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-neutral-200 dark:border-neutral-800">
                                <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-50">
                                    <User className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription className="dark:text-neutral-400">
                                    Your account details and contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                                    <User className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                                    <div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Full Name</p>
                                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                            {user.firstName} {user.lastName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                                    <Mail className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                                    <div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Email Address</p>
                                        <p className="font-medium text-neutral-900 dark:text-neutral-50">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                                    <Phone className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                                    <div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Phone Number</p>
                                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                            {user.phone || "Not Provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-3">
                                    <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700">
                                                <Key className="h-4 w-4 mr-2" />
                                                Change Password
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Change Password</DialogTitle>
                                                <DialogDescription>
                                                    Enter your current password and a new password below.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleChangePassword} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="current">Current Password</Label>
                                                    <Input
                                                        id="current"
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new">New Password</Label>
                                                    <Input
                                                        id="new"
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required
                                                        minLength={6}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm">Confirm New Password</Label>
                                                    <Input
                                                        id="confirm"
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                        minLength={6}
                                                    />
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setPasswordDialogOpen(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="bg-amber-600 hover:bg-amber-700"
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
                                    >
                                        <Lock className="h-4 w-4 mr-2" />
                                        Forgot Password?
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Purchase History Card */}
                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-neutral-200 dark:border-neutral-800">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-neutral-200 dark:border-neutral-800">
                                <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-50">
                                    <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                                    Purchase History
                                </CardTitle>
                                <CardDescription className="dark:text-neutral-400">
                                    {purchases.length > 0
                                        ? `${purchases.length} order${purchases.length !== 1 ? "s" : ""} placed`
                                        : "No orders yet"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {purchases.length ? (
                                    <div className="space-y-3">
                                        {purchases.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors border border-neutral-200 dark:border-neutral-800"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                        <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                                            {p.productName}
                                                        </p>
                                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                            Quantity: {p.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        {new Date(p.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <ShoppingBag className="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-3" />
                                        <p className="text-neutral-500 dark:text-neutral-400">No purchases yet</p>
                                        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                                            Start shopping to see your order history here
                                        </p>
                                        <Button
                                            onClick={() => navigate("/menu")}
                                            className="mt-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                                        >
                                            Start Shopping
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-neutral-200 dark:border-neutral-800">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-neutral-200 dark:border-neutral-800">
                                <CardTitle className="text-neutral-900 dark:text-neutral-50">
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/50">
                                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-500">
                                        {purchases.length}
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        Total Orders
                                    </p>
                                </div>

                                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900/50">
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-500">
                                        {purchases.reduce((sum, p) => sum + p.quantity, 0)}
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        Items Purchased
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Favorite Item Card */}
                        {favoriteItem && (
                            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-neutral-200 dark:border-neutral-800 overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"></div>
                                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                                    <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-50">
                                        <Award className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                                        Most Ordered
                                    </CardTitle>
                                    <CardDescription className="dark:text-neutral-400">
                                        Your favorite item
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 flex items-center justify-center mb-3 shadow-lg">
                                            <Award className="h-8 w-8 text-white" />
                                        </div>
                                        <p className="font-bold text-lg text-neutral-900 dark:text-neutral-50 mb-1">
                                            {favoriteItem.productName}
                                        </p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
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
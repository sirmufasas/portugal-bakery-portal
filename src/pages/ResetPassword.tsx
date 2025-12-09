import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, CheckCircle } from "lucide-react";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast({
                title: "Error",
                description: "Invalid reset link",
                variant: "destructive",
            });
            navigate("/login");
            return;
        }

        // Verify token
        fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-reset-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.valid) {
                    setTokenValid(true);
                    setUserEmail(data.email);
                } else {
                    throw new Error(data.error || "Invalid token");
                }
            })
            .catch(error => {
                toast({
                    title: "Invalid or Expired Link",
                    description: error.message || "This password reset link is invalid or has expired.",
                    variant: "destructive",
                });
                setTimeout(() => navigate("/login"), 3000);
            })
            .finally(() => setVerifying(false));
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to reset password");
            }

            setResetSuccess(true);
            toast({
                title: "Success!",
                description: "Your password has been reset successfully.",
            });

            setTimeout(() => navigate("/login"), 3000);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to reset password",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
                <Navbar />
                <div className="flex items-center justify-center pt-32">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                        <p className="text-neutral-600 dark:text-neutral-400">Verifying reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return null;
    }

    if (resetSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
                <Navbar />
                <div className="flex items-center justify-center pt-32 px-4">
                    <Card className="max-w-md w-full shadow-lg border-neutral-200 dark:border-neutral-800">
                        <CardContent className="pt-12 pb-8 text-center">
                            <div className="h-16 w-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                                Password Reset Successful!
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                Your password has been changed successfully.
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-500">
                                Redirecting to login page...
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
            <Navbar />
            <div className="flex items-center justify-center pt-32 px-4">
                <Card className="max-w-md w-full shadow-lg border-neutral-200 dark:border-neutral-800">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Lock className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                            <CardTitle className="text-2xl text-neutral-900 dark:text-neutral-50">
                                Reset Your Password
                            </CardTitle>
                        </div>
                        <CardDescription className="dark:text-neutral-400">
                            Enter a new password for {userEmail}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Enter new password"
                                    className="border-neutral-300 dark:border-neutral-700"
                                />
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Must be at least 6 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Confirm new password"
                                    className="border-neutral-300 dark:border-neutral-700"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                            >
                                {loading ? "Resetting Password..." : "Reset Password"}
                            </Button>

                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={() => navigate("/login")}
                                    className="text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-500"
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
// DummyPayment.tsx - Mock payment system for testing
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, CreditCard, Loader2 } from "lucide-react";

interface DummyPaymentProps {
    amountZAR: number;
    onSuccess: (paymentId: string) => void;
    onError?: (error: any) => void;
}

export const DummyPayment = ({
    amountZAR,
    onSuccess,
    onError,
}: DummyPaymentProps) => {
    const [processing, setProcessing] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);

    const handleDummyPayment = () => {
        setProcessing(true);

        // Simulate payment processing delay
        setTimeout(() => {
            // Generate a dummy payment ID
            const dummyPaymentId = `TEST_PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // 95% success rate, 5% failure for testing error handling
            const isSuccess = true; // always succeeds

            if (isSuccess) {
                setPaymentComplete(true);
                setProcessing(false);

                // Call success callback after a brief animation delay
                setTimeout(() => {
                    onSuccess(dummyPaymentId);
                }, 500);
            } else {
                setProcessing(false);
                const error = new Error("Payment declined (TEST)");
                onError?.(error);
            }
        }, 2000); // 2 second delay to simulate processing
    };

    if (paymentComplete) {
        return (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">
                                Payment Successful!
                            </h3>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                Processing your order...
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Test Payment
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                        ⚠️ Test Mode Active
                    </p>
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                        This is a dummy payment system for testing. No real payment will be processed.
                        Click the button below to simulate a successful payment.
                    </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Amount to Pay:</span>
                        <span className="text-2xl font-bold text-primary">
                            R{amountZAR.toFixed(2)}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Test payment will complete in ~2 seconds
                    </p>
                </div>

                <Button
                    onClick={handleDummyPayment}
                    disabled={processing}
                    className="w-full"
                    size="lg"
                >
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing Payment...
                        </>
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Complete Test Payment
                        </>
                    )}
                </Button>

                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        💳 No real payment information required
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
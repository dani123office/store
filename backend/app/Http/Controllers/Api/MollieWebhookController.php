<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Mollie\Laravel\Facades\Mollie;

class MollieWebhookController extends Controller
{
    public function __construct()
    {
        $apiKey = env('MOLLIE_API_KEY');
        if (!empty($apiKey)) {
            Mollie::api()->setApiKey($apiKey);
        }
    }

    /**
     * Handle incoming Mollie payment webhook.
     * Mollie webhooks do not send payment status in the request payload.
     * Instead, they send a payment ID, forcing the server to fetch status via Mollie API.
     * This inherently prevents payload spoofing.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function handle(Request $request)
    {
        $paymentId = $request->input('id');

        if (!$paymentId) {
            Log::warning('Mollie Webhook received without payment ID.');
            return response()->json(['error' => 'Missing ID'], 400);
        }

        try {
            // Fetch payment status directly from Mollie API
            $payment = Mollie::api()->payments()->get($paymentId);
            
            // Extract order_id from Mollie metadata
            $orderId = $payment->metadata->order_id ?? null;
            if (!$orderId) {
                Log::warning("Mollie payment {$paymentId} has no associated order metadata.");
                return response()->json(['error' => 'No order metadata found'], 422);
            }

            $order = Order::find($orderId);
            if (!$order) {
                Log::error("Order #{$orderId} referenced in Mollie payment {$paymentId} not found in database.");
                return response()->json(['error' => 'Order not found'], 404);
            }

            // Handle different Mollie payment states
            if ($payment->isPaid() && !$payment->hasRefunds() && !$payment->hasChargebacks()) {
                if ($order->orderStatus === Order::STATUS_PENDING) {
                    $order->transitionTo(Order::STATUS_CONFIRMED, null, "Mollie payment successfully verified. Transaction: {$paymentId}.");
                }
            } 
            elseif ($payment->isFailed() || $payment->isCanceled() || $payment->isExpired()) {
                if ($order->orderStatus === Order::STATUS_PENDING || $order->orderStatus === Order::STATUS_CONFIRMED) {
                    $order->transitionTo(Order::STATUS_CANCELLED, null, "Mollie payment failed/canceled/expired. Status: {$payment->status}.");
                }
            } 
            elseif ($payment->hasRefunds() || $payment->hasChargebacks()) {
                // Handle refunds / partial payments
                $amountRefunded = floatval($payment->getAmountRefunded());
                $amountTotal = floatval($payment->amount->value);

                if ($amountRefunded >= $amountTotal) {
                    // Full refund
                    if ($order->orderStatus !== Order::STATUS_REFUNDED) {
                        $order->transitionTo(Order::STATUS_REFUNDED, null, "Full refund processed via Mollie. Refunded amount: {$amountRefunded} {$payment->amount->currency}.");
                    }
                } else {
                    // Partial refund: Log in audit trail but keep order active (or custom state)
                    Log::info("Partial refund processed for Order #{$orderId}. Refunded: {$amountRefunded} / Total: {$amountTotal}");
                    
                    // Create status log entry for audit history
                    \App\Models\OrderStatusLog::create([
                        'order_id' => $order->id,
                        'from_status' => $order->orderStatus,
                        'to_status' => $order->orderStatus,
                        'comment' => "Partial refund processed via Mollie. Amount: {$amountRefunded} {$payment->amount->currency} of {$amountTotal} total.",
                    ]);
                }
            }

            return response()->noContent();

        } catch (\Exception $e) {
            Log::error("Mollie webhook handling failed for payment {$paymentId}: " . $e->getMessage());
            return response()->json(['error' => 'Webhook processing error'], 500);
        }
    }
}

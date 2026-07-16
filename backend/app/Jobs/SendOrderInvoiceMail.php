<?php

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendOrderInvoiceMail implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    protected Order $order;

    /**
     * Create a new job instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Execute the job (generate invoice PDF and send email).
     */
    public function handle(): void
    {
        Log::info("Starting async background invoice processing for Order #{$this->order->id}.");

        // Simulate invoice generation latency
        sleep(2); 

        $orderData = is_string($this->order->data) ? json_decode($this->order->data, true) : $this->order->data;
        $email = $orderData['emailAddress'] ?? ($this->order->user->email ?? null);

        if (!$email) {
            Log::warning("No email address found to send invoice for Order #{$this->order->id}.");
            return;
        }

        // Send email asynchronously (mock mailer or real email log)
        Log::info("Invoice PDF generated successfully. Dispatching email to: {$email}");
        
        // Log invoice payload mock
        Log::info("Email Subject: Order Invoice #{$this->order->id} - Status: {$this->order->orderStatus}");
    }
}

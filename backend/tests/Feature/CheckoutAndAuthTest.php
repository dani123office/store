<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Mollie\Laravel\Facades\Mollie;
use Tests\TestCase;

class CheckoutAndAuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test User Registration and Login.
     */
    public function test_user_registration_and_login(): void
    {
        // 1. Test Registration with strict password strength
        $registerData = [
            'name' => 'John',
            'lastname' => 'Doe',
            'email' => 'john@example.com',
            'password' => 'SecurePassword1', // Must contain upper, lower, and digit
        ];

        $response = $this->postJson('/api/auth/register', $registerData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id', 'name', 'lastname', 'email', 'role', 'access_token', 'refresh_token'
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'role' => 'customer'
        ]);

        // 2. Test Login
        $loginData = [
            'email' => 'john@example.com',
            'password' => 'SecurePassword1',
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id', 'name', 'lastname', 'email', 'role', 'access_token', 'refresh_token'
            ]);
    }

    /**
     * Test Checkout process with server-side validation and stock decrements.
     */
    public function test_order_checkout_flow_validation_and_stock_decrement(): void
    {
        // Create product and variant
        $product = Product::create([
            'title' => 'Test Dress',
            'price' => 100.00,
            'stock' => 10,
        ]);

        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'sku' => 'VAR-DRESS-M-BLK',
            'size' => 'M',
            'color' => 'Black',
            'price' => 120.00,
            'stock' => 5,
        ]);

        // Submit checkout request
        $checkoutData = [
            'products' => [
                [
                    'product_id' => $product->id,
                    'variant_id' => $variant->id,
                    'quantity' => 2,
                    'price' => 10.00, // Attack attempt: client-side price modification (should be ignored!)
                ]
            ],
            'data' => [
                'firstName' => 'John',
                'lastName' => 'Doe',
                'emailAddress' => 'john@example.com',
                'address' => '123 E-Commerce St',
                'city' => 'New York',
                'country' => 'USA',
            ]
        ];

        $response = $this->postJson('/api/orders', $checkoutData);

        // Assert transaction succeeded
        $response->assertStatus(201);

        // Verify server-side pricing took precedence (120.00 * 2 = 240.00)
        $this->assertEquals(240.00, $response->json('subtotal'));

        // Verify stock was atomically decremented
        $this->assertEquals(3, $variant->fresh()->stock); // 5 - 2 = 3
    }

    /**
     * Test Mollie Webhook handling for successful payments.
     */
    public function test_mollie_payment_webhook_updates_order_status(): void
    {
        // Create an order in pending state
        $order = Order::create([
            'user_id' => null,
            'subtotal' => 120.00,
            'orderStatus' => Order::STATUS_PENDING,
            'products' => json_encode([]),
            'data' => json_encode(['emailAddress' => 'customer@example.com']),
        ]);

        // Mock Mollie API calls
        $paymentMock = \Mockery::mock();
        $paymentMock->shouldReceive('isPaid')->andReturn(true);
        $paymentMock->shouldReceive('hasRefunds')->andReturn(false);
        $paymentMock->shouldReceive('hasChargebacks')->andReturn(false);
        $paymentMock->metadata = (object)['order_id' => $order->id];

        if (class_exists(\Mollie\Laravel\Facades\Mollie::class)) {
            Mollie::shouldReceive('api->payments->get')
                ->with('tr_testpayment')
                ->andReturn($paymentMock);
        } else {
            $mollieFacadeMock = \Mockery::mock('alias:Mollie\Laravel\Facades\Mollie');
            $mollieFacadeMock->shouldReceive('api->payments->get')
                ->with('tr_testpayment')
                ->andReturn($paymentMock);
        }

        // Trigger Webhook POST request
        $response = $this->postJson('/api/webhooks/mollie', [
            'id' => 'tr_testpayment'
        ]);

        $response->assertStatus(204);

        // Verify Order status transitioned to Confirmed
        $this->assertEquals(Order::STATUS_CONFIRMED, $order->fresh()->orderStatus);

        // Verify status change log was written
        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id,
            'from_status' => Order::STATUS_PENDING,
            'to_status' => Order::STATUS_CONFIRMED
        ]);
    }
}

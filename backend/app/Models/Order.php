<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $guarded = [];

    protected $casts = [
        'data' => 'array',
        'products' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function toArray()
    {
        $array = parent::toArray();
        $array['user'] = $this->user ? [
            'email' => $this->user->email,
            'id' => $this->user->id,
        ] : ($array['user'] ?? null);
        $array['products'] = is_string($array['products'] ?? null) ? json_decode($array['products'], true) : ($array['products'] ?? []);
        $array['data'] = is_string($array['data'] ?? null) ? json_decode($array['data'], true) : ($array['data'] ?? []);
        return $array;
    }
}

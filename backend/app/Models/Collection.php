<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    protected $guarded = [];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'collection_product', 'collection_id', 'product_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $primaryKey = 'cat_id';
    protected $guarded = [];

    public function subcategories()
    {
        return $this->hasMany(SubCategory::class, 'cat_id', 'cat_id');
    }
}

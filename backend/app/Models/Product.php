<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];

    protected $appends = ['category'];

    public function categoryRelation()
    {
        return $this->belongsTo(Category::class, 'category_id', 'cat_id');
    }

    public function subcategory()
    {
        return $this->belongsTo(SubCategory::class, 'subcategory_id', 'subcat_id');
    }

    public function collections()
    {
        return $this->belongsToMany(Collection::class, 'collection_product', 'product_id', 'collection_id');
    }

    public function getCategoryAttribute()
    {
        if ($this->categoryRelation) {
            return strtolower(str_replace(' ', '-', $this->categoryRelation->cat_title));
        }
        return 'uncategorized';
    }
}

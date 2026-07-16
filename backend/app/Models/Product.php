<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

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

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function colors()
    {
        return $this->hasOne(ProductColor::class, 'pro_id', 'id');
    }

    public function sizes()
    {
        return $this->hasOne(ProductSize::class, 'pro_id', 'id');
    }

    public function additionalImages()
    {
        return $this->hasOne(ProductImage::class, 'pro_id', 'id');
    }

    public function getCategoryAttribute()
    {
        if ($this->categoryRelation) {
            return strtolower(str_replace(' ', '-', $this->categoryRelation->cat_title));
        }
        return 'uncategorized';
    }
}

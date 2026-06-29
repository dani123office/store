<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductColor extends Model
{
    public $timestamps = false;
    protected $guarded = [];
    protected $primaryKey = 'color_id';
}

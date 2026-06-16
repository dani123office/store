<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    public function index()
    {
        return SubCategory::all();
    }

    public function store(Request $request)
    {
        return SubCategory::create($request->all());
    }

    public function show(SubCategory $subCategory)
    {
        return $subCategory;
    }

    public function update(Request $request, SubCategory $subCategory)
    {
        $subCategory->update($request->all());
        return $subCategory;
    }

    public function destroy(SubCategory $subCategory)
    {
        $subCategory->delete();
        return response()->noContent();
    }
}

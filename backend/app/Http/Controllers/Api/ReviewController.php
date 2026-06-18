<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;

class ReviewController extends Controller
{
    public function index()
    {
        return Review::orderBy('created_at', 'desc')->get();
    }

    public function store(\Illuminate\Http\Request $request)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required',
                'rating' => 'required|numeric|min:1|max:5',
                'review' => 'required|string',
                'username' => 'nullable|string',
                'usercity' => 'nullable|string',
            ]);

            $review = new Review();
            $review->user_id = $request->user_id ?? 1; // default to guest user 1
            $review->product_id = $validated['product_id'];
            $review->rating = $validated['rating'];
            $review->review = $validated['review'];
            $review->username = $validated['username'] ?? 'Anonymous';
            $review->usercity = $validated['usercity'] ?? 'Guest';
            $review->save();

            return response()->json($review, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}

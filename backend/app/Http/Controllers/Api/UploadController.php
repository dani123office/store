<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:5120',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
        $file->move(public_path('assets'), $filename);

        return response()->json([
            'filename' => $filename,
            'url' => '/assets/' . $filename,
        ]);
    }
}

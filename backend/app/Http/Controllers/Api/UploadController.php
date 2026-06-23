<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:3072',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
        
        $backendPath = public_path('assets');
        $file->move($backendPath, $filename);

        // Also save to frontend's public/assets directory if it exists
        $frontendPath = base_path('../public/assets');
        if (!is_dir($frontendPath)) {
            mkdir($frontendPath, 0755, true);
        }
        
        $sourceFile = $backendPath . '/' . $filename;
        $destFile = $frontendPath . '/' . $filename;
        if (file_exists($sourceFile)) {
            copy($sourceFile, $destFile);
        }

        return response()->json([
            'filename' => $filename,
            'url' => '/assets/' . $filename,
        ]);
    }
}

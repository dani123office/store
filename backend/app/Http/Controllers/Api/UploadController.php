<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:20480',
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;

        // Store in storage/app/public/assets (persistent - volume mounted to host)
        $assetsPath = storage_path('app/public/assets');
        if (!is_dir($assetsPath)) {
            mkdir($assetsPath, 0755, true);
        }
        $file->move($assetsPath, $filename);

        // Also save to frontend's public/assets directory for direct nginx serving
        $frontendPath = base_path('../public/assets');
        if (is_dir($frontendPath)) {
            $sourceFile = $assetsPath . '/' . $filename;
            $destFile = $frontendPath . '/' . $filename;
            if (file_exists($sourceFile) && is_writable($frontendPath)) {
                @copy($sourceFile, $destFile);
            }
        }

        return response()->json([
            'filename' => $filename,
            'url' => '/assets/' . $filename,
        ]);
    }
}


<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class MediaController extends Controller
{
    public function index()
    {
        // Primary: read from persistent storage (volume mounted to host)
        $assetsPath = storage_path('app/public/assets');
        $media = [];

        if (is_dir($assetsPath)) {
            $files = File::files($assetsPath);
            foreach ($files as $file) {
                $extension = strtolower($file->getExtension());
                if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])) {
                    $media[] = [
                        'id' => md5($file->getFilename()),
                        'name' => $file->getFilename(),
                        'url' => '/assets/' . $file->getFilename(),
                        'size' => $this->formatBytes($file->getSize()),
                        'time' => $file->getMTime(),
                    ];
                }
            }
        }

        // Fallback: also read from backend's public/assets
        $backendPath = public_path('assets');
        if (is_dir($backendPath)) {
            $files = File::files($backendPath);
            foreach ($files as $file) {
                $extension = strtolower($file->getExtension());
                if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])) {
                    $name = $file->getFilename();
                    $exists = false;
                    foreach ($media as $m) {
                        if ($m['name'] === $name) { $exists = true; break; }
                    }
                    if (!$exists) {
                        $media[] = [
                            'id' => md5($name),
                            'name' => $name,
                            'url' => '/assets/' . $name,
                            'size' => $this->formatBytes($file->getSize()),
                            'time' => $file->getMTime(),
                        ];
                    }
                }
            }
        }

        // Sort by time descending (newest first)
        usort($media, function ($a, $b) {
            return $b['time'] <=> $a['time'];
        });

        return response()->json($media);
    }

    public function destroy($filename)
    {
        // Sanitize filename to prevent path traversal
        $filename = basename($filename);
        if (!preg_match('/^[a-zA-Z0-9._-]+$/', $filename)) {
            return response()->json(['message' => 'Invalid filename.'], 400);
        }

        // Prevent deletion of base system assets
        $systemAssets = ['banner.jpg', 'banner1.jpg', 'luxury fashion 7 1.png', 'luxury fashion 7 2.png', '1.jpg'];
        if (in_array($filename, $systemAssets) || str_starts_with($filename, 'product image')) {
            return response()->json(['message' => 'System assets cannot be deleted.'], 403);
        }

        $persistentFile = storage_path('app/public/assets/' . $filename);
        $backendFile = public_path('assets/' . $filename);
        $frontendFile = base_path('../public/assets/' . $filename);

        $deleted = false;

        foreach ([$persistentFile, $backendFile, $frontendFile] as $path) {
            if (File::exists($path)) {
                File::delete($path);
                $deleted = true;
            }
        }

        if ($deleted) {
            return response()->json(['status' => 'success', 'message' => 'File deleted successfully.']);
        }

        return response()->json(['message' => 'File not found.'], 404);
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}


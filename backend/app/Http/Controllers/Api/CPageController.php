<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CPage;
use Illuminate\Http\Request;

class CPageController extends Controller
{
    public function index()
    {
        return CPage::all();
    }

    public function store(Request $request)
    {
        return CPage::create($request->all());
    }

    public function show(CPage $cPage)
    {
        return $cPage;
    }

    public function update(Request $request, CPage $cPage)
    {
        $cPage->update($request->all());
        return $cPage;
    }

    public function destroy(CPage $cPage)
    {
        $cPage->delete();
        return response()->noContent();
    }
}

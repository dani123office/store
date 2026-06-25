<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collection;

use Illuminate\Http\Request;

class CollectionController extends Controller
{
    public function index()
    {
        return Collection::all();
    }

    public function store(Request $request)
    {
        return Collection::create($request->all());
    }

    public function show(Collection $collection)
    {
        return $collection;
    }

    public function update(Request $request, Collection $collection)
    {
        $collection->update($request->all());
        return $collection;
    }

    public function destroy(Collection $collection)
    {
        $collection->delete();
        return response()->noContent();
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PetCategory;
use Illuminate\Http\Request;

class PetCategoryController extends Controller
{
    public function index()
    {
        $categories = PetCategory::withCount('pets')->latest()->paginate(15);
        return view('admin.pet-categories.index', compact('categories'));
    }

    public function create()
    {
        return view('admin.pet-categories.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:pet_categories',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        PetCategory::create($validated);

        return redirect()->route('admin.pet-categories.index')
            ->with('success', 'Pet category created successfully.');
    }

    public function edit(PetCategory $petCategory)
    {
        return view('admin.pet-categories.edit', compact('petCategory'));
    }

    public function update(Request $request, PetCategory $petCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:pet_categories,name,' . $petCategory->id,
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        $petCategory->update($validated);

        return redirect()->route('admin.pet-categories.index')
            ->with('success', 'Pet category updated successfully.');
    }

    public function destroy(PetCategory $petCategory)
    {
        if ($petCategory->pets()->exists()) {
            return back()->with('error', 'Cannot delete category with associated pets.');
        }

        $petCategory->delete();

        return redirect()->route('admin.pet-categories.index')
            ->with('success', 'Pet category deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers\PetOwner;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use App\Models\PetCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PetController extends Controller
{
    public function index()
    {
        $pets = auth()->user()->pets()->with('category')->latest()->get();
        return view('pet-owner.pets.index', compact('pets'));
    }

    public function create()
    {
        $categories = PetCategory::all();
        return view('pet-owner.pets.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_category_id' => 'required|exists:pet_categories,id',
            'name' => 'required|string|max:255',
            'breed' => 'nullable|string|max:100',
            'gender' => 'nullable|in:male,female',
            'date_of_birth' => 'nullable|date|before_or_equal:today',
            'weight' => 'nullable|numeric|min:0',
            'color' => 'nullable|string|max:100',
            'microchip_number' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $validated['user_id'] = auth()->id();

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('pets', 'public');
        }

        Pet::create($validated);

        return redirect()->route('pet-owner.pets.index')
            ->with('success', 'Pet added successfully.');
    }

    public function show(Pet $pet)
    {
        // Verify pet belongs to the user
        if ($pet->user_id !== auth()->id()) {
            abort(403);
        }

        $pet->load(['category', 'appointments.services', 'medicalRecords.veterinarian', 'vaccinations']);
        return view('pet-owner.pets.show', compact('pet'));
    }

    public function edit(Pet $pet)
    {
        // Verify pet belongs to the user
        if ($pet->user_id !== auth()->id()) {
            abort(403);
        }

        $categories = PetCategory::all();
        return view('pet-owner.pets.edit', compact('pet', 'categories'));
    }

    public function update(Request $request, Pet $pet)
    {
        // Verify pet belongs to the user
        if ($pet->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'pet_category_id' => 'required|exists:pet_categories,id',
            'name' => 'required|string|max:255',
            'breed' => 'nullable|string|max:100',
            'gender' => 'nullable|in:male,female',
            'date_of_birth' => 'nullable|date|before_or_equal:today',
            'weight' => 'nullable|numeric|min:0',
            'color' => 'nullable|string|max:100',
            'microchip_number' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($pet->photo) {
                Storage::disk('public')->delete($pet->photo);
            }
            $validated['photo'] = $request->file('photo')->store('pets', 'public');
        }

        $pet->update($validated);

        return redirect()->route('pet-owner.pets.index')
            ->with('success', 'Pet updated successfully.');
    }

    public function destroy(Pet $pet)
    {
        // Verify pet belongs to the user
        if ($pet->user_id !== auth()->id()) {
            abort(403);
        }

        if ($pet->photo) {
            Storage::disk('public')->delete($pet->photo);
        }

        $pet->delete();

        return redirect()->route('pet-owner.pets.index')
            ->with('success', 'Pet deleted successfully.');
    }
}

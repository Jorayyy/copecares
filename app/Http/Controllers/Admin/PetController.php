<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use App\Models\PetCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PetController extends Controller
{
    public function index(Request $request)
    {
        $pets = Pet::with(['owner', 'category'])->latest()->get();
        return view('admin.pets.index', compact('pets'));
    }

    public function create()
    {
        $categories = PetCategory::all();
        $owners = User::whereHas('role', function($q) {
            $q->where('name', 'Pet Owner');
        })->get();
        return view('admin.pets.create', compact('categories', 'owners'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
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
            $validated['photo'] = $request->file('photo')->store('pets', 'public');
        }

        Pet::create($validated);

        return redirect()->route('admin.pets.index')
            ->with('success', 'Pet added successfully.');
    }

    public function show(Pet $pet)
    {
        $pet->load(['owner', 'category', 'appointments.services', 'medicalRecords.veterinarian', 'vaccinations']);
        return view('admin.pets.show', compact('pet'));
    }

    public function edit(Pet $pet)
    {
        $categories = PetCategory::all();
        $owners = User::whereHas('role', function($q) {
            $q->where('name', 'Pet Owner');
        })->get();
        return view('admin.pets.edit', compact('pet', 'categories', 'owners'));
    }

    public function update(Request $request, Pet $pet)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
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

        return redirect()->route('admin.pets.index')
            ->with('success', 'Pet updated successfully.');
    }

    public function destroy(Pet $pet)
    {
        if ($pet->photo) {
            Storage::disk('public')->delete($pet->photo);
        }

        $pet->delete();

        return redirect()->route('admin.pets.index')
            ->with('success', 'Pet deleted successfully.');
    }
}

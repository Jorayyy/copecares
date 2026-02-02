<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\PetCategory;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::with('petCategories');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $services = $query->latest()->paginate(15);

        return view('admin.services.index', compact('services'));
    }

    public function create()
    {
        $categories = PetCategory::active()->get();
        return view('admin.services.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
            'pet_categories' => 'required|array|min:1',
            'pet_categories.*' => 'exists:pet_categories,id',
            'is_active' => 'boolean',
        ]);

        $service = Service::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'duration_minutes' => $validated['duration_minutes'],
            'is_active' => $request->boolean('is_active', true),
        ]);

        $service->petCategories()->attach($validated['pet_categories']);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    public function show(Service $service)
    {
        $service->load('petCategories');
        return view('admin.services.show', compact('service'));
    }

    public function edit(Service $service)
    {
        $categories = PetCategory::active()->get();
        $service->load('petCategories');
        return view('admin.services.edit', compact('service', 'categories'));
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
            'pet_categories' => 'required|array|min:1',
            'pet_categories.*' => 'exists:pet_categories,id',
            'is_active' => 'boolean',
        ]);

        $service->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'duration_minutes' => $validated['duration_minutes'],
            'is_active' => $request->boolean('is_active', true),
        ]);

        $service->petCategories()->sync($validated['pet_categories']);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('admin.services.index')
            ->with('success', 'Service deleted successfully.');
    }
}

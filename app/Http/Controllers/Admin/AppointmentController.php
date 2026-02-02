<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\PetCategory;
use App\Models\Service;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['user', 'pet', 'petCategory', 'services', 'veterinarian']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate('appointment_date', $request->date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('owner_name', 'like', "%{$search}%")
                  ->orWhere('pet_name', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $appointments = $query->latest('appointment_date')->paginate(15);

        return view('admin.appointments.index', compact('appointments'));
    }

    public function create()
    {
        $categories = PetCategory::active()->get();
        $services = Service::active()->get();
        $veterinarians = User::veterinarians()->active()->get();
        $petOwners = User::petOwners()->active()->with('pets')->get();

        return view('admin.appointments.create', compact('categories', 'services', 'veterinarians', 'petOwners'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'pet_id' => 'nullable|exists:pets,id',
            'owner_name' => 'required_without:user_id|nullable|string|max:255',
            'contact' => 'required_without:user_id|nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'pet_name' => 'required_without:pet_id|nullable|string|max:255',
            'pet_breed' => 'nullable|string|max:100',
            'pet_age' => 'nullable|string|max:50',
            'pet_category_id' => 'required|exists:pet_categories,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required',
            'veterinarian_id' => 'nullable|exists:users,id',
            'services' => 'required|array|min:1',
            'services.*' => 'exists:services,id',
            'reason' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
        ]);

        $appointment = Appointment::create($validated);

        // Attach services with prices
        $servicesWithPrices = [];
        foreach ($validated['services'] as $serviceId) {
            $service = Service::find($serviceId);
            $servicesWithPrices[$serviceId] = ['price' => $service->price];
        }
        $appointment->services()->attach($servicesWithPrices);

        return redirect()->route('admin.appointments.index')
            ->with('success', 'Appointment created successfully. Code: ' . $appointment->code);
    }

    public function show(Appointment $appointment)
    {
        $appointment->load(['user', 'pet', 'petCategory', 'services', 'veterinarian', 'sale', 'medicalRecord']);
        return view('admin.appointments.show', compact('appointment'));
    }

    public function edit(Appointment $appointment)
    {
        $categories = PetCategory::active()->get();
        $services = Service::active()->get();
        $veterinarians = User::veterinarians()->active()->get();
        $petOwners = User::petOwners()->active()->with('pets')->get();

        return view('admin.appointments.edit', compact('appointment', 'categories', 'services', 'veterinarians', 'petOwners'));
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'pet_id' => 'nullable|exists:pets,id',
            'owner_name' => 'required_without:user_id|nullable|string|max:255',
            'contact' => 'required_without:user_id|nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'pet_name' => 'required_without:pet_id|nullable|string|max:255',
            'pet_breed' => 'nullable|string|max:100',
            'pet_age' => 'nullable|string|max:50',
            'pet_category_id' => 'required|exists:pet_categories,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'veterinarian_id' => 'nullable|exists:users,id',
            'services' => 'required|array|min:1',
            'services.*' => 'exists:services,id',
            'reason' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|in:pending,confirmed,in_progress,completed,cancelled,no_show',
        ]);

        $appointment->update($validated);

        // Sync services with prices
        $servicesWithPrices = [];
        foreach ($validated['services'] as $serviceId) {
            $service = Service::find($serviceId);
            $servicesWithPrices[$serviceId] = ['price' => $service->price];
        }
        $appointment->services()->sync($servicesWithPrices);

        return redirect()->route('admin.appointments.show', $appointment)
            ->with('success', 'Appointment updated successfully.');
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,in_progress,completed,cancelled,no_show',
        ]);

        $appointment->update(['status' => $validated['status']]);

        return back()->with('success', 'Appointment status updated.');
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return redirect()->route('admin.appointments.index')
            ->with('success', 'Appointment deleted successfully.');
    }

    public function calendar()
    {
        return view('admin.appointments.calendar');
    }

    public function calendarEvents(Request $request)
    {
        $appointments = Appointment::with(['user', 'pet', 'petCategory', 'services', 'veterinarian'])
            ->get()
            ->map(function ($appointment) {
                $colors = [
                    'pending' => '#ffc107',
                    'confirmed' => '#17a2b8',
                    'scheduled' => '#0d6efd',
                    'in_progress' => '#ffc107',
                    'completed' => '#28a745',
                    'cancelled' => '#dc3545',
                    'no_show' => '#6c757d',
                ];

                $serviceName = $appointment->services?->first()?->name ?? 'Service';
                $petName = $appointment->pet?->name ?? $appointment->pet_name ?? 'Pet';

                return [
                    'id' => $appointment->id,
                    'title' => $petName . ' - ' . $serviceName,
                    'start' => $appointment->appointment_date_time ?? $appointment->appointment_date,
                    'status' => $appointment->status,
                    'pet' => [
                        'name' => $petName,
                    ],
                    'service' => [
                        'name' => $serviceName,
                    ],
                    'user' => [
                        'name' => $appointment->user?->name ?? $appointment->owner_name ?? 'Unknown',
                    ],
                    'veterinarian' => [
                        'name' => $appointment->veterinarian?->name ?? 'Not assigned',
                    ],
                    'notes' => $appointment->notes ?? '',
                    'backgroundColor' => $colors[$appointment->status] ?? '#6c757d',
                    'borderColor' => $colors[$appointment->status] ?? '#6c757d',
                ];
            });

        return response()->json($appointments);
    }
}

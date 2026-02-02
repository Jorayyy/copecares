<?php

namespace App\Http\Controllers\PetOwner;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\PetCategory;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::whereHas('pet', function($q) {
            $q->where('user_id', auth()->id());
        })->with(['pet', 'services', 'veterinarian'])
          ->latest()
          ->get();

        return view('pet-owner.appointments.index', compact('appointments'));
    }

    public function create()
    {
        $pets = auth()->user()->pets()->with('category')->get();
        $services = Service::where('is_active', true)->get();

        return view('pet-owner.appointments.create', compact('pets', 'services'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'time_slot' => 'required',
            'services' => 'required|array|min:1',
            'services.*' => 'exists:services,id',
            'reason' => 'nullable|string|max:1000',
        ]);

        // Verify pet belongs to user
        $pet = auth()->user()->pets()->findOrFail($validated['pet_id']);

        // Calculate total amount
        $totalAmount = Service::whereIn('id', $validated['services'])->sum('price');

        $appointment = Appointment::create([
            'pet_id' => $validated['pet_id'],
            'appointment_date' => $validated['appointment_date'],
            'time_slot' => $validated['time_slot'],
            'reason' => $validated['reason'],
            'status' => 'pending',
            'total_amount' => $totalAmount,
        ]);

        // Attach services with prices
        $servicesWithPrices = [];
        foreach ($validated['services'] as $serviceId) {
            $service = Service::find($serviceId);
            $servicesWithPrices[$serviceId] = ['price' => $service->price];
        }
        $appointment->services()->attach($servicesWithPrices);

        return redirect()->route('pet-owner.appointments.index')
            ->with('success', 'Appointment booked successfully! Please wait for confirmation.');
    }

    public function show(Appointment $appointment)
    {
        // Verify the appointment belongs to the user's pet
        $pet = auth()->user()->pets()->where('id', $appointment->pet_id)->first();
        if (!$pet) {
            abort(403);
        }

        $appointment->load(['pet.category', 'services', 'veterinarian']);
        return view('pet-owner.appointments.show', compact('appointment'));
    }

    public function cancel(Appointment $appointment)
    {
        // Verify the appointment belongs to the user's pet
        $pet = auth()->user()->pets()->where('id', $appointment->pet_id)->first();
        if (!$pet) {
            abort(403);
        }

        if (!in_array($appointment->status, ['pending', 'confirmed'])) {
            return back()->with('error', 'This appointment cannot be cancelled.');
        }

        $appointment->update(['status' => 'cancelled']);

        return back()->with('success', 'Appointment cancelled successfully.');
    }
}

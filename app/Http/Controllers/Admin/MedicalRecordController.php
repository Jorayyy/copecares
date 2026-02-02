<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use App\Models\Vaccination;
use App\Models\Pet;
use App\Models\Appointment;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = MedicalRecord::with(['pet', 'veterinarian', 'appointment']);

        if ($request->filled('pet_id')) {
            $query->where('pet_id', $request->pet_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('pet', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $records = $query->latest('record_date')->paginate(15);

        return view('admin.medical-records.index', compact('records'));
    }

    public function create(Request $request)
    {
        $pets = Pet::with('owner')->active()->get();
        $appointment = null;

        if ($request->filled('appointment_id')) {
            $appointment = Appointment::with('pet')->find($request->appointment_id);
        }

        return view('admin.medical-records.create', compact('pets', 'appointment'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'record_date' => 'required|date',
            'diagnosis' => 'nullable|string',
            'treatment' => 'nullable|string',
            'prescription' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'temperature' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'next_visit_date' => 'nullable|date|after:record_date',
            'vaccinations' => 'nullable|array',
            'vaccinations.*.vaccine_name' => 'required_with:vaccinations|string|max:255',
            'vaccinations.*.vaccination_date' => 'required_with:vaccinations|date',
            'vaccinations.*.next_due_date' => 'nullable|date',
            'vaccinations.*.batch_number' => 'nullable|string|max:100',
            'vaccinations.*.notes' => 'nullable|string',
        ]);

        $validated['veterinarian_id'] = auth()->id();

        $record = MedicalRecord::create($validated);

        // Create vaccinations if provided
        if (!empty($validated['vaccinations'])) {
            foreach ($validated['vaccinations'] as $vaccination) {
                $vaccination['pet_id'] = $validated['pet_id'];
                $vaccination['medical_record_id'] = $record->id;
                Vaccination::create($vaccination);
            }
        }

        return redirect()->route('admin.medical-records.show', $record)
            ->with('success', 'Medical record created successfully.');
    }

    public function show(MedicalRecord $medicalRecord)
    {
        $medicalRecord->load(['pet.owner', 'veterinarian', 'appointment', 'vaccinations']);
        return view('admin.medical-records.show', compact('medicalRecord'));
    }

    public function edit(MedicalRecord $medicalRecord)
    {
        $pets = Pet::with('owner')->active()->get();
        $medicalRecord->load('vaccinations');
        return view('admin.medical-records.edit', compact('medicalRecord', 'pets'));
    }

    public function update(Request $request, MedicalRecord $medicalRecord)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'record_date' => 'required|date',
            'diagnosis' => 'nullable|string',
            'treatment' => 'nullable|string',
            'prescription' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'temperature' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'next_visit_date' => 'nullable|date|after:record_date',
        ]);

        $medicalRecord->update($validated);

        return redirect()->route('admin.medical-records.show', $medicalRecord)
            ->with('success', 'Medical record updated successfully.');
    }

    public function destroy(MedicalRecord $medicalRecord)
    {
        $medicalRecord->delete();

        return redirect()->route('admin.medical-records.index')
            ->with('success', 'Medical record deleted successfully.');
    }
}

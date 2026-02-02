@extends('layouts.pet-owner')

@section('title', $pet->name)

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-12">
            <a href="{{ route('pet-owner.pets.index') }}" class="btn btn-outline-secondary">
                <i class="fas fa-arrow-left me-1"></i>Back to My Pets
            </a>
        </div>
    </div>

    <div class="row">
        <!-- Pet Profile Card -->
        <div class="col-md-4">
            <div class="card shadow">
                <div class="card-body text-center">
                    @if($pet->photo)
                        <img src="{{ Storage::url($pet->photo) }}" alt="{{ $pet->name }}" 
                             class="rounded-circle mb-3" width="150" height="150" style="object-fit: cover;">
                    @else
                        <div class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                             style="width: 150px; height: 150px;">
                            <i class="fas fa-paw fa-4x"></i>
                        </div>
                    @endif
                    
                    <h3 class="mb-1">{{ $pet->name }}</h3>
                    <p class="text-muted">
                        {{ $pet->category->name ?? 'Unknown' }} • {{ $pet->breed ?? 'Unknown Breed' }}
                    </p>
                    
                    @if($pet->gender)
                        @if($pet->gender == 'male')
                            <span class="badge bg-info fs-6 mb-3"><i class="fas fa-mars me-1"></i>Male</span>
                        @else
                            <span class="badge fs-6 mb-3" style="background-color: #e91e63;"><i class="fas fa-venus me-1"></i>Female</span>
                        @endif
                    @endif

                    <div class="d-grid gap-2 mt-3">
                        <a href="{{ route('pet-owner.pets.edit', $pet) }}" class="btn btn-warning">
                            <i class="fas fa-edit me-1"></i>Edit Pet
                        </a>
                        <a href="{{ route('pet-owner.appointments.create') }}?pet_id={{ $pet->id }}" class="btn btn-primary">
                            <i class="fas fa-calendar-plus me-1"></i>Book Appointment
                        </a>
                    </div>
                </div>
            </div>

            <!-- Pet Info Card -->
            <div class="card shadow mt-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-info-circle me-2"></i>Pet Information
                    </h5>
                </div>
                <div class="card-body">
                    <table class="table table-borderless mb-0">
                        <tr>
                            <td class="text-muted">Date of Birth</td>
                            <td class="text-end">
                                @if($pet->date_of_birth)
                                    {{ $pet->date_of_birth->format('M d, Y') }}
                                    <br><small class="text-muted">({{ $pet->date_of_birth->age }} yrs old)</small>
                                @else
                                    N/A
                                @endif
                            </td>
                        </tr>
                        <tr>
                            <td class="text-muted">Weight</td>
                            <td class="text-end">{{ $pet->weight ? $pet->weight . ' kg' : 'N/A' }}</td>
                        </tr>
                        <tr>
                            <td class="text-muted">Color</td>
                            <td class="text-end">{{ $pet->color ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <td class="text-muted">Microchip</td>
                            <td class="text-end">{{ $pet->microchip_number ?? 'N/A' }}</td>
                        </tr>
                    </table>
                    
                    @if($pet->notes)
                        <hr>
                        <p class="text-muted small mb-1">Notes:</p>
                        <p class="mb-0">{{ $pet->notes }}</p>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-md-8">
            <!-- Appointment History -->
            <div class="card shadow">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-calendar-alt me-2"></i>Appointment History
                    </h5>
                </div>
                <div class="card-body">
                    @if($pet->appointments->count() > 0)
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Services</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($pet->appointments->sortByDesc('appointment_date') as $appointment)
                                        <tr>
                                            <td>{{ $appointment->appointment_date->format('M d, Y') }}</td>
                                            <td>{{ \Carbon\Carbon::parse($appointment->time_slot)->format('h:i A') }}</td>
                                            <td>
                                                @foreach($appointment->services as $service)
                                                    <span class="badge bg-info">{{ $service->name }}</span>
                                                @endforeach
                                            </td>
                                            <td>
                                                @php
                                                    $statusColors = [
                                                        'pending' => 'warning',
                                                        'confirmed' => 'info',
                                                        'in_progress' => 'primary',
                                                        'completed' => 'success',
                                                        'cancelled' => 'danger'
                                                    ];
                                                @endphp
                                                <span class="badge bg-{{ $statusColors[$appointment->status] ?? 'secondary' }}">
                                                    {{ ucfirst(str_replace('_', ' ', $appointment->status)) }}
                                                </span>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @else
                        <div class="text-center py-4">
                            <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No appointments yet</p>
                            <a href="{{ route('pet-owner.appointments.create') }}?pet_id={{ $pet->id }}" class="btn btn-primary">
                                Book First Appointment
                            </a>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Vaccination Records -->
            <div class="card shadow mt-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-syringe me-2"></i>Vaccination Records
                    </h5>
                </div>
                <div class="card-body">
                    @if($pet->vaccinations->count() > 0)
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Vaccine</th>
                                        <th>Date Given</th>
                                        <th>Next Due</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($pet->vaccinations as $vaccination)
                                        <tr>
                                            <td>{{ $vaccination->vaccine_name }}</td>
                                            <td>{{ $vaccination->administered_date->format('M d, Y') }}</td>
                                            <td>{{ $vaccination->next_due_date ? $vaccination->next_due_date->format('M d, Y') : 'N/A' }}</td>
                                            <td>
                                                @if($vaccination->next_due_date && $vaccination->next_due_date->isPast())
                                                    <span class="badge bg-danger">Overdue</span>
                                                @elseif($vaccination->next_due_date && $vaccination->next_due_date->diffInDays(now()) <= 30)
                                                    <span class="badge bg-warning">Due Soon</span>
                                                @else
                                                    <span class="badge bg-success">Up to Date</span>
                                                @endif
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @else
                        <div class="text-center py-4">
                            <i class="fas fa-syringe fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No vaccination records yet</p>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Medical Records -->
            <div class="card shadow mt-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-file-medical me-2"></i>Medical Records
                    </h5>
                </div>
                <div class="card-body">
                    @if($pet->medicalRecords->count() > 0)
                        <div class="accordion" id="medicalRecordsAccordion">
                            @foreach($pet->medicalRecords->sortByDesc('visit_date')->take(5) as $index => $record)
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button {{ $index > 0 ? 'collapsed' : '' }}" type="button" 
                                                data-bs-toggle="collapse" data-bs-target="#record{{ $record->id }}">
                                            <strong>{{ $record->visit_date->format('M d, Y') }}</strong>
                                            <span class="ms-2 text-muted">- {{ Str::limit($record->diagnosis, 30) }}</span>
                                        </button>
                                    </h2>
                                    <div id="record{{ $record->id }}" class="accordion-collapse collapse {{ $index == 0 ? 'show' : '' }}" 
                                         data-bs-parent="#medicalRecordsAccordion">
                                        <div class="accordion-body">
                                            <p><strong>Diagnosis:</strong> {{ $record->diagnosis }}</p>
                                            @if($record->symptoms)
                                                <p><strong>Symptoms:</strong> {{ $record->symptoms }}</p>
                                            @endif
                                            @if($record->treatment)
                                                <p><strong>Treatment:</strong> {{ $record->treatment }}</p>
                                            @endif
                                            @if($record->prescription)
                                                <p><strong>Prescription:</strong> {{ $record->prescription }}</p>
                                            @endif
                                            <p class="text-muted mb-0">
                                                <small>Veterinarian: {{ $record->veterinarian->name ?? 'N/A' }}</small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-4">
                            <i class="fas fa-file-medical fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No medical records yet</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

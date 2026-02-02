@extends('layouts.admin')

@section('title', 'Pet Details')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-4">
            <!-- Pet Profile Card -->
            <div class="card">
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
                    <p class="text-muted mb-3">
                        {{ $pet->category->name ?? 'N/A' }} • {{ $pet->breed ?? 'Unknown Breed' }}
                    </p>
                    
                    <div class="mb-3">
                        @if($pet->gender == 'male')
                            <span class="badge bg-info fs-6"><i class="fas fa-mars me-1"></i>Male</span>
                        @elseif($pet->gender == 'female')
                            <span class="badge fs-6" style="background-color: #e91e63;"><i class="fas fa-venus me-1"></i>Female</span>
                        @endif
                    </div>
                    
                    <a href="{{ route('admin.pets.edit', $pet) }}" class="btn btn-warning me-2">
                        <i class="fas fa-edit me-1"></i>Edit
                    </a>
                    <a href="{{ route('admin.pets.index') }}" class="btn btn-secondary">
                        <i class="fas fa-arrow-left me-1"></i>Back
                    </a>
                </div>
            </div>

            <!-- Owner Info Card -->
            <div class="card mt-3">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-user me-2"></i>Owner Information
                    </h5>
                </div>
                <div class="card-body">
                    @if($pet->owner)
                        <p><strong>Name:</strong> {{ $pet->owner->name }}</p>
                        <p><strong>Email:</strong> {{ $pet->owner->email }}</p>
                        <p><strong>Phone:</strong> {{ $pet->owner->phone ?? 'N/A' }}</p>
                        <p><strong>Address:</strong> {{ $pet->owner->address ?? 'N/A' }}</p>
                    @else
                        <p class="text-muted">No owner assigned</p>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-md-8">
            <!-- Pet Details Card -->
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-info-circle me-2"></i>Pet Details
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="text-muted">Date of Birth</label>
                            <p class="mb-0">
                                {{ $pet->date_of_birth ? $pet->date_of_birth->format('F d, Y') : 'Not specified' }}
                                @if($pet->date_of_birth)
                                    <small class="text-muted">({{ $pet->date_of_birth->age }} years old)</small>
                                @endif
                            </p>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="text-muted">Weight</label>
                            <p class="mb-0">{{ $pet->weight ? $pet->weight . ' kg' : 'Not specified' }}</p>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="text-muted">Color</label>
                            <p class="mb-0">{{ $pet->color ?? 'Not specified' }}</p>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="text-muted">Microchip Number</label>
                            <p class="mb-0">{{ $pet->microchip_number ?? 'Not specified' }}</p>
                        </div>
                    </div>
                    
                    @if($pet->notes)
                        <div class="mt-3">
                            <label class="text-muted">Notes</label>
                            <p class="mb-0">{{ $pet->notes }}</p>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Appointments Card -->
            <div class="card mt-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-calendar-alt me-2"></i>Appointment History
                    </h5>
                    <a href="{{ route('admin.appointments.create') }}?pet_id={{ $pet->id }}" class="btn btn-primary btn-sm">
                        <i class="fas fa-plus me-1"></i>New Appointment
                    </a>
                </div>
                <div class="card-body">
                    @if($pet->appointments->count() > 0)
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Services</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($pet->appointments->sortByDesc('appointment_date')->take(5) as $appointment)
                                        <tr>
                                            <td>{{ $appointment->appointment_date->format('M d, Y') }}</td>
                                            <td>{{ \Carbon\Carbon::parse($appointment->time_slot)->format('h:i A') }}</td>
                                            <td>
                                                @foreach($appointment->services->take(2) as $service)
                                                    <span class="badge bg-info">{{ $service->name }}</span>
                                                @endforeach
                                                @if($appointment->services->count() > 2)
                                                    <span class="badge bg-secondary">+{{ $appointment->services->count() - 2 }}</span>
                                                @endif
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
                                            <td>
                                                <a href="{{ route('admin.appointments.show', $appointment) }}" class="btn btn-sm btn-info">
                                                    <i class="fas fa-eye"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @else
                        <p class="text-muted text-center mb-0">No appointments yet</p>
                    @endif
                </div>
            </div>

            <!-- Medical Records Card -->
            <div class="card mt-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-file-medical me-2"></i>Medical Records
                    </h5>
                    <a href="{{ route('admin.medical-records.create') }}?pet_id={{ $pet->id }}" class="btn btn-primary btn-sm">
                        <i class="fas fa-plus me-1"></i>Add Record
                    </a>
                </div>
                <div class="card-body">
                    @if($pet->medicalRecords->count() > 0)
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Diagnosis</th>
                                        <th>Veterinarian</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($pet->medicalRecords->sortByDesc('visit_date')->take(5) as $record)
                                        <tr>
                                            <td>{{ $record->visit_date->format('M d, Y') }}</td>
                                            <td>{{ Str::limit($record->diagnosis, 30) }}</td>
                                            <td>{{ $record->veterinarian->name ?? 'N/A' }}</td>
                                            <td>
                                                <a href="{{ route('admin.medical-records.show', $record) }}" class="btn btn-sm btn-info">
                                                    <i class="fas fa-eye"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @else
                        <p class="text-muted text-center mb-0">No medical records yet</p>
                    @endif
                </div>
            </div>

            <!-- Vaccinations Card -->
            <div class="card mt-3">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-syringe me-2"></i>Vaccination Records
                    </h5>
                </div>
                <div class="card-body">
                    @if($pet->vaccinations->count() > 0)
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Vaccine</th>
                                        <th>Date Given</th>
                                        <th>Next Due</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($pet->vaccinations->sortByDesc('administered_date') as $vaccination)
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
                        <p class="text-muted text-center mb-0">No vaccination records yet</p>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

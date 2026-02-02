@extends('layouts.pet-owner')

@section('title', 'My Appointments')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
                <h2 class="mb-0">
                    <i class="fas fa-calendar-alt me-2"></i>My Appointments
                </h2>
                <a href="{{ route('pet-owner.appointments.create') }}" class="btn btn-primary">
                    <i class="fas fa-plus me-1"></i>Book New Appointment
                </a>
            </div>
        </div>
    </div>

    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show">
            <i class="fas fa-check-circle me-2"></i>{{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    <!-- Upcoming Appointments -->
    <div class="card shadow mb-4">
        <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0">
                <i class="fas fa-clock me-2"></i>Upcoming Appointments
            </h5>
        </div>
        <div class="card-body">
            @php
                $upcoming = $appointments->filter(function($apt) {
                    return in_array($apt->status, ['pending', 'confirmed']) && 
                           $apt->appointment_date->isFuture();
                });
            @endphp
            
            @if($upcoming->count() > 0)
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Pet</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Services</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($upcoming as $appointment)
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            @if($appointment->pet->photo)
                                                <img src="{{ Storage::url($appointment->pet->photo) }}" 
                                                     class="rounded-circle me-2" width="35" height="35" style="object-fit: cover;">
                                            @else
                                                <div class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                                                     style="width: 35px; height: 35px;">
                                                    <i class="fas fa-paw small"></i>
                                                </div>
                                            @endif
                                            {{ $appointment->pet->name ?? 'N/A' }}
                                        </div>
                                    </td>
                                    <td>{{ $appointment->appointment_date->format('M d, Y') }}</td>
                                    <td>{{ \Carbon\Carbon::parse($appointment->time_slot)->format('h:i A') }}</td>
                                    <td>
                                        @foreach($appointment->services as $service)
                                            <span class="badge bg-info">{{ $service->name }}</span>
                                        @endforeach
                                    </td>
                                    <td>
                                        @if($appointment->status == 'pending')
                                            <span class="badge bg-warning">Pending</span>
                                        @elseif($appointment->status == 'confirmed')
                                            <span class="badge bg-success">Confirmed</span>
                                        @endif
                                    </td>
                                    <td>
                                        <a href="{{ route('pet-owner.appointments.show', $appointment) }}" 
                                           class="btn btn-sm btn-outline-primary">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        @if($appointment->status == 'pending')
                                            <form action="{{ route('pet-owner.appointments.cancel', $appointment) }}" 
                                                  method="POST" class="d-inline"
                                                  onsubmit="return confirm('Are you sure you want to cancel this appointment?');">
                                                @csrf
                                                @method('PATCH')
                                                <button type="submit" class="btn btn-sm btn-outline-danger">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </form>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="text-center py-4">
                    <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No upcoming appointments</p>
                    <a href="{{ route('pet-owner.appointments.create') }}" class="btn btn-primary">
                        Book an Appointment
                    </a>
                </div>
            @endif
        </div>
    </div>

    <!-- Past Appointments -->
    <div class="card shadow">
        <div class="card-header">
            <h5 class="card-title mb-0">
                <i class="fas fa-history me-2"></i>Appointment History
            </h5>
        </div>
        <div class="card-body">
            @php
                $past = $appointments->filter(function($apt) {
                    return in_array($apt->status, ['completed', 'cancelled']) || 
                           $apt->appointment_date->isPast();
                });
            @endphp
            
            @if($past->count() > 0)
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Pet</th>
                                <th>Date</th>
                                <th>Services</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($past->sortByDesc('appointment_date') as $appointment)
                                <tr>
                                    <td>{{ $appointment->pet->name ?? 'N/A' }}</td>
                                    <td>{{ $appointment->appointment_date->format('M d, Y') }}</td>
                                    <td>
                                        @foreach($appointment->services->take(2) as $service)
                                            <span class="badge bg-secondary">{{ $service->name }}</span>
                                        @endforeach
                                        @if($appointment->services->count() > 2)
                                            <span class="badge bg-dark">+{{ $appointment->services->count() - 2 }}</span>
                                        @endif
                                    </td>
                                    <td>
                                        @php
                                            $statusColors = [
                                                'completed' => 'success',
                                                'cancelled' => 'danger',
                                                'pending' => 'warning',
                                                'confirmed' => 'info',
                                                'in_progress' => 'primary'
                                            ];
                                        @endphp
                                        <span class="badge bg-{{ $statusColors[$appointment->status] ?? 'secondary' }}">
                                            {{ ucfirst($appointment->status) }}
                                        </span>
                                    </td>
                                    <td>₱{{ number_format($appointment->total_amount, 2) }}</td>
                                    <td>
                                        <a href="{{ route('pet-owner.appointments.show', $appointment) }}" 
                                           class="btn btn-sm btn-outline-primary">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="text-center py-4">
                    <i class="fas fa-history fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No appointment history yet</p>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection

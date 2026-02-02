@extends('layouts.admin')

@section('title', 'Appointment Details')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="page-title">Appointment: {{ $appointment->code }}</h1>
    <div>
        <a href="{{ route('admin.appointments.edit', $appointment) }}" class="btn btn-outline-primary">
            <i class="fas fa-edit me-2"></i>Edit
        </a>
        <a href="{{ route('admin.appointments.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Back
        </a>
    </div>
</div>

<div class="row">
    <div class="col-lg-8">
        <!-- Appointment Details -->
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="fas fa-calendar-check me-2"></i>Appointment Details</span>
                <span class="badge bg-{{ $appointment->status_badge }} fs-6">
                    {{ ucfirst(str_replace('_', ' ', $appointment->status)) }}
                </span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <table class="table table-borderless">
                            <tr>
                                <th class="text-muted" width="40%">Code:</th>
                                <td><strong>{{ $appointment->code }}</strong></td>
                            </tr>
                            <tr>
                                <th class="text-muted">Date:</th>
                                <td>{{ $appointment->appointment_date->format('F d, Y') }}</td>
                            </tr>
                            <tr>
                                <th class="text-muted">Time:</th>
                                <td>{{ \Carbon\Carbon::parse($appointment->appointment_time)->format('h:i A') }}</td>
                            </tr>
                            <tr>
                                <th class="text-muted">Veterinarian:</th>
                                <td>{{ $appointment->veterinarian ? 'Dr. ' . $appointment->veterinarian->name : 'Not Assigned' }}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <table class="table table-borderless">
                            <tr>
                                <th class="text-muted" width="40%">Created:</th>
                                <td>{{ $appointment->created_at->format('M d, Y h:i A') }}</td>
                            </tr>
                            @if($appointment->reason)
                            <tr>
                                <th class="text-muted">Reason:</th>
                                <td>{{ $appointment->reason }}</td>
                            </tr>
                            @endif
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Customer & Pet Info -->
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header">
                        <i class="fas fa-user me-2"></i>Customer Information
                    </div>
                    <div class="card-body">
                        <h5>{{ $appointment->owner_display_name }}</h5>
                        <p class="text-muted mb-1">
                            <i class="fas fa-phone me-2"></i>{{ $appointment->contact ?? $appointment->user?->phone ?? 'N/A' }}
                        </p>
                        <p class="text-muted mb-1">
                            <i class="fas fa-envelope me-2"></i>{{ $appointment->email ?? $appointment->user?->email ?? 'N/A' }}
                        </p>
                        <p class="text-muted mb-0">
                            <i class="fas fa-map-marker-alt me-2"></i>{{ $appointment->address ?? $appointment->user?->address ?? 'N/A' }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header">
                        <i class="fas fa-paw me-2"></i>Pet Information
                    </div>
                    <div class="card-body">
                        <h5>{{ $appointment->pet_display_name }}</h5>
                        <p class="text-muted mb-1">
                            <strong>Type:</strong> {{ $appointment->petCategory?->name ?? 'N/A' }}
                        </p>
                        <p class="text-muted mb-1">
                            <strong>Breed:</strong> {{ $appointment->pet_breed ?? $appointment->pet?->breed ?? 'N/A' }}
                        </p>
                        <p class="text-muted mb-0">
                            <strong>Age:</strong> {{ $appointment->pet_age ?? $appointment->pet?->age ?? 'N/A' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Services -->
        <div class="card mb-4">
            <div class="card-header">
                <i class="fas fa-concierge-bell me-2"></i>Services
            </div>
            <div class="card-body p-0">
                <table class="table mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Service</th>
                            <th class="text-end">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($appointment->services as $service)
                            <tr>
                                <td>{{ $service->name }}</td>
                                <td class="text-end">₱{{ number_format($service->pivot->price, 2) }}</td>
                            </tr>
                        @endforeach
                        <tr class="table-light">
                            <th>Total</th>
                            <th class="text-end text-success">₱{{ number_format($appointment->total_services_amount, 2) }}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Sidebar Actions -->
    <div class="col-lg-4">
        <!-- Status Update -->
        <div class="card mb-4">
            <div class="card-header">
                <i class="fas fa-tasks me-2"></i>Update Status
            </div>
            <div class="card-body">
                <form method="POST" action="{{ route('admin.appointments.update-status', $appointment) }}">
                    @csrf
                    @method('PATCH')
                    <div class="mb-3">
                        <select name="status" class="form-select">
                            <option value="pending" {{ $appointment->status == 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="confirmed" {{ $appointment->status == 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                            <option value="in_progress" {{ $appointment->status == 'in_progress' ? 'selected' : '' }}>In Progress</option>
                            <option value="completed" {{ $appointment->status == 'completed' ? 'selected' : '' }}>Completed</option>
                            <option value="cancelled" {{ $appointment->status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                            <option value="no_show" {{ $appointment->status == 'no_show' ? 'selected' : '' }}>No Show</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="fas fa-save me-2"></i>Update Status
                    </button>
                </form>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="card mb-4">
            <div class="card-header">
                <i class="fas fa-bolt me-2"></i>Quick Actions
            </div>
            <div class="card-body d-grid gap-2">
                @if(in_array($appointment->status, ['confirmed', 'in_progress', 'completed']))
                    <a href="{{ route('admin.pos.index', ['appointment_id' => $appointment->id]) }}" class="btn btn-success">
                        <i class="fas fa-cash-register me-2"></i>Process Payment
                    </a>
                @endif
                
                @if($appointment->pet_id)
                    <a href="{{ route('admin.medical-records.create', ['appointment_id' => $appointment->id]) }}" class="btn btn-info">
                        <i class="fas fa-file-medical me-2"></i>Add Medical Record
                    </a>
                @endif

                <a href="{{ route('admin.appointments.edit', $appointment) }}" class="btn btn-outline-primary">
                    <i class="fas fa-edit me-2"></i>Edit Appointment
                </a>

                <form method="POST" action="{{ route('admin.appointments.destroy', $appointment) }}" 
                      onsubmit="return confirm('Are you sure you want to delete this appointment?')">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-outline-danger w-100">
                        <i class="fas fa-trash me-2"></i>Delete Appointment
                    </button>
                </form>
            </div>
        </div>

        <!-- Sale Info if exists -->
        @if($appointment->sale)
            <div class="card">
                <div class="card-header">
                    <i class="fas fa-receipt me-2"></i>Payment Info
                </div>
                <div class="card-body">
                    <p class="mb-1"><strong>Invoice:</strong> {{ $appointment->sale->invoice_number }}</p>
                    <p class="mb-1"><strong>Total:</strong> ₱{{ number_format($appointment->sale->total_amount, 2) }}</p>
                    <p class="mb-1"><strong>Status:</strong> 
                        <span class="badge bg-{{ $appointment->sale->status_badge }}">
                            {{ ucfirst($appointment->sale->status) }}
                        </span>
                    </p>
                    <a href="{{ route('admin.pos.sales.show', $appointment->sale) }}" class="btn btn-sm btn-outline-primary mt-2">
                        View Receipt
                    </a>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection

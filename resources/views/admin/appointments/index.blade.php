@extends('layouts.admin')

@section('title', 'Appointments')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="page-title">Appointments</h1>
    <div>
        <a href="{{ route('admin.appointments.calendar') }}" class="btn btn-outline-primary me-2">
            <i class="fas fa-calendar-alt me-2"></i>Calendar View
        </a>
        <a href="{{ route('admin.appointments.create') }}" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i>New Appointment
        </a>
    </div>
</div>

<!-- Filters -->
<div class="card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ route('admin.appointments.index') }}" class="row g-3">
            <div class="col-md-3">
                <input type="text" name="search" class="form-control" placeholder="Search..." value="{{ request('search') }}">
            </div>
            <div class="col-md-2">
                <select name="status" class="form-select">
                    <option value="">All Status</option>
                    <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>Pending</option>
                    <option value="confirmed" {{ request('status') == 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                    <option value="in_progress" {{ request('status') == 'in_progress' ? 'selected' : '' }}>In Progress</option>
                    <option value="completed" {{ request('status') == 'completed' ? 'selected' : '' }}>Completed</option>
                    <option value="cancelled" {{ request('status') == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                </select>
            </div>
            <div class="col-md-2">
                <input type="date" name="date" class="form-control" value="{{ request('date') }}">
            </div>
            <div class="col-md-2">
                <button type="submit" class="btn btn-secondary w-100">
                    <i class="fas fa-filter me-2"></i>Filter
                </button>
            </div>
            <div class="col-md-2">
                <a href="{{ route('admin.appointments.index') }}" class="btn btn-outline-secondary w-100">Clear</a>
            </div>
        </form>
    </div>
</div>

<!-- Appointments Table -->
<div class="card">
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Code</th>
                        <th>Date & Time</th>
                        <th>Pet Owner</th>
                        <th>Pet</th>
                        <th>Services</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($appointments as $appointment)
                        <tr>
                            <td><span class="fw-semibold">{{ $appointment->code }}</span></td>
                            <td>
                                {{ $appointment->appointment_date->format('M d, Y') }}<br>
                                <small class="text-muted">{{ \Carbon\Carbon::parse($appointment->appointment_time)->format('h:i A') }}</small>
                            </td>
                            <td>
                                {{ $appointment->owner_display_name }}<br>
                                <small class="text-muted">{{ $appointment->contact ?? $appointment->user?->phone }}</small>
                            </td>
                            <td>
                                {{ $appointment->pet_display_name }}<br>
                                <small class="text-muted">{{ $appointment->petCategory?->name }}</small>
                            </td>
                            <td>
                                @foreach($appointment->services->take(2) as $service)
                                    <span class="badge bg-light text-dark">{{ $service->name }}</span>
                                @endforeach
                                @if($appointment->services->count() > 2)
                                    <span class="badge bg-secondary">+{{ $appointment->services->count() - 2 }}</span>
                                @endif
                            </td>
                            <td>
                                <span class="badge bg-{{ $appointment->status_badge }}">
                                    {{ ucfirst(str_replace('_', ' ', $appointment->status)) }}
                                </span>
                            </td>
                            <td>
                                <div class="btn-group btn-group-sm">
                                    <a href="{{ route('admin.appointments.show', $appointment) }}" class="btn btn-outline-primary" title="View">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <a href="{{ route('admin.appointments.edit', $appointment) }}" class="btn btn-outline-secondary" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    @if(in_array($appointment->status, ['confirmed', 'in_progress']))
                                        <a href="{{ route('admin.pos.index', ['appointment_id' => $appointment->id]) }}" class="btn btn-outline-success" title="Process Payment">
                                            <i class="fas fa-cash-register"></i>
                                        </a>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center py-4 text-muted">No appointments found</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    @if($appointments->hasPages())
        <div class="card-footer">
            {{ $appointments->links() }}
        </div>
    @endif
</div>
@endsection

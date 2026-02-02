@extends('layouts.pet-owner')

@section('title', 'Dashboard')

@section('content')
<div class="container-fluid">
    <!-- Welcome Section -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card bg-primary text-white">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h3 class="mb-1">Welcome back, {{ auth()->user()->name }}! 👋</h3>
                            <p class="mb-0">Here's what's happening with your pets today.</p>
                        </div>
                        <div>
                            <a href="{{ route('pet-owner.appointments.create') }}" class="btn btn-warning">
                                <i class="fas fa-calendar-plus me-2"></i>Book Appointment
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted mb-1">My Pets</h6>
                            <h2 class="mb-0">{{ $petsCount }}</h2>
                        </div>
                        <div class="bg-primary bg-opacity-10 p-3 rounded">
                            <i class="fas fa-paw fa-2x text-primary"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted mb-1">Total Appointments</h6>
                            <h2 class="mb-0">{{ $totalAppointments }}</h2>
                        </div>
                        <div class="bg-success bg-opacity-10 p-3 rounded">
                            <i class="fas fa-calendar-check fa-2x text-success"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted mb-1">Upcoming</h6>
                            <h2 class="mb-0">{{ $upcomingAppointments }}</h2>
                        </div>
                        <div class="bg-warning bg-opacity-10 p-3 rounded">
                            <i class="fas fa-clock fa-2x text-warning"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted mb-1">Completed</h6>
                            <h2 class="mb-0">{{ $completedAppointments }}</h2>
                        </div>
                        <div class="bg-info bg-opacity-10 p-3 rounded">
                            <i class="fas fa-check-circle fa-2x text-info"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <!-- My Pets Section -->
        <div class="col-md-6 mb-4">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-paw me-2"></i>My Pets
                    </h5>
                    <a href="{{ route('pet-owner.pets.create') }}" class="btn btn-primary btn-sm">
                        <i class="fas fa-plus me-1"></i>Add Pet
                    </a>
                </div>
                <div class="card-body">
                    @if($pets->count() > 0)
                        <div class="list-group list-group-flush">
                            @foreach($pets as $pet)
                                <div class="list-group-item d-flex align-items-center px-0">
                                    @if($pet->photo)
                                        <img src="{{ Storage::url($pet->photo) }}" alt="{{ $pet->name }}" 
                                             class="rounded-circle me-3" width="50" height="50" style="object-fit: cover;">
                                    @else
                                        <div class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                             style="width: 50px; height: 50px;">
                                            <i class="fas fa-paw"></i>
                                        </div>
                                    @endif
                                    <div class="flex-grow-1">
                                        <h6 class="mb-0">{{ $pet->name }}</h6>
                                        <small class="text-muted">
                                            {{ $pet->category->name ?? 'N/A' }} • {{ $pet->breed ?? 'Unknown' }}
                                        </small>
                                    </div>
                                    <a href="{{ route('pet-owner.pets.show', $pet) }}" class="btn btn-outline-primary btn-sm">
                                        View
                                    </a>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-4">
                            <i class="fas fa-paw fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No pets registered yet</p>
                            <a href="{{ route('pet-owner.pets.create') }}" class="btn btn-primary">
                                <i class="fas fa-plus me-1"></i>Add Your First Pet
                            </a>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Upcoming Appointments Section -->
        <div class="col-md-6 mb-4">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-calendar-alt me-2"></i>Upcoming Appointments
                    </h5>
                    <a href="{{ route('pet-owner.appointments.index') }}" class="btn btn-outline-primary btn-sm">
                        View All
                    </a>
                </div>
                <div class="card-body">
                    @if($appointments->count() > 0)
                        <div class="list-group list-group-flush">
                            @foreach($appointments as $appointment)
                                <div class="list-group-item px-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 class="mb-1">{{ $appointment->pet->name ?? 'N/A' }}</h6>
                                            <small class="text-muted">
                                                <i class="fas fa-calendar me-1"></i>
                                                {{ $appointment->appointment_date->format('M d, Y') }}
                                                <i class="fas fa-clock ms-2 me-1"></i>
                                                {{ \Carbon\Carbon::parse($appointment->time_slot)->format('h:i A') }}
                                            </small>
                                            <div class="mt-1">
                                                @foreach($appointment->services->take(2) as $service)
                                                    <span class="badge bg-info">{{ $service->name }}</span>
                                                @endforeach
                                            </div>
                                        </div>
                                        <span class="badge bg-{{ $appointment->status == 'confirmed' ? 'success' : 'warning' }}">
                                            {{ ucfirst($appointment->status) }}
                                        </span>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-4">
                            <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No upcoming appointments</p>
                            <a href="{{ route('pet-owner.appointments.create') }}" class="btn btn-primary">
                                <i class="fas fa-plus me-1"></i>Book an Appointment
                            </a>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Activity / Quick Actions -->
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-bolt me-2"></i>Quick Actions
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row text-center">
                        <div class="col-md-3 mb-3 mb-md-0">
                            <a href="{{ route('pet-owner.appointments.create') }}" class="text-decoration-none">
                                <div class="p-3 bg-light rounded">
                                    <i class="fas fa-calendar-plus fa-2x text-primary mb-2"></i>
                                    <p class="mb-0 text-dark">Book Appointment</p>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-3 mb-3 mb-md-0">
                            <a href="{{ route('pet-owner.pets.create') }}" class="text-decoration-none">
                                <div class="p-3 bg-light rounded">
                                    <i class="fas fa-paw fa-2x text-success mb-2"></i>
                                    <p class="mb-0 text-dark">Add New Pet</p>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-3 mb-3 mb-md-0">
                            <a href="{{ route('pet-owner.appointments.index') }}" class="text-decoration-none">
                                <div class="p-3 bg-light rounded">
                                    <i class="fas fa-history fa-2x text-warning mb-2"></i>
                                    <p class="mb-0 text-dark">View History</p>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-3">
                            <a href="{{ route('pet-owner.profile.edit') }}" class="text-decoration-none">
                                <div class="p-3 bg-light rounded">
                                    <i class="fas fa-user-cog fa-2x text-info mb-2"></i>
                                    <p class="mb-0 text-dark">Edit Profile</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

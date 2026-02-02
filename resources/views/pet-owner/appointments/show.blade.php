@extends('layouts.pet-owner')

@section('title', 'Appointment Details')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-12">
            <a href="{{ route('pet-owner.appointments.index') }}" class="btn btn-outline-secondary">
                <i class="fas fa-arrow-left me-1"></i>Back to Appointments
            </a>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card shadow">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-calendar-check me-2"></i>Appointment #{{ $appointment->id }}
                        </h5>
                        @php
                            $statusColors = [
                                'pending' => 'warning',
                                'confirmed' => 'info',
                                'in_progress' => 'primary',
                                'completed' => 'success',
                                'cancelled' => 'danger'
                            ];
                        @endphp
                        <span class="badge bg-{{ $statusColors[$appointment->status] ?? 'secondary' }} fs-6">
                            {{ ucfirst(str_replace('_', ' ', $appointment->status)) }}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <h6 class="text-muted">Date & Time</h6>
                            <p class="fs-5 mb-0">
                                <i class="fas fa-calendar me-2 text-primary"></i>
                                {{ $appointment->appointment_date->format('l, F d, Y') }}
                            </p>
                            <p class="fs-5">
                                <i class="fas fa-clock me-2 text-primary"></i>
                                {{ \Carbon\Carbon::parse($appointment->time_slot)->format('h:i A') }}
                            </p>
                        </div>
                        <div class="col-md-6">
                            <h6 class="text-muted">Veterinarian</h6>
                            <p class="fs-5">
                                <i class="fas fa-user-md me-2 text-primary"></i>
                                {{ $appointment->veterinarian ? 'Dr. ' . $appointment->veterinarian->name : 'To be assigned' }}
                            </p>
                        </div>
                    </div>

                    <hr>

                    <h6 class="text-muted mb-3">Services</h6>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th class="text-end">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($appointment->services as $service)
                                    <tr>
                                        <td>
                                            <strong>{{ $service->name }}</strong>
                                            @if($service->description)
                                                <br><small class="text-muted">{{ $service->description }}</small>
                                            @endif
                                        </td>
                                        <td class="text-end">₱{{ number_format($service->price, 2) }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                    <th class="text-end text-primary fs-5">₱{{ number_format($appointment->total_amount, 2) }}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    @if($appointment->reason)
                        <hr>
                        <h6 class="text-muted">Reason / Notes</h6>
                        <p>{{ $appointment->reason }}</p>
                    @endif

                    @if($appointment->notes)
                        <hr>
                        <h6 class="text-muted">Staff Notes</h6>
                        <p>{{ $appointment->notes }}</p>
                    @endif

                    @if($appointment->status == 'pending')
                        <hr>
                        <div class="d-flex gap-2">
                            <form action="{{ route('pet-owner.appointments.cancel', $appointment) }}" 
                                  method="POST"
                                  onsubmit="return confirm('Are you sure you want to cancel this appointment?');">
                                @csrf
                                @method('PATCH')
                                <button type="submit" class="btn btn-danger">
                                    <i class="fas fa-times me-1"></i>Cancel Appointment
                                </button>
                            </form>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <!-- Pet Info Card -->
            <div class="card shadow">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-paw me-2"></i>Pet Information
                    </h5>
                </div>
                <div class="card-body text-center">
                    @if($appointment->pet)
                        @if($appointment->pet->photo)
                            <img src="{{ Storage::url($appointment->pet->photo) }}" 
                                 alt="{{ $appointment->pet->name }}" 
                                 class="rounded-circle mb-3" width="100" height="100" style="object-fit: cover;">
                        @else
                            <div class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                                 style="width: 100px; height: 100px;">
                                <i class="fas fa-paw fa-2x"></i>
                            </div>
                        @endif
                        <h5 class="mb-1">{{ $appointment->pet->name }}</h5>
                        <p class="text-muted mb-2">
                            {{ $appointment->pet->category->name ?? 'N/A' }} • {{ $appointment->pet->breed ?? 'Unknown' }}
                        </p>
                        @if($appointment->pet->date_of_birth)
                            <p class="small text-muted">
                                <i class="fas fa-birthday-cake me-1"></i>{{ $appointment->pet->date_of_birth->age }} years old
                            </p>
                        @endif
                        <a href="{{ route('pet-owner.pets.show', $appointment->pet) }}" class="btn btn-outline-primary btn-sm">
                            View Pet Profile
                        </a>
                    @else
                        <p class="text-muted">Pet information not available</p>
                    @endif
                </div>
            </div>

            <!-- Payment Status Card -->
            <div class="card shadow mt-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-credit-card me-2"></i>Payment Status
                    </h5>
                </div>
                <div class="card-body text-center">
                    @if($appointment->payment_status == 'paid')
                        <div class="text-success mb-2">
                            <i class="fas fa-check-circle fa-3x"></i>
                        </div>
                        <h5 class="text-success">Paid</h5>
                    @elseif($appointment->payment_status == 'partial')
                        <div class="text-warning mb-2">
                            <i class="fas fa-exclamation-circle fa-3x"></i>
                        </div>
                        <h5 class="text-warning">Partially Paid</h5>
                    @else
                        <div class="text-muted mb-2">
                            <i class="fas fa-clock fa-3x"></i>
                        </div>
                        <h5 class="text-muted">Unpaid</h5>
                        <p class="small text-muted">Payment will be collected at the clinic</p>
                    @endif
                </div>
            </div>

            <!-- Clinic Info Card -->
            <div class="card shadow mt-4">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-hospital me-2"></i>Clinic Information
                    </h5>
                </div>
                <div class="card-body">
                    <p class="mb-2">
                        <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                        123 Pet Care Street, Tacloban City
                    </p>
                    <p class="mb-2">
                        <i class="fas fa-phone me-2 text-primary"></i>
                        (053) 123-4567
                    </p>
                    <p class="mb-0">
                        <i class="fas fa-clock me-2 text-primary"></i>
                        Mon-Sat: 8AM - 6PM
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

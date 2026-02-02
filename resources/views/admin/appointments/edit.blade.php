@extends('layouts.admin')

@section('title', 'Edit Appointment')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-edit me-2"></i>Edit Appointment #{{ $appointment->id }}
                    </h3>
                    <div class="card-tools">
                        <a href="{{ route('admin.appointments.index') }}" class="btn btn-secondary btn-sm">
                            <i class="fas fa-arrow-left me-1"></i>Back
                        </a>
                    </div>
                </div>

                <form action="{{ route('admin.appointments.update', $appointment) }}" method="POST">
                    @csrf
                    @method('PUT')
                    
                    <div class="card-body">
                        @if($errors->any())
                            <div class="alert alert-danger">
                                <ul class="mb-0">
                                    @foreach($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="pet_id" class="form-label">Pet <span class="text-danger">*</span></label>
                                    <select name="pet_id" id="pet_id" class="form-select @error('pet_id') is-invalid @enderror" required>
                                        <option value="">Select Pet</option>
                                        @foreach($pets as $pet)
                                            <option value="{{ $pet->id }}" {{ old('pet_id', $appointment->pet_id) == $pet->id ? 'selected' : '' }}>
                                                {{ $pet->name }} - {{ $pet->owner->name ?? 'No Owner' }} ({{ $pet->category->name ?? 'N/A' }})
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('pet_id')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="veterinarian_id" class="form-label">Veterinarian</label>
                                    <select name="veterinarian_id" id="veterinarian_id" class="form-select @error('veterinarian_id') is-invalid @enderror">
                                        <option value="">Select Veterinarian</option>
                                        @foreach($veterinarians as $vet)
                                            <option value="{{ $vet->id }}" {{ old('veterinarian_id', $appointment->veterinarian_id) == $vet->id ? 'selected' : '' }}>
                                                Dr. {{ $vet->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('veterinarian_id')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="appointment_date" class="form-label">Date <span class="text-danger">*</span></label>
                                    <input type="date" name="appointment_date" id="appointment_date" 
                                           class="form-control @error('appointment_date') is-invalid @enderror"
                                           value="{{ old('appointment_date', $appointment->appointment_date->format('Y-m-d')) }}" required>
                                    @error('appointment_date')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="time_slot" class="form-label">Time Slot <span class="text-danger">*</span></label>
                                    <select name="time_slot" id="time_slot" class="form-select @error('time_slot') is-invalid @enderror" required>
                                        <option value="">Select Time</option>
                                        @php
                                            $timeSlots = [
                                                '08:00' => '8:00 AM',
                                                '09:00' => '9:00 AM',
                                                '10:00' => '10:00 AM',
                                                '11:00' => '11:00 AM',
                                                '13:00' => '1:00 PM',
                                                '14:00' => '2:00 PM',
                                                '15:00' => '3:00 PM',
                                                '16:00' => '4:00 PM',
                                                '17:00' => '5:00 PM',
                                            ];
                                        @endphp
                                        @foreach($timeSlots as $value => $label)
                                            <option value="{{ $value }}" {{ old('time_slot', $appointment->time_slot) == $value ? 'selected' : '' }}>
                                                {{ $label }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('time_slot')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-3">
                            <label class="form-label">Services</label>
                            <div class="row">
                                @foreach($services as $service)
                                    <div class="col-md-4">
                                        <div class="form-check">
                                            <input type="checkbox" name="services[]" value="{{ $service->id }}" 
                                                   class="form-check-input" id="service_{{ $service->id }}"
                                                   {{ in_array($service->id, old('services', $appointment->services->pluck('id')->toArray())) ? 'checked' : '' }}>
                                            <label class="form-check-label" for="service_{{ $service->id }}">
                                                {{ $service->name }} - ₱{{ number_format($service->price, 2) }}
                                            </label>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="status" class="form-label">Status <span class="text-danger">*</span></label>
                                    <select name="status" id="status" class="form-select @error('status') is-invalid @enderror" required>
                                        <option value="pending" {{ old('status', $appointment->status) == 'pending' ? 'selected' : '' }}>Pending</option>
                                        <option value="confirmed" {{ old('status', $appointment->status) == 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                                        <option value="in_progress" {{ old('status', $appointment->status) == 'in_progress' ? 'selected' : '' }}>In Progress</option>
                                        <option value="completed" {{ old('status', $appointment->status) == 'completed' ? 'selected' : '' }}>Completed</option>
                                        <option value="cancelled" {{ old('status', $appointment->status) == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                                    </select>
                                    @error('status')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="payment_status" class="form-label">Payment Status</label>
                                    <select name="payment_status" id="payment_status" class="form-select @error('payment_status') is-invalid @enderror">
                                        <option value="unpaid" {{ old('payment_status', $appointment->payment_status) == 'unpaid' ? 'selected' : '' }}>Unpaid</option>
                                        <option value="partial" {{ old('payment_status', $appointment->payment_status) == 'partial' ? 'selected' : '' }}>Partial</option>
                                        <option value="paid" {{ old('payment_status', $appointment->payment_status) == 'paid' ? 'selected' : '' }}>Paid</option>
                                    </select>
                                    @error('payment_status')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-3">
                            <label for="reason" class="form-label">Reason / Notes</label>
                            <textarea name="reason" id="reason" rows="3" 
                                      class="form-control @error('reason') is-invalid @enderror"
                                      placeholder="Describe the reason for visit...">{{ old('reason', $appointment->reason) }}</textarea>
                            @error('reason')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group mb-3">
                            <label for="notes" class="form-label">Additional Notes</label>
                            <textarea name="notes" id="notes" rows="2" 
                                      class="form-control @error('notes') is-invalid @enderror"
                                      placeholder="Any additional notes...">{{ old('notes', $appointment->notes) }}</textarea>
                            @error('notes')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save me-1"></i>Update Appointment
                        </button>
                        <a href="{{ route('admin.appointments.index') }}" class="btn btn-secondary">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

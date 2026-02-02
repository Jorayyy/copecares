@extends('layouts.pet-owner')

@section('title', 'Book Appointment')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card shadow">
                <div class="card-header bg-primary text-white">
                    <h4 class="card-title mb-0">
                        <i class="fas fa-calendar-plus me-2"></i>Book New Appointment
                    </h4>
                </div>

                <form action="{{ route('pet-owner.appointments.store') }}" method="POST">
                    @csrf
                    
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

                        @if($pets->count() == 0)
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                You need to register a pet first before booking an appointment.
                                <a href="{{ route('pet-owner.pets.create') }}" class="alert-link">Add a pet now</a>
                            </div>
                        @endif

                        <div class="form-group mb-4">
                            <label for="pet_id" class="form-label">Select Pet <span class="text-danger">*</span></label>
                            <select name="pet_id" id="pet_id" class="form-select @error('pet_id') is-invalid @enderror" required>
                                <option value="">Choose a pet...</option>
                                @foreach($pets as $pet)
                                    <option value="{{ $pet->id }}" {{ old('pet_id', request('pet_id')) == $pet->id ? 'selected' : '' }}>
                                        {{ $pet->name }} ({{ $pet->category->name ?? 'N/A' }})
                                    </option>
                                @endforeach
                            </select>
                            @error('pet_id')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label for="appointment_date" class="form-label">Preferred Date <span class="text-danger">*</span></label>
                                    <input type="date" name="appointment_date" id="appointment_date" 
                                           class="form-control @error('appointment_date') is-invalid @enderror"
                                           value="{{ old('appointment_date') }}" 
                                           min="{{ date('Y-m-d', strtotime('+1 day')) }}" required>
                                    @error('appointment_date')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                    <small class="text-muted">Appointments available Monday - Saturday</small>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label for="time_slot" class="form-label">Preferred Time <span class="text-danger">*</span></label>
                                    <select name="time_slot" id="time_slot" class="form-select @error('time_slot') is-invalid @enderror" required>
                                        <option value="">Choose a time...</option>
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
                                            <option value="{{ $value }}" {{ old('time_slot') == $value ? 'selected' : '' }}>
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

                        <div class="form-group mb-4">
                            <label class="form-label">Select Services <span class="text-danger">*</span></label>
                            <div class="row">
                                @foreach($services as $service)
                                    <div class="col-md-6">
                                        <div class="form-check mb-2 p-3 border rounded {{ in_array($service->id, old('services', [])) ? 'bg-primary bg-opacity-10 border-primary' : '' }}">
                                            <input type="checkbox" name="services[]" value="{{ $service->id }}" 
                                                   class="form-check-input service-checkbox" 
                                                   id="service_{{ $service->id }}"
                                                   data-price="{{ $service->price }}"
                                                   {{ in_array($service->id, old('services', [])) ? 'checked' : '' }}>
                                            <label class="form-check-label w-100" for="service_{{ $service->id }}">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>{{ $service->name }}</strong>
                                                        @if($service->description)
                                                            <br><small class="text-muted">{{ Str::limit($service->description, 50) }}</small>
                                                        @endif
                                                    </div>
                                                    <span class="badge bg-success">₱{{ number_format($service->price, 2) }}</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                            @error('services')
                                <div class="text-danger small mt-1">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="reason" class="form-label">Reason / Notes</label>
                            <textarea name="reason" id="reason" rows="3" 
                                      class="form-control @error('reason') is-invalid @enderror"
                                      placeholder="Describe the reason for your visit or any special concerns...">{{ old('reason') }}</textarea>
                            @error('reason')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Estimated Total -->
                        <div class="card bg-light mb-3">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0">Estimated Total:</h5>
                                    <h4 class="mb-0 text-primary" id="totalAmount">₱0.00</h4>
                                </div>
                            </div>
                        </div>

                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Your appointment will be confirmed by our staff. You will receive a notification once confirmed.
                        </div>
                    </div>

                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary btn-lg" {{ $pets->count() == 0 ? 'disabled' : '' }}>
                            <i class="fas fa-calendar-check me-1"></i>Book Appointment
                        </button>
                        <a href="{{ route('pet-owner.appointments.index') }}" class="btn btn-secondary btn-lg">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
$(document).ready(function() {
    function calculateTotal() {
        let total = 0;
        $('.service-checkbox:checked').each(function() {
            total += parseFloat($(this).data('price'));
        });
        $('#totalAmount').text('₱' + total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    }
    
    $('.service-checkbox').change(function() {
        const parent = $(this).closest('.form-check');
        if ($(this).is(':checked')) {
            parent.addClass('bg-primary bg-opacity-10 border-primary');
        } else {
            parent.removeClass('bg-primary bg-opacity-10 border-primary');
        }
        calculateTotal();
    });
    
    calculateTotal();
});
</script>
@endpush
@endsection

@extends('layouts.admin')

@section('title', 'Create Appointment')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="page-title">Create Appointment</h1>
    <a href="{{ route('admin.appointments.index') }}" class="btn btn-outline-secondary">
        <i class="fas fa-arrow-left me-2"></i>Back
    </a>
</div>

<div class="card">
    <div class="card-body">
        <form method="POST" action="{{ route('admin.appointments.store') }}" id="appointmentForm">
            @csrf
            
            <div class="row">
                <!-- Customer Information -->
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="fas fa-user me-2"></i>Customer Information</h5>
                    
                    <div class="mb-3">
                        <label class="form-label">Registered Pet Owner</label>
                        <select name="user_id" id="user_id" class="form-select">
                            <option value="">-- Select or Enter Walk-in --</option>
                            @foreach($petOwners as $owner)
                                <option value="{{ $owner->id }}" data-pets="{{ json_encode($owner->pets) }}">
                                    {{ $owner->name }} - {{ $owner->email }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div id="walkInFields">
                        <div class="mb-3">
                            <label for="owner_name" class="form-label">Owner Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="owner_name" name="owner_name" value="{{ old('owner_name') }}">
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="contact" class="form-label">Contact Number <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="contact" name="contact" value="{{ old('contact') }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" name="email" value="{{ old('email') }}">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="address" class="form-label">Address</label>
                            <textarea class="form-control" id="address" name="address" rows="2">{{ old('address') }}</textarea>
                        </div>
                    </div>
                </div>

                <!-- Pet Information -->
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="fas fa-paw me-2"></i>Pet Information</h5>

                    <div class="mb-3" id="registeredPetField" style="display: none;">
                        <label class="form-label">Select Pet</label>
                        <select name="pet_id" id="pet_id" class="form-select">
                            <option value="">-- Select Pet --</option>
                        </select>
                    </div>

                    <div id="walkInPetFields">
                        <div class="mb-3">
                            <label for="pet_category_id" class="form-label">Pet Type <span class="text-danger">*</span></label>
                            <select name="pet_category_id" id="pet_category_id" class="form-select" required>
                                <option value="">-- Select Type --</option>
                                @foreach($categories as $category)
                                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="pet_name" class="form-label">Pet Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="pet_name" name="pet_name" value="{{ old('pet_name') }}">
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="pet_breed" class="form-label">Breed</label>
                                <input type="text" class="form-control" id="pet_breed" name="pet_breed" value="{{ old('pet_breed') }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="pet_age" class="form-label">Age</label>
                                <input type="text" class="form-control" id="pet_age" name="pet_age" value="{{ old('pet_age') }}" placeholder="e.g., 2 years">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="my-4">

            <div class="row">
                <!-- Appointment Details -->
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="fas fa-calendar me-2"></i>Appointment Details</h5>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="appointment_date" class="form-label">Date <span class="text-danger">*</span></label>
                            <input type="date" class="form-control" id="appointment_date" name="appointment_date" 
                                   value="{{ old('appointment_date', date('Y-m-d')) }}" min="{{ date('Y-m-d') }}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="appointment_time" class="form-label">Time <span class="text-danger">*</span></label>
                            <input type="time" class="form-control" id="appointment_time" name="appointment_time" 
                                   value="{{ old('appointment_time', '09:00') }}" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="veterinarian_id" class="form-label">Assign Veterinarian</label>
                        <select name="veterinarian_id" id="veterinarian_id" class="form-select">
                            <option value="">-- Auto Assign --</option>
                            @foreach($veterinarians as $vet)
                                <option value="{{ $vet->id }}">Dr. {{ $vet->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="reason" class="form-label">Reason for Visit</label>
                        <textarea class="form-control" id="reason" name="reason" rows="3">{{ old('reason') }}</textarea>
                    </div>
                </div>

                <!-- Services -->
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="fas fa-concierge-bell me-2"></i>Services <span class="text-danger">*</span></h5>

                    <div class="border rounded p-3" style="max-height: 300px; overflow-y: auto;">
                        @foreach($services as $service)
                            <div class="form-check mb-2">
                                <input class="form-check-input service-checkbox" type="checkbox" name="services[]" 
                                       value="{{ $service->id }}" id="service_{{ $service->id }}"
                                       data-price="{{ $service->price }}"
                                       data-categories="{{ $service->petCategories->pluck('id')->join(',') }}">
                                <label class="form-check-label d-flex justify-content-between w-100" for="service_{{ $service->id }}">
                                    <span>{{ $service->name }}</span>
                                    <span class="text-success">₱{{ number_format($service->price, 2) }}</span>
                                </label>
                            </div>
                        @endforeach
                    </div>

                    <div class="mt-3 p-3 bg-light rounded">
                        <div class="d-flex justify-content-between">
                            <strong>Estimated Total:</strong>
                            <strong class="text-success" id="totalAmount">₱0.00</strong>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="my-4">

            <div class="d-flex justify-content-end gap-2">
                <a href="{{ route('admin.appointments.index') }}" class="btn btn-outline-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>Create Appointment
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const userSelect = document.getElementById('user_id');
    const petSelect = document.getElementById('pet_id');
    const walkInFields = document.getElementById('walkInFields');
    const walkInPetFields = document.getElementById('walkInPetFields');
    const registeredPetField = document.getElementById('registeredPetField');
    const petCategorySelect = document.getElementById('pet_category_id');
    const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
    const totalAmountEl = document.getElementById('totalAmount');

    // Handle user selection
    userSelect.addEventListener('change', function() {
        if (this.value) {
            walkInFields.style.display = 'none';
            walkInPetFields.style.display = 'none';
            registeredPetField.style.display = 'block';

            // Populate pets
            const option = this.options[this.selectedIndex];
            const pets = JSON.parse(option.dataset.pets || '[]');
            petSelect.innerHTML = '<option value="">-- Select Pet --</option>';
            pets.forEach(pet => {
                petSelect.innerHTML += `<option value="${pet.id}" data-category="${pet.pet_category_id}">${pet.name} (${pet.breed || 'Unknown breed'})</option>`;
            });
        } else {
            walkInFields.style.display = 'block';
            walkInPetFields.style.display = 'block';
            registeredPetField.style.display = 'none';
            petSelect.innerHTML = '<option value="">-- Select Pet --</option>';
        }
    });

    // Handle pet selection to set category
    petSelect.addEventListener('change', function() {
        if (this.value) {
            const option = this.options[this.selectedIndex];
            petCategorySelect.value = option.dataset.category;
            filterServices();
        }
    });

    // Filter services based on pet category
    petCategorySelect.addEventListener('change', filterServices);

    function filterServices() {
        const categoryId = petCategorySelect.value;
        serviceCheckboxes.forEach(checkbox => {
            const categories = checkbox.dataset.categories.split(',');
            const parentDiv = checkbox.closest('.form-check');
            if (!categoryId || categories.includes(categoryId)) {
                parentDiv.style.display = 'block';
            } else {
                parentDiv.style.display = 'none';
                checkbox.checked = false;
            }
        });
        calculateTotal();
    }

    // Calculate total
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });

    function calculateTotal() {
        let total = 0;
        serviceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += parseFloat(checkbox.dataset.price);
            }
        });
        totalAmountEl.textContent = '₱' + total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
});
</script>
@endpush
@endsection

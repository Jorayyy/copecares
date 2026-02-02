@extends('layouts.pet-owner')

@section('title', 'Add Pet')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card shadow">
                <div class="card-header bg-primary text-white">
                    <h4 class="card-title mb-0">
                        <i class="fas fa-paw me-2"></i>Add New Pet
                    </h4>
                </div>

                <form action="{{ route('pet-owner.pets.store') }}" method="POST" enctype="multipart/form-data">
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

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="name" class="form-label">Pet Name <span class="text-danger">*</span></label>
                                    <input type="text" name="name" id="name" 
                                           class="form-control @error('name') is-invalid @enderror"
                                           value="{{ old('name') }}" required placeholder="Enter pet name">
                                    @error('name')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="pet_category_id" class="form-label">Pet Type <span class="text-danger">*</span></label>
                                    <select name="pet_category_id" id="pet_category_id" class="form-select @error('pet_category_id') is-invalid @enderror" required>
                                        <option value="">Select Type</option>
                                        @foreach($categories as $category)
                                            <option value="{{ $category->id }}" {{ old('pet_category_id') == $category->id ? 'selected' : '' }}>
                                                {{ $category->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('pet_category_id')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="breed" class="form-label">Breed</label>
                                    <input type="text" name="breed" id="breed" 
                                           class="form-control @error('breed') is-invalid @enderror"
                                           value="{{ old('breed') }}" placeholder="e.g., Labrador, Persian">
                                    @error('breed')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="gender" class="form-label">Gender</label>
                                    <select name="gender" id="gender" class="form-select @error('gender') is-invalid @enderror">
                                        <option value="">Select Gender</option>
                                        <option value="male" {{ old('gender') == 'male' ? 'selected' : '' }}>Male</option>
                                        <option value="female" {{ old('gender') == 'female' ? 'selected' : '' }}>Female</option>
                                    </select>
                                    @error('gender')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-3">
                                    <label for="date_of_birth" class="form-label">Date of Birth</label>
                                    <input type="date" name="date_of_birth" id="date_of_birth" 
                                           class="form-control @error('date_of_birth') is-invalid @enderror"
                                           value="{{ old('date_of_birth') }}" max="{{ date('Y-m-d') }}">
                                    @error('date_of_birth')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="form-group mb-3">
                                    <label for="weight" class="form-label">Weight (kg)</label>
                                    <input type="number" name="weight" id="weight" step="0.01" min="0"
                                           class="form-control @error('weight') is-invalid @enderror"
                                           value="{{ old('weight') }}" placeholder="0.00">
                                    @error('weight')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="form-group mb-3">
                                    <label for="color" class="form-label">Color</label>
                                    <input type="text" name="color" id="color" 
                                           class="form-control @error('color') is-invalid @enderror"
                                           value="{{ old('color') }}" placeholder="e.g., Black, White">
                                    @error('color')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-3">
                            <label for="microchip_number" class="form-label">Microchip Number (Optional)</label>
                            <input type="text" name="microchip_number" id="microchip_number" 
                                   class="form-control @error('microchip_number') is-invalid @enderror"
                                   value="{{ old('microchip_number') }}" placeholder="Enter microchip number if available">
                            @error('microchip_number')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group mb-3">
                            <label for="photo" class="form-label">Pet Photo</label>
                            <input type="file" name="photo" id="photo" 
                                   class="form-control @error('photo') is-invalid @enderror"
                                   accept="image/*">
                            @error('photo')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                            <small class="text-muted">Upload a photo of your pet (max 2MB)</small>
                        </div>

                        <div class="form-group mb-3">
                            <label for="notes" class="form-label">Additional Notes</label>
                            <textarea name="notes" id="notes" rows="3" 
                                      class="form-control @error('notes') is-invalid @enderror"
                                      placeholder="Any special needs, allergies, or notes about your pet...">{{ old('notes') }}</textarea>
                            @error('notes')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save me-1"></i>Save Pet
                        </button>
                        <a href="{{ route('pet-owner.pets.index') }}" class="btn btn-secondary">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

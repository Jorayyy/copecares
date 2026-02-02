@extends('layouts.pet-owner')

@section('title', 'My Pets')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
                <h2 class="mb-0">
                    <i class="fas fa-paw me-2"></i>My Pets
                </h2>
                <a href="{{ route('pet-owner.pets.create') }}" class="btn btn-primary">
                    <i class="fas fa-plus me-1"></i>Add New Pet
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

    <div class="row">
        @forelse($pets as $pet)
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="text-center pt-4">
                        @if($pet->photo)
                            <img src="{{ Storage::url($pet->photo) }}" alt="{{ $pet->name }}" 
                                 class="rounded-circle" width="120" height="120" style="object-fit: cover;">
                        @else
                            <div class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                                 style="width: 120px; height: 120px;">
                                <i class="fas fa-paw fa-3x"></i>
                            </div>
                        @endif
                    </div>
                    <div class="card-body text-center">
                        <h5 class="card-title mb-1">{{ $pet->name }}</h5>
                        <p class="text-muted mb-2">
                            {{ $pet->category->name ?? 'Unknown' }} • {{ $pet->breed ?? 'Unknown Breed' }}
                        </p>
                        
                        @if($pet->gender)
                            @if($pet->gender == 'male')
                                <span class="badge bg-info mb-2"><i class="fas fa-mars me-1"></i>Male</span>
                            @else
                                <span class="badge mb-2" style="background-color: #e91e63;"><i class="fas fa-venus me-1"></i>Female</span>
                            @endif
                        @endif
                        
                        @if($pet->date_of_birth)
                            <p class="text-muted small mb-2">
                                <i class="fas fa-birthday-cake me-1"></i>{{ $pet->date_of_birth->age }} years old
                            </p>
                        @endif
                    </div>
                    <div class="card-footer bg-transparent text-center">
                        <a href="{{ route('pet-owner.pets.show', $pet) }}" class="btn btn-outline-primary btn-sm me-1">
                            <i class="fas fa-eye me-1"></i>View
                        </a>
                        <a href="{{ route('pet-owner.pets.edit', $pet) }}" class="btn btn-outline-warning btn-sm me-1">
                            <i class="fas fa-edit me-1"></i>Edit
                        </a>
                        <a href="{{ route('pet-owner.appointments.create') }}?pet_id={{ $pet->id }}" class="btn btn-outline-success btn-sm">
                            <i class="fas fa-calendar-plus me-1"></i>Book
                        </a>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-12">
                <div class="card">
                    <div class="card-body text-center py-5">
                        <i class="fas fa-paw fa-4x text-muted mb-3"></i>
                        <h4 class="text-muted">No pets registered yet</h4>
                        <p class="text-muted">Add your first pet to get started with appointments and health tracking.</p>
                        <a href="{{ route('pet-owner.pets.create') }}" class="btn btn-primary btn-lg">
                            <i class="fas fa-plus me-2"></i>Add Your First Pet
                        </a>
                    </div>
                </div>
            </div>
        @endforelse
    </div>
</div>
@endsection

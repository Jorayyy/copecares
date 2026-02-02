@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Create Medical Record</h1>
        </div>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger alert-dismissible fade show">
            <strong>Errors:</strong>
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <form method="POST" action="{{ route('admin.medical-records.store') }}">
                @csrf

                <div class="form-group">
                    <label for="pet_id">Pet *</label>
                    <select class="form-control @error('pet_id') is-invalid @enderror" 
                            id="pet_id" name="pet_id" required>
                        <option value="">-- Select Pet --</option>
                        @foreach ($pets as $pet)
                            <option value="{{ $pet->id }}" {{ old('pet_id') == $pet->id ? 'selected' : '' }}>
                                {{ $pet->name }} ({{ $pet->category->name ?? 'Unknown' }})
                            </option>
                        @endforeach
                    </select>
                    @error('pet_id')
                        <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="record_date">Record Date *</label>
                    <input type="datetime-local" class="form-control @error('record_date') is-invalid @enderror" 
                           id="record_date" name="record_date" value="{{ old('record_date') }}" required>
                    @error('record_date')
                        <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="type">Record Type *</label>
                    <select class="form-control @error('type') is-invalid @enderror" 
                            id="type" name="type" required>
                        <option value="">-- Select Type --</option>
                        <option value="checkup" {{ old('type') === 'checkup' ? 'selected' : '' }}>Check-up</option>
                        <option value="vaccination" {{ old('type') === 'vaccination' ? 'selected' : '' }}>Vaccination</option>
                        <option value="surgery" {{ old('type') === 'surgery' ? 'selected' : '' }}>Surgery</option>
                        <option value="treatment" {{ old('type') === 'treatment' ? 'selected' : '' }}>Treatment</option>
                    </select>
                    @error('type')
                        <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="notes">Notes</label>
                    <textarea class="form-control @error('notes') is-invalid @enderror" 
                              id="notes" name="notes" rows="4">{{ old('notes') }}</textarea>
                    @error('notes')
                        <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <div class="form-group">
                    <button type="submit" class="btn btn-primary">Create Record</button>
                    <a href="{{ route('admin.medical-records.index') }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
